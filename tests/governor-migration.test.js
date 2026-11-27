import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../db/migrations/pilot/20261127_fail_closed_governor.sql', import.meta.url),
  'utf8'
);
const recoveryTest = readFileSync(
  new URL('../db/tests/pilot/verify_governor_pause_running_recovery.sql', import.meta.url),
  'utf8'
);

function policyBlock(name) {
  const start = migration.indexOf(`CREATE POLICY ${name}`);
  assert.notEqual(start, -1, `missing policy: ${name}`);
  const end = migration.indexOf(';', start);
  assert.notEqual(end, -1, `unterminated policy: ${name}`);
  return migration.slice(start, end + 1);
}

test('Function control-plane access is least privilege', () => {
  assert.ok(migration.includes('REVOKE ALL PRIVILEGES ON runtime.control_plane FROM crypto_holdco_function'));
  assert.ok(migration.includes('GRANT SELECT ON runtime.control_plane TO crypto_holdco_function'));
});

test('task SELECT visibility fails closed unless Governor is RUNNING', () => {
  const block = policyBlock('runtime_tasks_select_governor_gate');
  assert.ok(block.includes('FOR SELECT'));
  assert.ok(block.includes("governor_state='RUNNING'"));
  assert.ok(block.includes('work_allowed IS TRUE'));
});

test('task UPDATE execution fails closed unless Governor is RUNNING', () => {
  const block = policyBlock('runtime_tasks_update_governor_gate');
  assert.ok(block.includes('FOR UPDATE'));
  assert.ok(block.includes("governor_state='RUNNING'"));
  assert.ok(block.includes('work_allowed IS TRUE'));
  assert.ok(block.includes('WITH CHECK'));
});

test('SELECT policy allows the claimed running tuple returned by dispatcher', () => {
  const block = policyBlock('runtime_tasks_select_governor_gate');
  assert.equal(block.includes("status='queued'"), false);
  assert.ok(recoveryTest.includes('FOR UPDATE SKIP LOCKED'));
});
