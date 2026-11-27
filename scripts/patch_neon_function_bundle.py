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

anchor = "function syntheticCandidate() {"
if source.count(anchor) != 1:
    raise SystemExit("expected one syntheticCandidate anchor")
source = source.replace(anchor, helper + anchor, 1)


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
  if (!match) return false;
  const tokenHash = digest(match[1]);
  const result = await sql('SELECT subject FROM runtime.validate_api_token($1,$2)', [tokenHash, requiredScope]);
  return result.rows.length === 1;
}

async function authorizeCron(secret) {
  const result = await sql('SELECT subject FROM runtime.validate_cron_token($1,$2)', [digest(secret), 'dispatch:run']);
  return result.rows.length === 1;
}

function requiredApiScope(request, pathname) {
  if (request.method === 'GET' && pathname === '/v1/agents') return 'agents:read';
  if (request.method === 'POST' && pathname === '/v1/demo') return 'demo:run';
  if (request.method === 'POST' && pathname === '/v1/tasks') return 'tasks:write';
  if (request.method === 'GET' && pathname === '/v1/metrics') return 'metrics:read';
  if (request.method === 'GET' && /^\\/v1\\/tasks\\/[0-9a-f-]{36}$/i.test(pathname)) return 'tasks:read:any';
  if (request.method === 'POST' && pathname === '/a2a/v1/messages') return 'a2a:write';
  return null;
}
"""
if source.count(auth_old) != 1:
    raise SystemExit("token authorization patch anchor mismatch")
source = source.replace(auth_old, auth_new, 1)

old_auth_gate = """      if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/a2a/')) {
        if (!await authorize(request)) return json({ error: 'UNAUTHORIZED' }, 401);
      }"""
new_auth_gate = """      if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/a2a/')) {
        const requiredScope = requiredApiScope(request, url.pathname);
        if (!requiredScope) return json({ error: 'NOT_FOUND' }, 404);
        if (!await authorize(request, requiredScope)) return json({ error: 'UNAUTHORIZED' }, 401);
      }"""
if source.count(old_auth_gate) != 1:
    raise SystemExit("route-scope authorization patch anchor mismatch")
source = source.replace(old_auth_gate, new_auth_gate, 1)

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
