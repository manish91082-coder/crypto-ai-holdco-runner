-- CI canary token lifecycle regression. Run on isolated pilot as crypto_holdco_owner.
-- Synthetic fixed test token only; transaction is rolled back at the end.

BEGIN;

DO $test$
DECLARE
  v_hash text := encode(sha256(convert_to('crypto-holdco-ci-canary-regression-only','UTF8')),'hex');
  v_subject text;
  v_expiry timestamptz;
BEGIN
  SELECT subject,expires_at INTO v_subject,v_expiry
  FROM runtime.issue_ci_auth_canary(v_hash,987654321,77);

  IF v_subject <> 'ci-auth-canary:987654321:77' THEN
    RAISE EXCEPTION 'CANARY_SUBJECT_BINDING_FAILED';
  END IF;
  IF v_expiry <= statement_timestamp() OR v_expiry > statement_timestamp()+interval '3 minutes' THEN
    RAISE EXCEPTION 'CANARY_EXPIRY_WINDOW_FAILED';
  END IF;
  IF has_table_privilege('crypto_holdco_function','runtime.api_tokens','SELECT')
     OR has_table_privilege('crypto_holdco_function','runtime.api_tokens','INSERT')
     OR has_table_privilege('crypto_holdco_function','runtime.api_tokens','UPDATE')
     OR has_table_privilege('crypto_holdco_function','runtime.api_tokens','DELETE') THEN
    RAISE EXCEPTION 'FUNCTION_ROLE_HAS_DIRECT_TOKEN_TABLE_ACCESS';
  END IF;
  IF NOT has_function_privilege('crypto_holdco_function','runtime.issue_ci_auth_canary(text,bigint,integer)','EXECUTE')
     OR NOT has_function_privilege('crypto_holdco_function','runtime.revoke_ci_auth_canary(bigint,integer)','EXECUTE') THEN
    RAISE EXCEPTION 'FUNCTION_ROLE_CANARY_ROUTINE_GRANT_MISSING';
  END IF;
END
$test$;

SET LOCAL ROLE crypto_holdco_function;

SELECT
  (SELECT count(*) FROM runtime.validate_api_token(
    encode(sha256(convert_to('crypto-holdco-ci-canary-regression-only','UTF8')),'hex'),'metrics:read'))=1
    AS canary_metrics_scope_pass,
  (SELECT count(*) FROM runtime.validate_api_token(
    encode(sha256(convert_to('crypto-holdco-ci-canary-regression-only','UTF8')),'hex'),'tasks:write'))=0
    AS canary_wrong_scope_denied;

RESET ROLE;

DO $test$
DECLARE v_count integer;
BEGIN
  v_count := runtime.revoke_ci_auth_canary(987654321,77);
  IF v_count <> 1 THEN RAISE EXCEPTION 'CANARY_REVOKE_FAILED'; END IF;
END
$test$;

SET LOCAL ROLE crypto_holdco_function;
SELECT
  (SELECT count(*) FROM runtime.validate_api_token(
    encode(sha256(convert_to('crypto-holdco-ci-canary-regression-only','UTF8')),'hex'),'metrics:read'))=0
    AS revoked_canary_denied;
RESET ROLE;

ROLLBACK;
