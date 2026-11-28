# Crypto AI Holdings - Canonical Continuity v34.32
Observed: 28-Nov-2026
Mission key: crypto-ai-holdco-master

## Locked authority
- Mission Continuity & No-Drift Lock v1.4.
- Master Constitution v2.0.0 SHA-256 ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803.
- WBS v2.0.0 SHA-256 7e8fa46de0d1348dd3b3da6f266f9afffad9116d1d814a2bf5f653c74f39a2e2.
- Both remain LOCKED and unchanged. One response = one active WBS phase.
- Counts: 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED.
- Existing last Neon continuity snapshot remains v34.24 / sequence 64. Do not create another sequence snapshot until P01/WBS/Mission-State projection discrepancy is reconciled.

## Canonical resources
- Neon project little-violet-66887398; main branch br-calm-block-a1fbdnnj; pilot branch br-lively-flower-a15zb6ar; database/schema crypto_holdco/holdco.
- GitHub repo manish91082-coder/crypto-ai-holdco-runner, branch temporary-zero-cost-runtime-pilot; source/audit only.
- Railway Crypto Holdco Pilot: one pilot environment, zero services, zero shared variables.

## Exact WBS state
- Active phase P03_CLOUD_RUNTIME_AND_RESILIENCE.
- Active task CRYPTO-HOLDCO-V2-P03-03; Neon WBS status field remains PLANNED with nested partial progress. Do not mark COMPLETE.
- P03.01 COMPLETE with known Neon Functions meter limitation; P03.02/P03.04 COMPLETE.
- P03.03 ACTIVE / PARTIAL.
- P03.05 PLANNED / NOT ACTIVE.
- P03 exit NOT PASSED; P04 NOT STARTED.

## Function
- Active Function cryptoaicore deployment #17, Node.js24, Singapore; source SHA-256 d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- DB identity crypto_holdco_function.
- Governor PAUSE_DEGRADED / work_allowed=false.
- Neon scheduler trigger trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, route POST /internal/dispatch, disabled, next_run_at=null.
- Seven pilot tasks synthetic/owner-bound; zero ownerless, queued or running.

## Application-token proof and credential boundaries
- CI #121 SUCCESS; 44/44 tests, synthetic app-token standard validator HTTP 200, wrong-scope 401, finally revocation confirmed.
- Actual owner-operator-pilot token remains enabled, scopes agents:read, demo:run, tasks:write, metrics:read, a2a:write, tasks:read:own; expires 2026-12-27T09:44:32.105Z; last_used_at 2026-11-27T14:55:00.737Z; raw token/hash never read.
- Owner token positive HTTP test, full external/manual consumer census and protected one-time delivery remain open. Do not rotate before all gates.
- Legacy cron token remains revoked/disabled. No owner token created, rotated, reissued or revoked.

## Google Apps Script alternative scheduler candidate v1.3
- Candidate docs/P03.03_GOOGLE_APPS_SCRIPT_FUNCTION_OIDC_SCHEDULER_v1.3.md.
- Internal WBS readiness review docs/P03.03_GOOGLE_SCHEDULER_WBS_ACCEPTANCE_REVIEW_v1.0.md.
- Decision NOT ACCEPTED FOR DEPLOYMENT; no independent reviewer approval. Source-only, no Function #18 or Apps Script trigger.
- CI #143 SUCCESS: 64/64 tests, run https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46099689692. Candidate deterministic build SHA aa1224dca47b2b670bd006a2935befcfa7f718bdce89a77b344f107839ff908d. Live smoke skipped.
- JWKS Cache-Control max-age parsing and printable-sub validation corrected; tests added for cache expiry and minimal Apps Script scopes.
- Replay SQL remains source-only. CI #138's 62/62 static contract tests do not equal SQL execution. Table/function absent in both branches.
- No actual Apps Script project, Google owner identity, OAuth audience, SHA-256 owner-sub allowlist, account type or account-specific quota observed. No environment variables or scheduler feature flag set.
- Key unresolved design assumption: the replay table uniquely rejects bearer hashes. Consecutive actual Google trigger executions must demonstrate a fresh ID-token digest; otherwise a reused still-valid token is rejected with HTTP 409. Do not assume freshness.
- Official Google docs: getIdentityToken requires explicit openid; token audience is the script OAuth client ID; installable triggers run as the creator and time-driven timing may be randomized; quotas are per user and vary by consumer/Workspace account.

## Resource and quota state
- Neon active time 113,587/129,600 sec = 87.64%, remaining 16,013 sec.
- Compute 28,717/36,000 sec = 79.77%, remaining 7,283 sec.
- Transfer 31,038,118/1,000,000,000 bytes = 3.10%.
- Period ends 2026-12-01T00:00:00Z.
- Functions MTD invocations/active/waiting Capacity-Hours UNKNOWN/degraded; observed 111 is a log lower bound, not invoice-grade meter.
- Keep Governor paused. Do not deploy #18, apply replay SQL or arm any scheduler during this window.

## WBS acceptance review v1.0
- Candidate was mapped to locked P03.03: terms, region, quotas, secrets, scheduling and deployment must be tested before the runtime evaluation gate is passed.
- P03 exit also requires verified topology/quota limits and passing pause/recovery tests with no paid fallback.
- Current readiness review is internal only. Independent acceptance NOT GRANTED.
- Open gates: independent review, owner account/identity preflight, execution-region evidence, account-specific quota, per-invocation token freshness, SQL migration executed/tested, candidate deployment, P03.05 budgets/freshness/checkpoint/recovery and actual owner-token gates.

## Next exact sequence
1. Get independent WBS acceptance for the alternate runtime architecture. Do not self-certify.
2. Obtain the actual owner's Apps Script ID token preflight inside an owner-controlled project. Record issuer/aud/SHA256(sub)/iat/exp only; no raw ID token or subject.
3. Test successive trigger executions and confirm a unique bearer digest each tick. Resolve if Google reuses a still-valid ID token.
4. Verify account type, project authorization and remaining Google quota.
5. After 2026-12-01T00:00Z, refresh Neon free-plan usage and meter evidence; unknown is not zero.
6. Complete P03.05 in its correct sequence before any scheduler enablement.
7. Complete actual owner API token HTTP proof, consumer census and protected delivery; keep owner token unchanged before cutover.
8. Only after the gates: apply replay SQL on isolated pilot, execute SQL regression, deploy, positive/negative HTTP tests, then consider a separate trigger-installation approval.

No Data API, role/password/membership mutation, Cloudflare, paid fallback, owner-funded gas, live trading, signing, transfer, payment or external submission. Realised net revenue remains 0.
