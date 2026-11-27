-- Crypto AI Holdings isolated pilot: atomic replay/idempotency guard for Google Apps Script OIDC ticks.
-- Source-only until deployment/quota/WBS gates explicitly pass.
-- Target: br-lively-flower-a15zb6ar / crypto_holdco. This file is NOT applied.

BEGIN;

CREATE TABLE IF NOT EXISTS runtime.google_scheduler_replay_guard (
  tick_id uuid PRIMARY KEY,
  token_hash text NOT NULL UNIQUE,
  token_expires_at timestamptz NOT NULL,
  consumed_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT google_scheduler_token_hash_sha256 CHECK (token_hash ~ '^[0-9a-f]{64}$')
);

CREATE INDEX IF NOT EXISTS google_scheduler_replay_expiry_idx
  ON runtime.google_scheduler_replay_guard(token_expires_at);

CREATE OR REPLACE FUNCTION runtime.consume_google_scheduler_tick(
  p_tick_id uuid,
  p_token_hash text,
  p_token_expires_at timestamptz
)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path=pg_catalog,runtime
AS $function$
DECLARE v_count integer;
BEGIN
  IF p_tick_id IS NULL
     OR p_token_hash IS NULL
     OR p_token_hash !~ '^[0-9a-f]{64}$'
     OR p_token_expires_at IS NULL
     OR p_token_expires_at <= statement_timestamp()
     OR p_token_expires_at > statement_timestamp() + interval '62 minutes' THEN
    RETURN false;
  END IF;

  -- Retain a replay marker for at least 24 hours after token expiry.
  DELETE FROM runtime.google_scheduler_replay_guard
  WHERE token_expires_at < statement_timestamp() - interval '24 hours';

  -- Both the UUID tick and the verified bearer hash are unique. Either replay is denied.
  INSERT INTO runtime.google_scheduler_replay_guard (tick_id,token_hash,token_expires_at)
  VALUES (p_tick_id,p_token_hash,p_token_expires_at)
  ON CONFLICT DO NOTHING;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count = 1;
END
$function$;

ALTER FUNCTION runtime.consume_google_scheduler_tick(uuid,text,timestamptz) OWNER TO crypto_holdco_owner;
REVOKE ALL ON runtime.google_scheduler_replay_guard FROM PUBLIC;
REVOKE ALL ON runtime.google_scheduler_replay_guard FROM crypto_holdco_function;
REVOKE ALL ON FUNCTION runtime.consume_google_scheduler_tick(uuid,text,timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION runtime.consume_google_scheduler_tick(uuid,text,timestamptz) TO crypto_holdco_function;

COMMIT;
