# Canonical Resume Prompt v2.7.4 — Crypto AI Holdings
Observed: 27-Nov-2026
Mission key: `crypto-ai-holdco-master`

Continue ONLY Crypto AI Holdings. Do not mix this mission with ZAGRE/A2A-1000, PHANTOMX/Ghost Hunter or other trading-bot tasks.

## Locked authority
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3b3da6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Do not edit Master or WBS.
- Current phase P03 Cloud Runtime & Resilience.
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION; P03.02/P03.04 COMPLETE.
- Active WBS task P03.03, PLANNED / nested PARTIAL.
- P03.05 PLANNED / nested PARTIAL, later in sequence.
- P03 remains IN_PROGRESS; exit NOT PASSED; P04 not started.
- Counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED of 119.
- Continuity v34.22; audit round 46; snapshot sequence 62.

## Canonical resources
- Neon project `little-violet-66887398`, Free v3.
- Main branch/database/schema: `br-calm-block-a1fbdnnj` / `crypto_holdco` / `holdco`.
- Isolated Function pilot: `br-lively-flower-a15zb6ar`, database `crypto_holdco`.
- GitHub repo `manish91082-coder/crypto-ai-holdco-runner`, branch `temporary-zero-cost-runtime-pilot`.
- Function `cryptoaicore`, deployment #12, Node.js 24, Singapore.
- Source SHA-256: `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`.
- Latest CI #69 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46016226247.

## Mission goal and strict constraints
Build a zero-upfront, cloud-only, crypto-native AI-agent revenue ecosystem with authenticated A2A, specialist agents, funded opportunity discovery, engineering delivery and independently verified positive net revenue from external buyers.

No local runtime, paid fallback/upgrades, paid snapshots, Cloudflare, owner-funded gas, wallet signing, trading, transfers, payments, or external submissions without their distinct future release gates. No revenue claims from synthetic records/proposals.

## Actual custom Neon project quota state
Billing period 2026-11-16T06:19:20Z to 2026-12-01T00:00:00Z:
- active cap 129,600s; latest 94,687s (73.061%).
- compute cap 36,000 CU-sec = 10 CU-hours; latest 23,950 (66.5278%).
- transfer cap 1,000,000,000 bytes; latest 24,860,369 (2.486%).
- write cap 268,435,456; latest 0.
Functions active/waiting Capacity-Hours and invocations MTD remain UNKNOWN on Free (API 403 and no simplified Usage Summary meter). Scheduler stays disabled. P03.05 owns the app-level invocation/day budget and 80% soft-stop implementation; these are not live yet.

## Deployed scoped authentication
API/cron credential schema: token_hash, subject, enabled, created_at, scopes, expires_at, revoked_at, rotation_group, last_used_at. Raw values/hashes not read or exposed.
API scope set currently on the single owner-operator token: agents:read, demo:run, tasks:write, tasks:read:any, metrics:read, a2a:write. Cron scope: dispatch:run only. Both expire 2026-12-27T09:44:32Z. No token replacement/rotation performed.
SECURITY DEFINER validators with fixed `search_path=pg_catalog,runtime` enforce enabled, exact scope, expiry and revocation; successful validation writes last_used_at. Function role has validator EXECUTE but no direct token-table SELECT.
Route scopes enforced, request body limit 65,536 bytes, oversized returns 413, invalid JSON 400, generic 500 response does not expose internal error details.
Live negative tests #69 returned 401 for unauthenticated metrics, task submission, A2A message and cron dispatch.
Positive bearer canary/valid authenticated route not yet independently tested. Token rotation, secure issue/reissue, subject-bound task ownership and successful last-used observation are still open. The owner scope tasks:read:any is single-operator pilot only; do not use it for multi-tenant buyers.

## Neon terms and runtime suitability
Official Neon Terms reviewed. Use Neon only as infrastructure for our own services; do not resell/white-label Neon products/APIs/connectors or create a competing Neon backend product. Customer retains responsibility for security and backup. Terms reserve operational modifications/discontinuation and do not establish a Free-plan 24x7 production SLA.
Sources:
https://d7umqicpi7263.cloudfront.net/eula/ETeCDF9JpM27sHwVLg5xdCTWvMfSD6N0ibw9OxKWt80
https://neon.com/docs/compute/functions/overview
https://neon.com/docs/compute/functions/environment-variables
https://neon.com/docs/introduction/plans

## Current safety state
- Governor PAUSE_DEGRADED / work_allowed=false.
- Scheduler trigger disabled; no recurring dispatch.
- All Postgres endpoints should be idle outside a measured bounded test.
- Seven A2A roles are logical roles in one deterministic Function, not independent LLM models.
- No live trading/signing/transfer/payment/external submission. Realised net revenue=0.

## Next work (stay in P03.03)
1. Establish a positive bearer-auth canary through an approved secure method without revealing raw tokens.
2. Write token rotation/reissue/revocation procedure and complete it before 27-Dec-2026 credential expiry.
3. Decide/implement task-subject ownership; keep tasks:read:any restricted to the single operator until isolation is built.
4. Observe successful last_used_at update.
5. Finish provider service terms, runtime region, environment and deployment artifact checklist.
6. Keep scheduler disabled.

Then proceed sequentially to P03.05: persisted daily invocation budgets, custom project quota accounting, 80% fail-closed stop, durable checkpoint/recovery and verified free fallback. P03 exit remains NOT PASSED; P04 not started.
