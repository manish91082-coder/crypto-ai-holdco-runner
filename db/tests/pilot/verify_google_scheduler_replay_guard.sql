-- Google Apps Script scheduler replay guard regression; run only on isolated pilot.
-- Test runs in a transaction and rolls back all synthetic table/function effects.

BEGIN;

DO $test$
DECLARE
  v_hash_a text := encode(sha256(convert_to('holdco-google-scheduler-token-a','UTF8')),'hex');
  v_hash_b text := encode(sha256(convert_to('holdco-google-scheduler-token-b','UTF8')),'hex');
  v_expiry timestamptz := statement_timestamp()+interval '30 minutes';
  v_tick_a uuid := '8c7f5b28-80ed-4b01-8c11-2dc8e623e7c1';
  v_tick_b uuid := '8c7f5b28-80ed-4b01-8c11-2dc8e623e7c2';
BEGIN
  IF NOT runtime.consume_google_scheduler_tick(v_tick_a,v_hash_a,v_expiry) THEN
    RAISE EXCEPTION 'FIRST_SCHEDULER_TICK_NOT_ACCEPTED';
  END IF;
  IF runtime.consume_google_scheduler_tick(v_tick_a,v_hash_a,v_expiry) THEN
    RAISE EXCEPTION 'SAME_TICK_AND_TOKEN_REPLAY_ACCEPTED';
  END IF;
  IF runtime.consume_google_scheduler_tick(v_tick_b,v_hash_a,v_expiry) THEN
    RAISE EXCEPTION 'SAME_BEARER_NEW_TICK_REPLAY_ACCEPTED';
  END IF;
  IF runtime.consume_google_scheduler_tick(v_tick_a,v_hash_b,v_expiry) THEN
    RAISE EXCEPTION 'SAME_TICK_NEW_BEARER_REPLAY_ACCEPTED';
  END IF;
  IF runtime.consume_google_scheduler_tick(v_tick_b,v_hash_b,statement_timestamp()-interval '1 second') THEN
    RAISE EXCEPTION 'EXPIRED_BEARER_ACCEPTED';
  END IF;
  IF has_table_privilege('crypto_holdco_function','runtime.google_scheduler_replay_guard','SELECT')
     OR has_table_privilege('crypto_holdco_function','runtime.google_scheduler_replay_guard','INSERT')
     OR has_table_privilege('crypto_holdco_function','runtime.google_scheduler_replay_guard','UPDATE')
     OR has_table_privilege('crypto_holdco_function','runtime.google_scheduler_replay_guard','DELETE') THEN
    RAISE EXCEPTION 'FUNCTION_ROLE_HAS_DIRECT_REPLAY_TABLE_PRIVILEGE';
  END IF;
  IF NOT has_function_privilege('crypto_holdco_function','runtime.consume_google_scheduler_tick(uuid,text,timestamptz)','EXECUTE') THEN
    RAISE EXCEPTION 'FUNCTION_ROLE_REPLAY_EXECUTE_GRANT_MISSING';
  END IF;
END
$test$;

ROLLBACK;
