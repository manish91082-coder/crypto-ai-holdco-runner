-- Crypto AI Holdings pilot: verify Governor PAUSE/RUNNING recovery against the real dispatcher claim.
-- Run ONLY on the disposable pilot branch br-lively-flower-a15zb6ar / crypto_holdco.
-- Execute as crypto_holdco_owner. The test row is synthetic and is deleted before COMMIT.
-- Never run on canonical main. The test always restores PAUSE_DEGRADED.

BEGIN;

-- Record the current Governor state; the pilot default must be paused.
SELECT governor_state, work_allowed
FROM runtime.control_plane
WHERE singleton_id IS TRUE;

-- Owner has BYPASSRLS on this isolated pilot and creates a uniquely named probe.
INSERT INTO runtime.tasks (id,task_type,status,payload,idempotency_key)
VALUES (
  'a1000000-0000-4000-8000-000000000004',
  'governor_recovery_probe',
  'queued',
  '{"synthetic_test":true,"purpose":"prove RUNNING path and recovery under governor"}'::jsonb,
  'governor-recovery-probe-20261127'
);

-- PAUSE_DEGRADED must hide all queued work from the Function role.
SET ROLE crypto_holdco_function;
SELECT count(*)::int AS visible_queued_in_pause
FROM runtime.tasks
WHERE status='queued';
RESET ROLE;
-- Expected: visible_queued_in_pause = 0.

-- Owner opens RUNNING for this one synthetic probe only.
UPDATE runtime.control_plane
SET governor_state='RUNNING',
    work_allowed=true,
    reason='Controlled synthetic recovery test only; no live buyer, wallet, payment or market actions',
    changed_by='governor-test',
    updated_at=now()
WHERE singleton_id IS TRUE;

-- Execute the exact same SKIP LOCKED + UPDATE claim path used by dispatch().
SET ROLE crypto_holdco_function;
WITH candidate AS (
  SELECT id
  FROM runtime.tasks
  WHERE status='queued'
  ORDER BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
UPDATE runtime.tasks AS t
SET status='running',
    attempt_count=t.attempt_count+1,
    started_at=now(),
    updated_at=now()
FROM candidate
WHERE t.id=candidate.id
RETURNING t.id::text AS id,t.status,t.attempt_count;
RESET ROLE;
-- Expected: exactly the synthetic probe, status=running, attempt_count=1.

-- Restore the hard stop before cleaning up.
UPDATE runtime.control_plane
SET governor_state='PAUSE_DEGRADED',
    work_allowed=false,
    reason='Synthetic RUNNING claim recovered successfully; Governor re-paused after test',
    changed_by='governor-test',
    updated_at=now()
WHERE singleton_id IS TRUE;

DELETE FROM runtime.tasks
WHERE id='a1000000-0000-4000-8000-000000000004'
  AND task_type='governor_recovery_probe';

-- Final state must be PAUSE_DEGRADED with no test row.
SELECT governor_state,work_allowed
FROM runtime.control_plane
WHERE singleton_id IS TRUE;
SELECT count(*)::int AS remaining_probe_rows
FROM runtime.tasks
WHERE task_type='governor_recovery_probe';

COMMIT;
