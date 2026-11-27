import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../db/migrations/pilot/20261127_scoped_token_lifecycle.sql', import.meta.url),
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

test('deterministic Function bundle patcher uses scope-aware DB validators', () => {
  assert.ok(patcher.includes('runtime.validate_api_token($1,$2)'));
  assert.ok(patcher.includes('runtime.validate_cron_token($1,$2)'));
  assert.ok(patcher.includes('requiredApiScope'));
  assert.ok(patcher.includes('tasks:read:any'));
  assert.ok(patcher.includes('dispatch:run'));
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
