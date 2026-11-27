-- Crypto AI Holdings pilot: bind tasks and messages to authenticated token subject.
-- Apply ONLY to isolated pilot branch br-lively-flower-a15zb6ar / crypto_holdco.
-- Existing records are backfilled only after proving every row is a synthetic test fixture.

BEGIN;

ALTER TABLE runtime.tasks
  ADD COLUMN IF NOT EXISTS owner_subject text;

-- The current isolated pilot contains only demo_e2e synthetic records and
-- qualify_opportunity records sourced from SYNTHETIC_TEST_FIXTURE or
-- SYNTHETIC_NEGATIVE_CONTROL. Refuse to infer ownership for any other row.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM runtime.tasks
    WHERE owner_subject IS NULL
      AND NOT (
        (task_type='demo_e2e' AND payload->>'synthetic_test'='true')
        OR
        (task_type='qualify_opportunity'
          AND payload->'candidate'->>'source' IN
            ('SYNTHETIC_TEST_FIXTURE','SYNTHETIC_NEGATIVE_CONTROL'))
      )
  ) THEN
    RAISE EXCEPTION 'non-synthetic task exists without an owner; manual ownership reconciliation required';
  END IF;
END
$$;

UPDATE runtime.tasks
SET owner_subject='owner-operator-pilot'
WHERE owner_subject IS NULL
  AND (
    (task_type='demo_e2e' AND payload->>'synthetic_test'='true')
    OR
    (task_type='qualify_opportunity'
      AND payload->'candidate'->>'source' IN
        ('SYNTHETIC_TEST_FIXTURE','SYNTHETIC_NEGATIVE_CONTROL'))
  );

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM runtime.tasks WHERE owner_subject IS NULL) THEN
    RAISE EXCEPTION 'task owner backfill incomplete; refusing NOT NULL constraint';
  END IF;
END
$$;

ALTER TABLE runtime.tasks
  ALTER COLUMN owner_subject SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='runtime_tasks_owner_subject_nonempty'
      AND conrelid='runtime.tasks'::regclass
  ) THEN
    ALTER TABLE runtime.tasks
      ADD CONSTRAINT runtime_tasks_owner_subject_nonempty
      CHECK (length(btrim(owner_subject)) BETWEEN 1 AND 128);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS runtime_tasks_owner_created_idx
  ON runtime.tasks (owner_subject,created_at DESC);

-- Replace the single-operator any-task-read grant with owner-only task reads.
UPDATE runtime.api_tokens
SET scopes=array_remove(scopes,'tasks:read:any')||ARRAY['tasks:read:own']::text[]
WHERE subject='owner-operator-pilot'
  AND enabled IS TRUE
  AND revoked_at IS NULL
  AND 'tasks:read:any'=ANY(scopes);

COMMIT;
