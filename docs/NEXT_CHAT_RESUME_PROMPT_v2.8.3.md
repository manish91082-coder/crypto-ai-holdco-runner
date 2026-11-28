# Canonical Next Chat Resume Prompt v2.8.3 - Crypto AI Holdings Only
Observed: 28-Nov-2026
Mission key: crypto-ai-holdco-master

Continue ONLY Crypto AI Holdings - Autonomous Crypto Revenue Ecosystem. Do not mix with the ₹1,000/day Supabase A2A project, ZAGRE, Ghost Hunter, PHANTOMX or separate trading systems.

## Locked authority
- Mission Continuity & No-Drift Lock v1.4.
- Master Constitution v2.0.0 LOCKED: ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803.
- WBS v2.0.0 LOCKED: 7e8fa46de0d1348dd3b3da6f266f9afffad9116d1d814a2bf5f653c74f39a2e2.
- 24 phases, 119 tasks. One response = one active WBS phase; no phase skip/reorder/false completion.
- No secrets in chat, source, SQL literals or logs. No paid fallback, local runtime, Cloudflare, owner-funded gas or unauthorized financial execution.

## Canonical identities
- Neon project little-violet-66887398; main branch br-calm-block-a1fbdnnj; pilot br-lively-flower-a15zb6ar; database/schema crypto_holdco/holdco.
- GitHub manish91082-coder/crypto-ai-holdco-runner, branch temporary-zero-cost-runtime-pilot, source/audit only.
- Railway Crypto Holdco Pilot project has one pilot environment, zero services, zero shared variables.

## Exact phase and WBS status
- P03_CLOUD_RUNTIME_AND_RESILIENCE active.
- Active task CRYPTO-HOLDCO-V2-P03-03; DB WBS status remains PLANNED with partial evidence. Do not mark complete.
- P03.01 complete with known Neon Functions-meter limitation; P03.02/P03.04 complete.
- P03.03 ACTIVE/PARTIAL; P03.05 PLANNED/NOT ACTIVE.
- P03 exit NOT PASSED; P04 NOT STARTED.
- Counts 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED.
- Last Neon continuity snapshot remains v34.24 / sequence 64; do not create another until P01/WBS/Mission-State discrepancy is reconciled.

## Function #17
- cryptoaicore Node.js24 Singapore, source SHA d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- DB identity crypto_holdco_function.
- Governor PAUSE_DEGRADED/work_allowed=false.
- Neon scheduled trigger trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, POST /internal/dispatch, disabled, next_run_at=null.
- Seven synthetic tasks, zero ownerless/queued/running.

## CI #143 and Google scheduler candidate v1.3
- CI #143 SUCCESS, 64/64 tests: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46099689692.
- Candidate Function deterministic build SHA aa1224dca47b2b670bd006a2935befcfa7f718bdce89a77b344f107839ff908d. Live Neon smoke skipped; candidate is not deployed.
- Fixed Google JWKS cache max-age parsing and strict printable ASCII subject validation.
- Candidate docs: docs/P03.03_GOOGLE_APPS_SCRIPT_FUNCTION_OIDC_SCHEDULER_v1.3.md.
- WBS readiness review: docs/P03.03_GOOGLE_SCHEDULER_WBS_ACCEPTANCE_REVIEW_v1.0.md.
- Decision: NOT ACCEPTED for deployment. Review is internal; independent reviewer not assigned/signed.

## Apps Script OIDC candidate
- Uses ScriptApp.getIdentityToken() with explicit openid plus script.external_request scopes. No email/profile/Drive scopes.
- Google JWKS signature, issuer, exact OAuth client audience and SHA-256(sub) allowlist; existing crypto_holdco_function used.
- Neon Data API path rejected because role claim controls PostgreSQL role; role creation/membership would breach no-role-mutation rule.
- Replay guard source proposes unique tick UUID + unique bearer hash; duplicate returns 409. Semantics at-most-once admission, not exactly-once processing.
- Replay migration and SQL test source-only, not applied or executed.
- Actual Apps Script project/owner account/audience/subject hash/trigger do not exist or are not observed. No environment allowlist values or feature flag.
- Critical open assumption: successive ScriptApp.getIdentityToken calls must produce a fresh bearer hash for each tick. Prove this using separate actual trigger executions; otherwise a reused token is rejected as replay.

## WBS gates and remaining work
1. Obtain a separate independent review/acceptance of the alternate runtime against locked P03.03 and P03 exit requirements.
2. Owner-controlled Apps Script preflight: exact issuer, audience, SHA-256(sub), iat/exp only. Never expose raw token or subject.
3. Verify token digest uniqueness across successive executions and behavior under token caching.
4. Verify Google account type, project authorization, account-specific remaining quota and execution-region evidence.
5. Neon active time 87.64%, compute 79.77%, transfer 3.10%; period ends 2026-12-01T00:00Z. Function invocation/active/waiting meters UNKNOWN/degraded. No deployment #18, replay SQL, or trigger installation in current quota window.
6. Complete P03.05 in sequence: daily budgets, actual counters, 80% fail-closed stop, freshness, checkpoint/recovery and pause/resume tests before scheduler enablement.
7. Owner API token actual HTTP test, external/manual consumer census and protected one-time delivery remain open. owner-operator-pilot remains active, expires 2026-12-27T09:44:32.105Z. No rotation before cutover.
8. Provider-positive Neon trigger delivery remains untested. Keep both triggers disabled.

## No-go controls
- No Data API, PostgreSQL role/password/membership changes, Cloudflare, paid fallback, owner-funded gas or deployment/trigger arm while gates remain open.
- No buyer submission, wallet signing, transfer, payment or trading.
- Realised net revenue = 0. P03.03 remains PARTIAL; no phase completion claim.
