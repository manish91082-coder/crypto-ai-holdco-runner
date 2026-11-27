-- Reproducible scoped token lifecycle test, isolated pilot only.
-- Run as crypto_holdco_owner on br-lively-flower-a15zb6ar / crypto_holdco.
-- All rows are synthetic canaries and are deleted within the transaction.

BEGIN;

INSERT INTO runtime.api_tokens (token_hash,subject,enabled,created_at,scopes,expires_at,revoked_at)
VALUES
 (encode(sha256(convert_to('holdco-api-canary-valid-20261127','UTF8')),'hex'),'synthetic-canary-valid',true,now(),ARRAY['tasks:write']::text[],now()+interval '1 day',NULL),
 (encode(sha256(convert_to('holdco-api-canary-wrong-scope-20261127','UTF8')),'hex'),'synthetic-canary-wrong-scope',true,now(),ARRAY['tasks:read']::text[],now()+interval '1 day',NULL),
 (encode(sha256(convert_to('holdco-api-canary-expired-20261127','UTF8')),'hex'),'synthetic-canary-expired',true,now()-interval '2 days',ARRAY['tasks:write']::text[],now()-interval '1 day',NULL),
 (encode(sha256(convert_to('holdco-api-canary-revoked-20261127','UTF8')),'hex'),'synthetic-canary-revoked',false,now(),ARRAY['tasks:write']::text[],now()+interval '1 day',now());

INSERT INTO runtime.cron_tokens (token_hash,subject,enabled,created_at,scopes,expires_at,revoked_at)
VALUES
 (encode(sha256(convert_to('holdco-cron-canary-valid-20261127','UTF8')),'hex'),'synthetic-cron-valid',true,now(),ARRAY['dispatch:run']::text[],now()+interval '1 day',NULL),
 (encode(sha256(convert_to('holdco-cron-canary-wrong-scope-20261127','UTF8')),'hex'),'synthetic-cron-wrong-scope',true,now(),ARRAY['tasks:write']::text[],now()+interval '1 day',NULL);

SET LOCAL ROLE crypto_holdco_function;

SELECT
 (SELECT count(*) FROM runtime.validate_api_token(
   encode(sha256(convert_to('holdco-api-canary-valid-20261127','UTF8')),'hex'),'tasks:write'))=1 AS api_valid_scope_pass,
 (SELECT count(*) FROM runtime.validate_api_token(
   encode(sha256(convert_to('holdco-api-canary-wrong-scope-20261127','UTF8')),'hex'),'tasks:write'))=0 AS api_wrong_scope_denied,
 (SELECT count(*) FROM runtime.validate_api_token(
   encode(sha256(convert_to('holdco-api-canary-expired-20261127','UTF8')),'hex'),'tasks:write'))=0 AS api_expired_denied,
 (SELECT count(*) FROM runtime.validate_api_token(
   encode(sha256(convert_to('holdco-api-canary-revoked-20261127','UTF8')),'hex'),'tasks:write'))=0 AS api_revoked_denied,
 (SELECT count(*) FROM runtime.validate_cron_token(
   encode(sha256(convert_to('holdco-cron-canary-valid-20261127','UTF8')),'hex'),'dispatch:run'))=1 AS cron_valid_scope_pass,
 (SELECT count(*) FROM runtime.validate_cron_token(
   encode(sha256(convert_to('holdco-cron-canary-wrong-scope-20261127','UTF8')),'hex'),'dispatch:run'))=0 AS cron_wrong_scope_denied,
 has_table_privilege(current_user,'runtime.api_tokens','SELECT')=false AS no_direct_api_token_select,
 has_table_privilege(current_user,'runtime.cron_tokens','SELECT')=false AS no_direct_cron_token_select,
 has_function_privilege(current_user,'runtime.validate_api_token(text,text)','EXECUTE') AS api_validator_execute,
 has_function_privilege(current_user,'runtime.validate_cron_token(text,text)','EXECUTE') AS cron_validator_execute;

RESET ROLE;

DELETE FROM runtime.api_tokens
WHERE subject LIKE 'synthetic-canary-%';

DELETE FROM runtime.cron_tokens
WHERE subject LIKE 'synthetic-cron-%';

COMMIT;
