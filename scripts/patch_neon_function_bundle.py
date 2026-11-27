#!/usr/bin/env python3
"""Build a deterministic, corrected Neon Function ZIP from the archived deployment bundle.

This patch preserves the existing seven-role flow. It fixes the Postgres JSON/JSONB
wire-format boundary: Neon SQL protocol row values may arrive as JSON text rather
than decoded objects. It also normalizes the receipt field used by revenue handoff.
No secrets are included in the bundle.
"""
from __future__ import annotations

import base64
import hashlib
import io
import pathlib
import re
import sys
import zipfile

if len(sys.argv) != 3:
    raise SystemExit("usage: patch_neon_function_bundle.py INPUT_B64 OUTPUT_ZIP")

source_path = pathlib.Path(sys.argv[1])
output_path = pathlib.Path(sys.argv[2])
encoded = source_path.read_text(encoding="ascii").strip()
archive = base64.b64decode(encoded, validate=True)

with zipfile.ZipFile(io.BytesIO(archive), "r") as original:
    names = original.namelist()
    if names != ["index.mjs"]:
        raise SystemExit(f"unexpected bundle entries: {names!r}")
    source = original.read("index.mjs").decode("utf-8")

helper = """function parseObject(value) {
  // Neon/PostgreSQL protocol adapters can expose JSONB as text or UTF-8 bytes.
  if (value instanceof Uint8Array) {
    try { return parseObject(new TextDecoder().decode(value)); } catch { return {}; }
  }
  if (Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 0 && item <= 255)) {
    try { return parseObject(new TextDecoder().decode(new Uint8Array(value))); } catch { return {}; }
  }
  if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
    try { return parseObject(new TextDecoder().decode(new Uint8Array(value.data))); } catch { return {}; }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // Invalid/unexpected JSON fails closed to an empty object.
    }
  }
  return {};
}

"""

oidc_helper_path = pathlib.Path(__file__).with_name("github_actions_oidc_auth.mjs")
if not oidc_helper_path.is_file():
    raise SystemExit("missing GitHub Actions OIDC verifier source")
oidc_helper = oidc_helper_path.read_text(encoding="utf-8")
if "GITHUB_OIDC_SUBJECT" not in oidc_helper or "verifyGithubActionsOidc" not in oidc_helper:
    raise SystemExit("unexpected GitHub Actions OIDC verifier source")
oidc_helper = oidc_helper.replace("export async function ", "async function ").replace("export function ", "function ")

anchor = "function syntheticCandidate() {"
if source.count(anchor) != 1:
    raise SystemExit("expected one syntheticCandidate anchor")
source = source.replace(anchor, oidc_helper + "\n" + helper + anchor, 1)


auth_old = """async function authorize(request) {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\\s+(.+)$/i);
  if (!match) return false;
  const tokenHash = digest(match[1]);
  const result = await sql('SELECT 1 AS ok FROM runtime.api_tokens WHERE token_hash=$1 AND enabled=true LIMIT 1', [tokenHash]);
  return result.rows.length === 1;
}

async function authorizeCron(secret) {
  const result = await sql('SELECT 1 AS ok FROM runtime.cron_tokens WHERE token_hash=$1 AND enabled=true LIMIT 1', [digest(secret)]);
  return result.rows.length === 1;
}
"""
auth_new = """async function authorize(request, requiredScope) {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\\s+(.+)$/i);
  if (!match) return null;
  const tokenHash = digest(match[1]);
  const result = await sql('SELECT subject FROM runtime.validate_api_token($1,$2)', [tokenHash, requiredScope]);
  if (typeof result.rows[0]?.subject === 'string') return result.rows[0].subject;
  // A GitHub Actions workload identity is accepted only for this read-only CI metrics canary.
  if (requiredScope === 'metrics:read' && await verifyGithubActionsOidc(match[1], {
    onFailure: (reason) => console.info('GITHUB_OIDC_METRICS_AUTH_DENIED', reason)
  })) {
    console.info('GITHUB_OIDC_METRICS_AUTH_ACCEPTED', 'repo:1468220353');
    return 'github-actions:repo:1468220353';
  }
  return null;
}

// Neon strips caller-supplied x-neon-* headers at its Functions edge.
const EXPECTED_SCHEDULE_TRIGGER_ID = 'trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71';

async function authorizeCron(request) {
  const invocationId = request.headers.get('x-neon-trigger-invocation-id') ?? '';
  if (request.method !== 'POST' || !/^[A-Za-z0-9_-]{16,128}$/.test(invocationId)) return false;
  let body;
  try { body = await request.clone().json(); } catch { return false; }
  return body?.version === 1
    && body?.invocation_id === invocationId
    && body?.trigger?.type === 'schedule'
    && body?.trigger?.id === EXPECTED_SCHEDULE_TRIGGER_ID;
}

function requiredApiScope(request, pathname) {
  if (request.method === 'GET' && pathname === '/v1/agents') return 'agents:read';
  if (request.method === 'POST' && pathname === '/v1/demo') return 'demo:run';
  if (request.method === 'POST' && pathname === '/v1/tasks') return 'tasks:write';
  if (request.method === 'GET' && pathname === '/v1/metrics') return 'metrics:read';
  if (request.method === 'GET' && /^\\/v1\\/tasks\\/[0-9a-f-]{36}$/i.test(pathname)) return 'tasks:read:own';
  if (request.method === 'POST' && pathname === '/a2a/v1/messages') return 'a2a:write';
  return null;
}
"""
if source.count(auth_old) != 1:
    raise SystemExit("token authorization patch anchor mismatch")
source = source.replace(auth_old, auth_new, 1)

# Replace the secret-bearing path with a fixed Neon-trigger-only route.
# The request is authenticated by Neon's edge-stripped x-neon header and body correlation.
source, dispatch_path_matches = re.subn(
    r"url\.pathname\.match\(\s*/[^;\n]*internal[^;\n]*dispatch[^;\n]*\)",
    "url.pathname === '/internal/dispatch'",
    source,
    count=1,
)
if dispatch_path_matches != 1:
    raise SystemExit("expected exactly one secret-bearing internal dispatch path matcher")
source, cron_call_matches = re.subn(
    r"authorizeCron\(\s*cronMatch\[1\]\s*\)",
    "authorizeCron(request)",
    source,
    count=1,
)
if cron_call_matches != 1:
    raise SystemExit("expected one secret-bearing cron authorization call")

old_auth_gate = """      if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/a2a/')) {
        if (!await authorize(request)) return json({ error: 'UNAUTHORIZED' }, 401);
      }"""
new_auth_gate = """      let requestSubject = null;
      if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/a2a/')) {
        const requiredScope = requiredApiScope(request, url.pathname);
        if (!requiredScope) return json({ error: 'NOT_FOUND' }, 404);
        requestSubject = await authorize(request, requiredScope);
        if (!requestSubject) return json({ error: 'UNAUTHORIZED' }, 401);
      }"""
if source.count(old_auth_gate) != 1:
    raise SystemExit("route-scope authorization patch anchor mismatch")
source = source.replace(old_auth_gate, new_auth_gate, 1)

# Bind each task and its derived messages/metrics to the authenticated token subject.
old_demo_insert = """await sql("INSERT INTO runtime.tasks (id,task_type,status,payload) VALUES ($1,'demo_e2e','queued',$2::jsonb)", [id, JSON.stringify({ synthetic_test: true })]);"""
new_demo_insert = """await sql("INSERT INTO runtime.tasks (id,task_type,status,payload,owner_subject) VALUES ($1,'demo_e2e','queued',$2::jsonb,$3)", [id, JSON.stringify({ synthetic_test: true }), requestSubject]);"""
if source.count(old_demo_insert) != 1:
    raise SystemExit("demo task ownership insertion anchor mismatch")
source = source.replace(old_demo_insert, new_demo_insert, 1)

old_task_insert = """await sql('INSERT INTO runtime.tasks (id,task_type,status,payload,idempotency_key) VALUES ($1,$2,\\'queued\\',$3::jsonb,$4)', [id, body.task_type, JSON.stringify(body), request.headers.get('idempotency-key')]);"""
new_task_insert = """await sql('INSERT INTO runtime.tasks (id,task_type,status,payload,idempotency_key,owner_subject) VALUES ($1,$2,\\'queued\\',$3::jsonb,$4,$5)', [id, body.task_type, JSON.stringify(body), request.headers.get('idempotency-key'), requestSubject]);"""
if source.count(old_task_insert) != 1:
    raise SystemExit("opportunity task ownership insertion anchor mismatch")
source = source.replace(old_task_insert, new_task_insert, 1)

old_task_read = """const result = await sql('SELECT id::text AS id, task_type, status, attempt_count, payload, result, created_at, updated_at, completed_at, last_error FROM runtime.tasks WHERE id=$1::uuid', [taskMatch[1]]);"""
new_task_read = """const result = await sql('SELECT id::text AS id, task_type, status, attempt_count, payload, result, created_at, updated_at, completed_at, last_error FROM runtime.tasks WHERE id=$1::uuid AND owner_subject=$2', [taskMatch[1], requestSubject]);"""
if source.count(old_task_read) != 1:
    raise SystemExit("owner-filtered task-read anchor mismatch")
source = source.replace(old_task_read, new_task_read, 1)

old_metrics = """const tasks = await sql("SELECT count(*)::int AS total,count(*) FILTER (WHERE status='queued')::int AS queued,count(*) FILTER (WHERE status='running')::int AS running,count(*) FILTER (WHERE status='completed')::int AS completed,count(*) FILTER (WHERE status='failed')::int AS failed FROM runtime.tasks");
        const messages = await sql('SELECT count(*)::int AS count FROM runtime.agent_messages');
        return json({ tasks: tasks.rows[0], agent_messages: Number(messages.rows[0]?.count ?? 0) });"""
new_metrics = """const tasks = await sql("SELECT count(*)::int AS total,count(*) FILTER (WHERE status='queued')::int AS queued,count(*) FILTER (WHERE status='running')::int AS running,count(*) FILTER (WHERE status='completed')::int AS completed,count(*) FILTER (WHERE status='failed')::int AS failed FROM runtime.tasks WHERE owner_subject=$1", [requestSubject]);
        const messages = await sql('SELECT count(*)::int AS count FROM runtime.agent_messages m JOIN runtime.tasks t ON t.id=m.task_id WHERE t.owner_subject=$1', [requestSubject]);
        return json({ tasks: tasks.rows[0], agent_messages: Number(messages.rows[0]?.count ?? 0) });"""
if source.count(old_metrics) != 1:
    raise SystemExit("owner-filtered metrics anchor mismatch")
source = source.replace(old_metrics, new_metrics, 1)

old_a2a_insert = """        const id = randomUUID();
        await sql('INSERT INTO runtime.agent_messages (id,task_id,correlation_id,from_agent,to_agent,message_type,payload) VALUES ($1,$2::uuid,$2::uuid,$3,$4,$5,$6::jsonb)', [id, body.task_id, String(body.from_agent).slice(0,100), String(body.to_agent).slice(0,100), String(body.message_type).slice(0,100), JSON.stringify(body.payload)]);"""
new_a2a_insert = """        const taskAccess = await sql('SELECT id FROM runtime.tasks WHERE id=$1::uuid AND owner_subject=$2', [body.task_id, requestSubject]);
        if (!taskAccess.rows[0]) return json({ error: 'TASK_NOT_FOUND' }, 404);
        const id = randomUUID();
        await sql('INSERT INTO runtime.agent_messages (id,task_id,correlation_id,from_agent,to_agent,message_type,payload) VALUES ($1,$2::uuid,$2::uuid,$3,$4,$5,$6::jsonb)', [id, body.task_id, String(body.from_agent).slice(0,100), String(body.to_agent).slice(0,100), String(body.message_type).slice(0,100), JSON.stringify(body.payload)]);"""
if source.count(old_a2a_insert) != 1:
    raise SystemExit("A2A task-owner validation anchor mismatch")
source = source.replace(old_a2a_insert, new_a2a_insert, 1)

json_helper_anchor = """function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
"""
json_helper_new = json_helper_anchor + """
async function readJsonBounded(request) {
  const maxBytes = 65536;
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > maxBytes) throw new Error('REQUEST_BODY_TOO_LARGE');
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new Error('REQUEST_BODY_TOO_LARGE');
  try { return JSON.parse(raw); } catch { throw new Error('INVALID_JSON'); }
}
"""
if source.count(json_helper_anchor) != 1:
    raise SystemExit("bounded JSON helper anchor mismatch")
source = source.replace(json_helper_anchor, json_helper_new, 1)

if source.count("const body = await request.json();") != 2:
    raise SystemExit("expected exactly two JSON request parsing sites")
source = source.replace("const body = await request.json();", "const body = await readJsonBounded(request);")

old_catch = """    } catch (error) {
      return json({ error: 'RUNTIME_ERROR', message: String(error?.message ?? 'UNKNOWN').slice(0, 400) }, 500);
    }"""
new_catch = """    } catch (error) {
      if (error?.message === 'REQUEST_BODY_TOO_LARGE') return json({ error: 'PAYLOAD_TOO_LARGE' }, 413);
      if (error?.message === 'INVALID_JSON') return json({ error: 'INVALID_JSON' }, 400);
      return json({ error: 'RUNTIME_ERROR', request_id: randomUUID() }, 500);
    }"""
if source.count(old_catch) != 1:
    raise SystemExit("error sanitization patch anchor mismatch")
source = source.replace(old_catch, new_catch, 1)

old_candidate = """  const candidate = task.task_type === 'demo_e2e' ? syntheticCandidate() : (task.payload?.candidate ?? {});"""
new_candidate = """  const taskPayload = parseObject(task.payload);
  const candidate = task.task_type === 'demo_e2e' ? syntheticCandidate() : (parseObject(taskPayload.candidate));"""
if source.count(old_candidate) != 1:
    raise SystemExit("candidate normalization patch anchor mismatch")
source = source.replace(old_candidate, new_candidate, 1)

old_receipt = """  const revenue = task.payload?.receipt && Object.keys(task.payload.receipt).length"""
new_receipt = """  const revenue = taskPayload.receipt && Object.keys(taskPayload.receipt).length"""
if source.count(old_receipt) != 1:
    raise SystemExit("receipt normalization patch anchor mismatch")
source = source.replace(old_receipt, new_receipt, 1)

old_ready = """const result = await sql('SELECT 1 AS healthy, current_database() AS database_name');"""
new_ready = """const result = await sql('SELECT 1 AS healthy, current_database() AS database_name, current_user AS database_role, cp.governor_state, cp.work_allowed FROM runtime.control_plane cp WHERE cp.singleton_id IS TRUE');"""
if source.count(old_ready) != 1:
    raise SystemExit("readiness role identity patch anchor mismatch")
source = source.replace(old_ready, new_ready, 1)

old_ready_json = """database_name: result.rows[0]?.database_name ?? null, runtime_schema_tables:"""
new_ready_json = """database_name: result.rows[0]?.database_name ?? null, database_role: result.rows[0]?.database_role ?? null, governor_state: result.rows[0]?.governor_state ?? 'UNKNOWN', work_allowed: result.rows[0]?.work_allowed === true, runtime_schema_tables:"""
if source.count(old_ready_json) != 1:
    raise SystemExit("readiness Governor JSON patch anchor mismatch")
source = source.replace(old_ready_json, new_ready_json, 1)

old_tables = """const tables = await sql("SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema='runtime' AND table_name IN ('tasks','agent_messages','audit_events','opportunity_candidates','api_tokens','cron_tokens')");"""
new_tables = """const tables = await sql("SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema='runtime' AND table_name IN ('tasks','agent_messages','audit_events','opportunity_candidates')");"""
if source.count(old_tables) != 1:
    raise SystemExit("Function readiness table-count patch anchor mismatch")
source = source.replace(old_tables, new_tables, 1)

old_returning = """RETURNING t.id::text AS id, t.task_type, t.payload, t.attempt_count, t.max_attempts"""
new_returning = """RETURNING t.id::text AS id, t.task_type, t.payload::text AS payload, t.attempt_count, t.max_attempts"""
if source.count(old_returning) != 1:
    raise SystemExit("task-claim payload cast patch anchor mismatch")
source = source.replace(old_returning, new_returning, 1)

if "FROM runtime.api_tokens WHERE token_hash" in source or "FROM runtime.cron_tokens WHERE token_hash" in source:
    raise SystemExit("blanket token-table lookup remains after scope-aware auth patch")
if "request.json()" in source:
    raise SystemExit("unbounded request JSON parsing remains")
if "message: String(error?.message" in source:
    raise SystemExit("raw runtime error detail may leak to clients")
if "runtime_schema_tables:" in source and "api_tokens','cron_tokens" in source:
    raise SystemExit("readiness still counts hidden credential tables")
if "tasks:read:any" in source or "tasks:read:own" not in source:
    raise SystemExit("legacy any-task-read scope remains or own-task scope is missing")
if "WHERE id=$1::uuid AND owner_subject=$2" not in source:
    raise SystemExit("task reads are not scoped to authenticated owner")
if "FROM runtime.tasks WHERE owner_subject=$1" not in source:
    raise SystemExit("task metrics are not scoped to authenticated owner")
if "owner_subject) VALUES" not in source:
    raise SystemExit("task creation does not persist authenticated owner")
if "const taskAccess = await sql(" not in source:
    raise SystemExit("A2A task ownership check is missing")

if "cronMatch[1]" in source or "dispatchMatch[1]" in source or "/internal/dispatch/" in source:
    raise SystemExit("secret-bearing dispatch URL path remains")
if "authorizeCron(request)" not in source:
    raise SystemExit("Neon trigger provenance validation is not wired to dispatch")
if "task.payload?.candidate" in source or "task.payload?.receipt" in source:
    raise SystemExit("un-normalized task payload access remains")

buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output:
    output.writestr("index.mjs", source.encode("utf-8"))

payload = buffer.getvalue()
output_path.write_bytes(payload)
print("PATCHED_FUNCTION_SHA256=" + hashlib.sha256(source.encode("utf-8")).hexdigest())
print("PATCHED_ZIP_BYTES=" + str(len(payload)))
print("PATCHED_FUNCTION_BASE64_BEGIN")
print(base64.b64encode(payload).decode("ascii"))
print("PATCHED_FUNCTION_BASE64_END")
