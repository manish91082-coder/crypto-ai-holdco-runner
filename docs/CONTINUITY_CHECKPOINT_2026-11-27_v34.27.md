# Crypto AI Holdings — Canonical Continuity v34.27
Observed: 27-Nov-2026 18:01 UTC
Mission key: crypto-ai-holdco-master

## Locked authority
- Mission Continuity & No-Drift Lock v1.4.
- Master Constitution v2.0.0 SHA-256: ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803.
- WBS v2.0.0 SHA-256: 7e8fa46de0d1348dd3b3da6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2.
- Both remain LOCKED/unchanged. One response = one active phase. Counts 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED.
- Existing snapshot remains v34.24 / sequence 64. Do not create another until P01/WBS/Mission-State discrepancy reconciliation.

## Canonical resources
- Neon little-violet-66887398; main branch br-calm-block-a1fbdnnj; pilot br-lively-flower-a15zb6ar; DB/schema crypto_holdco/holdco.
- GitHub manish91082-coder/crypto-ai-holdco-runner, branch temporary-zero-cost-runtime-pilot, source/audit only.
- Railway Crypto Holdco Pilot has one pilot environment, zero services, zero shared variables.

## WBS
- P03_CLOUD_RUNTIME_AND_RESILIENCE active; task CRYPTO-HOLDCO-V2-P03-03 active/partial (database row status still PLANNED; do not change to COMPLETE).
- P03.01 COMPLETE with known Free Functions-meter limitation; P03.02/P03.04 COMPLETE.
- P03.05 PLANNED / NOT ACTIVE. P03 exit NOT PASSED; P04 NOT STARTED.

## Runtime deployment #17
- Function cryptoaicore, Node.js24, Singapore, deployment #17 completed.
- Patched source SHA-256 d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- DB identity crypto_holdco_function; Governor PAUSE_DEGRADED / work_allowed=false.
- Trigger trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, POST /internal/dispatch, disabled, next_run_at=null.
- Seven tasks synthetic/owner-bound; zero queued/running/ownerless.

## CI #121 — synthetic app-token validator proof
- Run 46046289848 attempt 1 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46046289848; 44/44 tests; 17 signed OIDC claims passed.
- OIDC remains metrics:read only. GET /v1/metrics HTTP 200; agents/demo/tasks-write/own-task-read/A2A escalation HTTP 401.
- Separate temporary app bearer subject ci-auth-canary:46046289848:1, one scope metrics:read, expiry 180 sec. It called GET /v1/metrics via standard runtime.validate_api_token: HTTP 200; GET /v1/agents wrong-scope test: HTTP 401.
- Workflow finally revoked the token. Provider metadata: enabled=false, revoked_at and last_used_at populated. Created 2026-11-27T18:01:36.725Z; expiry 2026-11-27T18:04:36.725Z; last_used 2026-11-27T18:01:36.910Z; revoked 2026-11-27T18:01:37.281Z. Raw bearer/hash never read.
- One historical canary row, zero active canary rows. This proves the normal validator using a synthetic CI token, NOT owner-operator-pilot.

## DB least privilege
- Pilot-only SECURITY DEFINER functions runtime.issue_ci_auth_canary(text,bigint,integer), runtime.revoke_ci_auth_canary(bigint,integer); partial unique index api_tokens_ci_auth_canary_subject_uq.
- Fixed search_path pg_catalog,runtime; owner crypto_holdco_owner; PUBLIC execute revoked; Function role receives EXECUTE only.
- Function role direct SELECT/INSERT/UPDATE/DELETE on runtime.api_tokens all false.
- Migration db/migrations/pilot/20261127_ci_auth_canary.sql; test db/tests/pilot/verify_ci_auth_canary.sql.

## Owner API token and rotation
- owner-operator-pilot remains enabled with agents:read, demo:run, tasks:write, metrics:read, a2a:write, tasks:read:own.
- Expires 2026-12-27T09:44:32.105Z; last_used_at 2026-11-27T14:55:00.737Z; revoked_at null.
- Raw token/hash not read. No owner token creation/rotation/reissue/revocation occurred.
- Consumer set not fully mapped; protected one-time delivery not available. Rotation NO-GO until these are verified.
- Runbook v1.1: docs/P03.03_OPERATOR_CREDENTIAL_ROTATION_AND_CONSUMER_INVENTORY_v1.1.md.

## Controls and quota status
- Trigger disabled; Governor PAUSE_DEGRADED/work_allowed=false.
- Neon Free Functions MTD invocation and active/waiting Capacity-Hours UNKNOWN, not zero. Observed 111 invocations remains degraded log lower-bound. Billed storage UNKNOWN.
- P03.05 daily budgets, actual custom counters, proposed 80% stops, freshness gates and durable recovery NOT IMPLEMENTED.
- No paid fallback/upgrade, Cloudflare, local runtime, owner-funded gas, trading/signing/transfer/payment/external submission.
- Realised net revenue 0.

## Remaining P03.03 gates
1. Positive HTTP through actual owner-operator-pilot bearer without raw token exposure.
2. Full external/manual consumer census and protected one-time delivery.
3. Only then replace, overlap, test, cut over, revoke old token before expiry.
4. Provider-positive scheduled trigger delivery and remaining terms/runtime assurance.
5. Reconcile P01/WBS/Mission-State discrepancy before any new continuity snapshot.

P03 remains ACTIVE/PARTIAL; P03.05 NOT ACTIVE; no phase completion or revenue claim.
