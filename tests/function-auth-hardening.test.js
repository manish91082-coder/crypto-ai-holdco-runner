import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../db/migrations/pilot/20261127_scoped_token_lifecycle.sql', import.meta.url),
  'utf8'
);
const canaryMigration = readFileSync(
  new URL('../db/migrations/pilot/20261127_ci_auth_canary.sql', import.meta.url),
  'utf8'
);
const patcher = readFileSync(
  new URL('../scripts/patch_neon_function_bundle.py', import.meta.url),
  'utf8'
);

test('credential schema enforces expiry, revocation and explicit scopes', () => {
  assert.ok(migration.includes('ADD COLUMN IF NOT EXISTS scopes'));
  assert.ok(migration.includes('ADD COLUMN IF NOT EXISTS expires_at'));
  assert.ok(migration.includes('ADD COLUMN IF NOT EXISTS revoked_at'));
  assert.ok(migration.includes('scopes_nonempty'));
  assert.ok(migration.includes('expires_at>created_at'));
});

test('token validator is security-definer and scope/expiry aware', () => {
  assert.ok(migration.includes('SECURITY DEFINER'));
  assert.ok(migration.includes('p_required_scope=ANY(t.scopes)'));
  assert.ok(migration.includes('t.expires_at>statement_timestamp()'));
  assert.ok(migration.includes('t.revoked_at IS NULL'));
});

test('Function role receives only validator execution, not token-table SELECT', () => {
  assert.ok(migration.includes('REVOKE ALL PRIVILEGES ON runtime.api_tokens FROM crypto_holdco_function'));
  assert.ok(migration.includes('REVOKE ALL PRIVILEGES ON runtime.cron_tokens FROM crypto_holdco_function'));
  assert.ok(migration.includes('GRANT EXECUTE ON FUNCTION runtime.validate_api_token(text,text) TO crypto_holdco_function'));
  assert.ok(migration.includes('GRANT EXECUTE ON FUNCTION runtime.validate_cron_token(text,text) TO crypto_holdco_function'));
});

test('deterministic Function bundle patcher uses scoped API validators and Neon trigger provenance', () => {
  assert.ok(patcher.includes('runtime.validate_api_token($1,$2)'));
  assert.ok(patcher.includes('requiredApiScope'));
  assert.ok(patcher.includes('tasks:read:own'));
  assert.ok(patcher.includes('x-neon-trigger-invocation-id'));
  assert.ok(patcher.includes('body?.invocation_id === invocationId'));
  assert.ok(patcher.includes("body?.trigger?.type === 'schedule'"));
});

test('request boundary and error sanitizer do not expose raw SQL detail', () => {
  assert.ok(patcher.includes('readJsonBounded'));
  assert.ok(patcher.includes('maxBytes = 65536'));
  assert.ok(patcher.includes("request_id: randomUUID()"));
  assert.ok(patcher.includes("request_id: randomUUID()"));
  assert.ok(patcher.includes("old_catch ="));
  assert.ok(patcher.includes("new_catch ="));
  assert.ok(patcher.includes("PAYLOAD_TOO_LARGE"));
  assert.ok(patcher.includes("INVALID_JSON"));
});


test('patched source fails closed on legacy auth and unsafe handlers', () => {
  assert.ok(patcher.includes('blanket token-table lookup remains after scope-aware auth patch'));
  assert.ok(patcher.includes('unbounded request JSON parsing remains'));
  assert.ok(patcher.includes('raw runtime error detail may leak to clients'));
});


test('successful validators persist last-used timestamps', () => {
  assert.ok(migration.includes('SET last_used_at=statement_timestamp()'));
  assert.ok(migration.includes('LANGUAGE plpgsql'));
  assert.ok(migration.includes('VOLATILE'));
});


test('Function patcher returns authenticated subjects and removes any-task-read', () => {
  assert.ok(patcher.includes('requestSubject = await authorize(request, requiredScope)'));
  assert.ok(patcher.includes("if (typeof result.rows[0]?.subject === 'string') return result.rows[0].subject;"));
  assert.ok(patcher.includes("'tasks:read:own'"));
  assert.ok(patcher.includes('if "tasks:read:any" in source'));
});

test('task and A2A reads are bound to the authenticated subject', () => {
  assert.ok(patcher.includes('owner_subject=$2'));
  assert.ok(patcher.includes('FROM runtime.tasks WHERE owner_subject=$1'));
  assert.ok(patcher.includes('const taskAccess = await sql('));
  assert.ok(patcher.includes('requestSubject]);'));
  assert.ok(patcher.includes('owner_subject) VALUES'));
});

test('Neon scheduled dispatch uses edge-attested invocation envelope, never a URL secret', () => {
  assert.ok(patcher.includes("x-neon-trigger-invocation-id"));
  assert.ok(patcher.includes("EXPECTED_SCHEDULE_TRIGGER_ID"));
  assert.ok(patcher.includes("body?.invocation_id === invocationId"));
  assert.ok(patcher.includes("body?.trigger?.id === EXPECTED_SCHEDULE_TRIGGER_ID"));
  assert.ok(patcher.includes("url.pathname === '/internal/dispatch'"));
  assert.ok(patcher.includes("authorizeCron(request)"));
  assert.ok(patcher.includes("secret-bearing dispatch URL path remains"));
});

test('GitHub Actions OIDC is a metrics-read-only identity, not a general API bearer', () => {
  assert.ok(patcher.includes('verifyGithubActionsOidc(match[1], {'));
  assert.ok(patcher.includes("requiredScope === 'metrics:read'"));
  assert.ok(patcher.includes("'github-actions:repo:1468220353'"));
  assert.ok(patcher.includes('runtime.validate_api_token($1,$2)'));
});


test('CI-only canary issue and revoke use only a signed workflow-run identity', () => {
  assert.ok(patcher.includes("randomBytes(32).toString('hex')"));
  assert.ok(patcher.includes('verifiedCiAuthCanaryRun'));
  assert.ok(patcher.includes('runtime.issue_ci_auth_canary($1,$2,$3)'));
  assert.ok(patcher.includes('runtime.revoke_ci_auth_canary($1,$2)'));
  assert.ok(patcher.includes('ci-auth-canary:'));
  assert.ok(canaryMigration.includes("ARRAY['metrics:read']"));
});


test('Google Apps Script scheduler route is identity-bound, fail-closed and one-task bounded', () => {
  assert.ok(patcher.includes('verifyGoogleAppsScriptOidc'));
  assert.ok(patcher.includes('GOOGLE_APPS_SCRIPT_CLIENT_ID'));
  assert.ok(patcher.includes('GOOGLE_APPS_SCRIPT_OWNER_SUB_SHA256'));
  assert.ok(patcher.includes("GOOGLE_APPS_SCRIPT_SCHEDULER_ENABLED !== 'true'"));
  assert.ok(patcher.includes("control.governor_state !== 'RUNNING'"));
  assert.ok(patcher.includes('await dispatch(1)'));
  assert.ok(patcher.includes('/internal/google/scheduler/dispatch'));
});


test('Google Apps Script scheduler consumes an atomic token-and-tick replay guard before dispatch', () => {
  assert.ok(patcher.includes('runtime.consume_google_scheduler_tick($1::uuid,$2,$3::timestamptz)'));
  assert.ok(patcher.includes('identity.tokenHash'));
  assert.ok(patcher.includes('identity.tokenExpiresAt'));
  assert.ok(patcher.includes('Object.keys(body).length !== 1'));
  assert.ok(patcher.includes('DUPLICATE_SCHEDULER_TICK'));
  assert.ok(patcher.includes('GOOGLE_APPS_SCRIPT_REPLAY_DENIED'));
});
