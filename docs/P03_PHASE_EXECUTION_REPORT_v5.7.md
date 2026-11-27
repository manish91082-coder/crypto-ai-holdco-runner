# Crypto AI Holdings — P03 Phase Execution Report v5.7
Observed: 27-Nov-2026 18:01 UTC
Mission: crypto-ai-holdco-master
Phase: P03_CLOUD_RUNTIME_AND_RESILIENCE
Active task: CRYPTO-HOLDCO-V2-P03-03

## Decision
P03.03 remains ACTIVE / PARTIAL. A synthetic, short-lived application bearer completed positive and negative live HTTP tests through the standard SHA-256-backed runtime.validate_api_token path and was revoked with provider metadata read-back. This proves the normal app-token validator path for a synthetic CI canary. It does not prove the separate owner-operator-pilot token, complete its consumer census, establish protected delivery or complete rotation. Provider-origin scheduled-trigger delivery also remains untested.

## Deployment #17
- Neon Function cryptoaicore, isolated branch br-lively-flower-a15zb6ar, DB crypto_holdco.
- Deployment #17 completed, Node.js24, Singapore aws-ap-southeast-1.
- Patched source SHA-256: d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- DB identity crypto_holdco_function; readiness confirms Governor PAUSE_DEGRADED / work_allowed=false.
- Trigger trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, path POST /internal/dispatch, disabled, next_run_at=null.

## CI #121 live proof
- Run ID 46046289848, attempt 1, SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46046289848
- 44/44 tests, 0 failures. Deterministic bundle build passed.
- 17/17 signed GitHub OIDC claims passed, including run_id and run_attempt.
- OIDC workload identity remains metrics:read only: GET /v1/metrics HTTP 200; scope escalations to agents, demo, tasks write, own-task read and A2A HTTP 401.
- Separate ephemeral app bearer was minted with crypto-secure random bytes, hash-backed at rest, exact subject ci-auth-canary:46046289848:1, scope metrics:read, expiry 180 seconds.
- That bearer called GET /v1/metrics through normal app authentication/runtime.validate_api_token: HTTP 200. Wrong-scope GET /v1/agents: HTTP 401.
- Workflow finally block revoked it. Provider read-back: enabled=false, revoked_at and last_used_at populated; created 2026-11-27T18:01:36.725Z; expiry 2026-11-27T18:04:36.725Z; last used 2026-11-27T18:01:36.910Z; revoked 2026-11-27T18:01:37.281Z. Raw token/hash never selected or logged.
- Canary inventory: 1 historical row, 1 revoked, 0 active.

## Canary database security
- Pilot-only functions runtime.issue_ci_auth_canary(text,bigint,integer), runtime.revoke_ci_auth_canary(bigint,integer); partial unique subject index api_tokens_ci_auth_canary_subject_uq.
- Both SECURITY DEFINER, owner crypto_holdco_owner, search_path pg_catalog,runtime, PUBLIC execute revoked, Function-role EXECUTE only.
- Function role direct SELECT/INSERT/UPDATE/DELETE on runtime.api_tokens remain false.
- Issue function accepts a 64-character lowercase hash, signed run_id/attempt, metrics:read only and 180-second expiry; revoke matches only the exact run/attempt subject and metrics-only scope.
- Source SQL: db/migrations/pilot/20261127_ci_auth_canary.sql; regression SQL: db/tests/pilot/verify_ci_auth_canary.sql.

## Owner credential remains untouched
- owner-operator-pilot remains enabled with scopes agents:read, demo:run, tasks:write, metrics:read, a2a:write, tasks:read:own.
- Expires 2026-12-27T09:44:32.105Z; last_used_at 2026-11-27T14:55:00.737Z; revoked_at null.
- Raw token/hash not read; no owner credential created, rotated, reissued or revoked.
- External/manual consumers not fully mapped; protected one-time delivery not established. Rotation remains NO-GO.
- Synthetic CI canary is not an owner-token proof.

## Operational safety and economics
- Governor remains PAUSE_DEGRADED / work_allowed=false; trigger disabled.
- Seven pilot tasks remain synthetic and owner-bound; 0 queued, 0 running, 0 ownerless.
- Exact Neon Free Functions MTD invocation/active/waiting Capacity-Hours UNKNOWN; observed 111 invocation count is a degraded log lower-bound, not billing meter. Billed storage UNKNOWN.
- No real buyer, accepted delivery, payment, wallet signing, transfer, live trading, external submission or revenue event. Realised net revenue 0.

## Remaining P03.03 gates
1. Positive HTTP canary using the real owner-operator-pilot token without exposing it.
2. Full manual/external consumer census and protected one-time delivery.
3. Only after those gates, replacement issue, overlap, consumer validation/cutover and old-token revocation before expiry.
4. Provider-positive scheduled-trigger delivery and remaining deployment/terms assurance. Scheduler stays disabled.

## WBS
P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION. P03.02/P03.04 COMPLETE. P03.03 ACTIVE/PARTIAL. P03.05 PLANNED/NOT ACTIVE. P03 exit NOT PASSED; P04 NOT STARTED. Counts remain 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED. Master Constitution/WBS remain unchanged.
