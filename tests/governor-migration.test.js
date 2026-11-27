import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../db/migrations/pilot/20261127_fail_closed_governor.sql', import.meta.url),
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
  assert.match(migration, /REVOKE ALL PRIVILEGES ON runtime\.control_plane FROM crypto_holdco_function/);
  assert.match(migration, /GRANT SELECT ON runtime\.control_plane TO crypto_holdco_function/);
});

test('task SELECT visibility fails closed unless Governor is RUNNING', () => {
  const block = policyBlock('runtime_tasks_select_governor_gate');
  assert.match(block, /FOR SELECT/);
  assert.match(block, /governor_state='RUNNING'/);
  assert.match(block, /work_allowed IS TRUE/);
});

test('task UPDATE execution fails closed unless Governor is RUNNING', () => {
  const block = policyBlock('runtime_tasks_update_governor_gate');
  assert.match(block, /FOR UPDATE/);
  assert.match(block, /governor_state='RUNNING'/);
  assert.match(block, /work_allowed IS TRUE/);
  assert.match(block, /WITH CHECK/);
});

test('SELECT policy does not hide the claimed running tuple from UPDATE RETURNING', () => {
  const block = policyBlock('runtime_tasks_select_governor_gate');
  assert.doesNotMatch(block, /status\s*=\s*'queued'/);
  assert.match(migration, /SELECT \*\.\.\. FOR UPDATE SKIP LOCKED/i);
});
