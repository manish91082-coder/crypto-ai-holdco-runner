-- Crypto AI Holdings isolated pilot: short-lived CI-only application-token validator canary.
-- Target: little-violet-66887398 / br-lively-flower-a15zb6ar / crypto_holdco.
-- This does not alter or revoke owner-operator-pilot. No plaintext token is stored.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS api_tokens_ci_auth_canary_subject_uq
  ON runtime.api_tokens(subject)
  WHERE subject LIKE 'ci-auth-canary:%';

CREATE OR REPLACE FUNCTION runtime.issue_ci_auth_canary(
  p_token_hash text,
  p_run_id bigint,
  p_run_attempt integer
)
RETURNS TABLE(subject text, expires_at timestamptz)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path=pg_catalog,runtime
AS $function$
DECLARE
  v_subject text;
  v_expires_at timestamptz;
BEGIN
  IF p_token_hash IS NULL OR p_token_hash !~ '^[0-9a-f]{64}$'
     OR p_run_id IS NULL OR p_run_id < 1
     OR p_run_attempt IS NULL OR p_run_attempt < 1 THEN
    RAISE EXCEPTION 'INVALID_CI_CANARY_ARGUMENT' USING ERRCODE='22023';
  END IF;

  v_subject := 'ci-auth-canary:' || p_run_id::text || ':' || p_run_attempt::text;
  IF EXISTS (SELECT 1 FROM runtime.api_tokens AS t WHERE t.subject=v_subject) THEN
    RAISE EXCEPTION 'CI_CANARY_ALREADY_ISSUED' USING ERRCODE='23505';
  END IF;

  v_expires_at := statement_timestamp() + interval '180 seconds';
  INSERT INTO runtime.api_tokens (token_hash,subject,enabled,scopes,expires_at)
  VALUES (p_token_hash,v_subject,true,ARRAY['metrics:read']::text[],v_expires_at);

  RETURN QUERY SELECT v_subject,v_expires_at;
END
$function$;

CREATE OR REPLACE FUNCTION runtime.revoke_ci_auth_canary(
  p_run_id bigint,
  p_run_attempt integer
)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path=pg_catalog,runtime
AS $function$
DECLARE
  v_subject text;
  v_count integer;
BEGIN
  IF p_run_id IS NULL OR p_run_id < 1 OR p_run_attempt IS NULL OR p_run_attempt < 1 THEN
    RAISE EXCEPTION 'INVALID_CI_CANARY_ARGUMENT' USING ERRCODE='22023';
  END IF;

  v_subject := 'ci-auth-canary:' || p_run_id::text || ':' || p_run_attempt::text;
  UPDATE runtime.api_tokens AS t
  SET enabled=false,
      revoked_at=COALESCE(t.revoked_at,statement_timestamp())
  WHERE t.subject=v_subject
    AND t.scopes=ARRAY['metrics:read']::text[]
    AND (t.enabled IS TRUE OR t.revoked_at IS NULL);

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END
$function$;

ALTER FUNCTION runtime.issue_ci_auth_canary(text,bigint,integer) OWNER TO crypto_holdco_owner;
ALTER FUNCTION runtime.revoke_ci_auth_canary(bigint,integer) OWNER TO crypto_holdco_owner;

REVOKE ALL ON FUNCTION runtime.issue_ci_auth_canary(text,bigint,integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION runtime.revoke_ci_auth_canary(bigint,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION runtime.issue_ci_auth_canary(text,bigint,integer) TO crypto_holdco_function;
GRANT EXECUTE ON FUNCTION runtime.revoke_ci_auth_canary(bigint,integer) TO crypto_holdco_function;

COMMIT;
