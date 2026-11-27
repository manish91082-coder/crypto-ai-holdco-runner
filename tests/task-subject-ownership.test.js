import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../db/migrations/pilot/20261127_task_subject_ownership.sql', import.meta.url),
  'utf8'
);
const patcher = readFileSync(
  new URL('../scripts/patch_neon_function_bundle.py', import.meta.url),
  'utf8'
);
const recovery = readFileSync(
  new URL('../db/tests/pilot/verify_governor_pause_running_recovery.sql', import.meta.url),
  'utf8'
);

test('ownership migration backfills only explicitly synthetic pilot tasks', () => {
  assert.ok(migration.includes("task_type='demo_e2e' AND payload->>'synthetic_test'='true'"));
  assert.ok(migration.includes("'SYNTHETIC_TEST_FIXTURE','SYNTHETIC_NEGATIVE_CONTROL'"));
  assert.ok(migration.includes('non-synthetic task exists without an owner'));
  assert.ok(migration.includes('ALTER COLUMN owner_subject SET NOT NULL'));
  assert.ok(migration.includes("SET owner_subject='owner-operator-pilot'"));
});

test('single-operator token loses tasks:read:any and receives tasks:read:own', () => {
  assert.ok(migration.includes("array_remove(scopes,'tasks:read:any')"));
  assert.ok(migration.includes("ARRAY['tasks:read:own']::text[]"));
  assert.ok(migration.includes("subject='owner-operator-pilot'"));
});

test('API route requires the own-task scope and preserves token subject', () => {
  assert.ok(patcher.includes("return 'tasks:read:own';"));
  assert.ok(patcher.includes('requestSubject = await authorize(request, requiredScope)'));
  assert.ok(patcher.includes("return typeof result.rows[0]?.subject === 'string'"));
  assert.ok(patcher.includes('if "tasks:read:any" in source'));
});

test('task creation, task reads, metrics and A2A are subject-bound', () => {
  assert.ok(patcher.includes('owner_subject) VALUES'));
  assert.ok(patcher.includes('WHERE id=$1::uuid AND owner_subject=$2'));
  assert.ok(patcher.includes('FROM runtime.tasks WHERE owner_subject=$1'));
  assert.ok(patcher.includes('JOIN runtime.tasks t ON t.id=m.task_id WHERE t.owner_subject=$1'));
  assert.ok(patcher.includes('const taskAccess = await sql('));
  assert.ok(patcher.includes("return json({ error: 'TASK_NOT_FOUND' }, 404)"));
});

test('Governor recovery probe satisfies the new non-null task owner contract', () => {
  assert.ok(recovery.includes('id,task_type,status,payload,idempotency_key,owner_subject'));
  assert.ok(recovery.includes("'governor-test'"));
});


test('client-supplied owner is never trusted for task ownership', () => {
  assert.equal(patcher.includes('body.owner_subject'), false);
  assert.ok(patcher.includes('requestSubject]);'));
  const blockStart = patcher.indexOf('new_a2a_insert =');
  const blockEnd = patcher.indexOf('if (source.count(old_a2a_insert)', blockStart);
  const block = patcher.slice(blockStart, blockEnd);
  const a2aCheck = block.indexOf('const taskAccess = await sql(');
  const messageInsert = block.indexOf('INSERT INTO runtime.agent_messages');
  assert.ok(blockStart >= 0 && blockEnd > blockStart);
  assert.ok(a2aCheck >= 0 && messageInsert > a2aCheck);
});
