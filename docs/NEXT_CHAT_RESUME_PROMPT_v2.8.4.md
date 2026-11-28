# Canonical Next Chat Resume Prompt v2.8.4 - Crypto AI Holdings Only
Observed: 28-Nov-2026
Mission: crypto-ai-holdco-master

Continue ONLY Crypto AI Holdings. Do not mix with ₹1,000/day Supabase A2A, ZAGRE, Ghost Hunter, PHANTOMX or separate trading bots.

## Locked authority and current WBS
- Master Constitution v2.0.0 LOCKED: ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803.
- WBS v2.0.0 LOCKED: 7e8fa46de0d1348dd3b3da6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2.
- 24 phases/119 tasks; one active phase per response; no skip/reorder/false completion.
- Active phase P03_CLOUD_RUNTIME_AND_RESILIENCE; task CRYPTO-HOLDCO-V2-P03-03 ACTIVE/PARTIAL (DB status field remains PLANNED).
- P03.01 COMPLETE with known Neon Functions meter limitation; P03.02/P03.04 COMPLETE.
- P03.05 PLANNED/NOT ACTIVE; P03 exit NOT PASSED; P04 NOT STARTED.
- Counts 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED.
- Snapshot v34.24 / sequence 64 remains; do not create next snapshot before P01/WBS/Mission-State projection discrepancy is reconciled.

## Canonical runtime
- Neon project little-violet-66887398; main br-calm-block-a1fbdnnj; pilot br-lively-flower-a15zb6ar; DB/schema crypto_holdco/holdco.
- GitHub manish91082-coder/crypto-ai-holdco-runner, branch temporary-zero-cost-runtime-pilot, source/audit only.
- Active Function cryptoaicore #17, Node.js24 Singapore; source SHA d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- Governor PAUSE_DEGRADED/work_allowed=false.
- Existing Neon trigger trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71 at POST /internal/dispatch disabled, next_run_at=null.
- Seven synthetic owner-bound pilot rows; zero ownerless/queued/running.

## Google Apps Script candidate v1.4
- Candidate docs/P03.03_GOOGLE_APPS_SCRIPT_FUNCTION_OIDC_SCHEDULER_v1.4.md.
- Internal WBS review v1.1: docs/P03.03_GOOGLE_SCHEDULER_WBS_ACCEPTANCE_REVIEW_v1.1.md; NOT ACCEPTED FOR DEPLOYMENT.
- Independent review packet v1.0: docs/P03.03_INDEPENDENT_REVIEW_REQUEST_v1.0.md. No separate reviewer assigned or acceptance recorded.
- CI #147 SUCCESS, 66/66 tests: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46102252973. Candidate patched Function build SHA cdb5422ace7bc6d3c91a006984a13743d6ad87dd580598336919abfee112c4ee. Live Neon smoke skipped. No Function #18.
- Apps Script installer requires five Script Properties all literal true: P03_03_INDEPENDENT_WBS_ACCEPTED, P03_03_GOOGLE_IDENTITY_PREFLIGHT_VERIFIED, P03_03_FRESH_TOKEN_PER_TICK_VERIFIED, P03_05_QUOTA_RECOVERY_COMPLETE, GOOGLE_SCHEDULER_TRIGGER_APPROVED. None configured; no Apps Script project/trigger exists. This procedural guard does not count as WBS independent acceptance.
- Google OIDC verifier requires exact scalar audience and rejects aud arrays. CI includes multi-audience negative test.
- Replay SQL remains source-only, not applied or executed. At-most-once admission only; real token hash uniqueness between separate trigger invocations remains unknown.

## Current Neon usage read
- Active time 117,539 / 129,600 sec = 90.69%, remaining 12,061 sec.
- Compute 29,712 / 36,000 sec = 82.53%, remaining 6,288 sec.
- Transfer 31,571,998 / 1,000,000,000 bytes = 3.16%.
- Window closes 2026-12-01T00:00Z.
- Functions MTD invocations/active/waiting Capacity-Hours UNKNOWN/degraded; observed 111 invocation count is log lower bound, not bill-grade.

## Owner API token gates
- Synthetic CI app token canary CI #121 proved standard runtime.validate_api_token HTTP metrics 200, wrong-scope 401, revoked.
- This is not owner-operator-pilot token proof.
- owner-operator-pilot remains enabled, expiry 2026-12-27T09:44:32.105Z, raw token/hash not read.
- Actual owner token HTTP test, full manual/external consumer census and protected one-time delivery remain open. Rotation NO-GO.

## Exact next action sequence
1. Obtain genuine independent reviewer acceptance against locked P03.03/P03 exit criteria; do not self-certify.
2. Owner-controlled Apps Script project: preflight identity and record only issuer/audience/SHA256(sub)/iat/exp.
3. Run separate real trigger executions and confirm fresh ID-token hash on each tick.
4. Verify Google owner/account type/project authorization, execution region and account-specific remaining quota.
5. After 2026-12-01T00:00Z, refresh Neon usage and Function meters.
6. Complete P03.05 in sequence: daily budget, actual counters, 80% fail-closed stops, source freshness, checkpoint/recovery and pause/resume tests.
7. Complete owner API token positive HTTP, consumer census and protected delivery; only then rotate with overlap/cutover.
8. Only after gates: apply/test replay SQL on isolated pilot, deploy #18, perform live Google positive/negative HTTP, then consider separate trigger install approval.

No role/password/membership change, Data API, paid fallback, Cloudflare, owner-funded gas, live trading, signing, transfers, payments or external submission. Realised net revenue 0. P03.03 remains partial.
