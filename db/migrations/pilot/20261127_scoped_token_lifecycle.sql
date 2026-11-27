-- Crypto AI Holdings pilot: scoped, expiring, revocable API/cron credentials.
-- Apply ONLY to isolated pilot branch br-lively-flower-a15zb6ar / crypto_holdco.
-- No raw bearer token is stored or emitted. Tables persist SHA-256 token hashes only.

BEGIN;

ALTER TABLE runtime.api_tokens
  ADD COLUMN IF NOT EXISTS scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS rotation_group uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS last_used_at timestamptz;

ALTER TABLE runtime.cron_tokens
  ADD COLUMN IF NOT EXISTS scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS rotation_group uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS last_used_at timestamptz;

-- Existing pilot credentials receive explicit narrow scopes and a 30-day expiry.
-- This does not reveal, rotate or change the underlying bearer/cron secret.
UPDATE runtime.api_tokens
SET scopes=ARRAY[
      'agents:read',
      'demo:run',
      'tasks:write',
      'tasks:read:any',
      'metrics:read',
      'a2a:write'
    ]::text[],
    expires_at=COALESCE(expires_at, created_at + interval '30 days')
WHERE subject='owner-operator-pilot'
  AND enabled IS TRUE
  AND revoked_at IS NULL
  AND cardinality(scopes)=0;

UPDATE runtime.cron_tokens
SET scopes=ARRAY['dispatch:run']::text[],
    expires_at=COALESCE(expires_at, created_at + interval '30 days')
WHERE subject='neon-scheduled-dispatcher'
  AND enabled IS TRUE
  AND revoked_at IS NULL
  AND cardinality(scopes)=0;

ALTER TABLE runtime.api_tokens
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 days');
ALTER TABLE runtime.api_tokens
  ALTER COLUMN expires_at SET NOT NULL;
ALTER TABLE runtime.cron_tokens
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 days');
ALTER TABLE runtime.cron_tokens
  ALTER COLUMN expires_at SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='api_tokens_scopes_nonempty'
      AND conrelid='runtime.api_tokens'::regclass
  ) THEN
    ALTER TABLE runtime.api_tokens
      ADD CONSTRAINT api_tokens_scopes_nonempty CHECK (cardinality(scopes)>0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='api_tokens_expiry_after_creation'
      AND conrelid='runtime.api_tokens'::regclass
  ) THEN
    ALTER TABLE runtime.api_tokens
      ADD CONSTRAINT api_tokens_expiry_after_creation CHECK (expires_at>created_at);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='cron_tokens_scopes_nonempty'
      AND conrelid='runtime.cron_tokens'::regclass
  ) THEN
    ALTER TABLE runtime.cron_tokens
      ADD CONSTRAINT cron_tokens_scopes_nonempty CHECK (cardinality(scopes)>0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='cron_tokens_expiry_after_creation'
      AND conrelid='runtime.cron_tokens'::regclass
  ) THEN
    ALTER TABLE runtime.cron_tokens
      ADD CONSTRAINT cron_tokens_expiry_after_creation CHECK (expires_at>created_at);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS api_tokens_expiry_idx
  ON runtime.api_tokens (expires_at) WHERE enabled IS TRUE AND revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS cron_tokens_expiry_idx
  ON runtime.cron_tokens (expires_at) WHERE enabled IS TRUE AND revoked_at IS NULL;

CREATE OR REPLACE FUNCTION runtime.validate_api_token(p_token_hash text,p_required_scope text)
RETURNS TABLE(subject text)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path=pg_catalog,runtime
AS $function$
BEGIN
  RETURN QUERY
  UPDATE runtime.api_tokens AS t
  SET last_used_at=statement_timestamp()
  WHERE t.token_hash=p_token_hash
    AND t.enabled IS TRUE
    AND t.revoked_at IS NULL
    AND t.expires_at>statement_timestamp()
    AND p_required_scope=ANY(t.scopes)
  RETURNING t.subject;
END
$function$;

CREATE OR REPLACE FUNCTION runtime.validate_cron_token(p_token_hash text,p_required_scope text)
RETURNS TABLE(subject text)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path=pg_catalog,runtime
AS $function$
BEGIN
  RETURN QUERY
  UPDATE runtime.cron_tokens AS t
  SET last_used_at=statement_timestamp()
  WHERE t.token_hash=p_token_hash
    AND t.enabled IS TRUE
    AND t.revoked_at IS NULL
    AND t.expires_at>statement_timestamp()
    AND p_required_scope=ANY(t.scopes)
  RETURNING t.subject;
END
$function$;

ALTER FUNCTION runtime.validate_api_token(text,text) OWNER TO crypto_holdco_owner;
ALTER FUNCTION runtime.validate_cron_token(text,text) OWNER TO crypto_holdco_owner;

REVOKE ALL PRIVILEGES ON runtime.api_tokens FROM PUBLIC;
REVOKE ALL PRIVILEGES ON runtime.cron_tokens FROM PUBLIC;
REVOKE ALL PRIVILEGES ON runtime.api_tokens FROM crypto_holdco_function;
REVOKE ALL PRIVILEGES ON runtime.cron_tokens FROM crypto_holdco_function;

REVOKE ALL ON FUNCTION runtime.validate_api_token(text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION runtime.validate_cron_token(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION runtime.validate_api_token(text,text) TO crypto_holdco_function;
GRANT EXECUTE ON FUNCTION runtime.validate_cron_token(text,text) TO crypto_holdco_function;

COMMIT;
