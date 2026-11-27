-- Crypto AI Holdings pilot: database-enforced fail-closed Governor gate.
-- Scope: isolated Neon pilot branch only. Apply with a privileged migration role.
-- Reapplying intentionally resets the Governor to PAUSE_DEGRADED.

BEGIN;

CREATE TABLE IF NOT EXISTS runtime.control_plane (
  singleton_id boolean PRIMARY KEY DEFAULT true CHECK (singleton_id IS TRUE),
  governor_state text NOT NULL CHECK (governor_state IN ('RUNNING','PAUSE_DEGRADED','STOPPED')),
  work_allowed boolean NOT NULL,
  reason text NOT NULL,
  changed_by text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT control_plane_state_work_consistency CHECK (
    (governor_state='RUNNING' AND work_allowed IS TRUE)
    OR (governor_state IN ('PAUSE_DEGRADED','STOPPED') AND work_allowed IS FALSE)
  )
);

INSERT INTO runtime.control_plane
  (singleton_id, governor_state, work_allowed, reason, changed_by)
VALUES
  (true, 'PAUSE_DEGRADED', false,
   'P03 pilot fail-closed default; runtime usage meters and canonical private backup gates remain open',
   'migration')
ON CONFLICT (singleton_id) DO UPDATE SET
  governor_state='PAUSE_DEGRADED',
  work_allowed=false,
  reason='P03 pilot fail-closed default; runtime usage meters and canonical private backup gates remain open',
  changed_by='migration',
  updated_at=now();

REVOKE ALL PRIVILEGES ON runtime.control_plane FROM PUBLIC;
REVOKE ALL PRIVILEGES ON runtime.control_plane FROM crypto_holdco_function;
GRANT SELECT ON runtime.control_plane TO crypto_holdco_function;

ALTER TABLE runtime.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime.tasks FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS runtime_tasks_update_governor_gate ON runtime.tasks;
CREATE POLICY runtime_tasks_update_governor_gate
ON runtime.tasks
FOR UPDATE
TO crypto_holdco_function
USING (
  EXISTS (
    SELECT 1
    FROM runtime.control_plane cp
    WHERE cp.singleton_id IS TRUE
      AND cp.governor_state='RUNNING'
      AND cp.work_allowed IS TRUE
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM runtime.control_plane cp
    WHERE cp.singleton_id IS TRUE
      AND cp.governor_state='RUNNING'
      AND cp.work_allowed IS TRUE
  )
);

COMMIT;
