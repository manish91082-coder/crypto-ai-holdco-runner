# Canonical Resume Prompt v2.7.5 — Crypto AI Holdings
Observed: 27-Nov-2026 14:42 UTC
Mission key: `crypto-ai-holdco-master`

Continue ONLY Crypto AI Holdings. Do not mix with ZAGRE/A2A-1000, PHANTOMX/Ghost Hunter or other trading-bot projects.

## Locked authority
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Never edit the locked Master or WBS.
- Phase P03 active; P03.01 complete with documented Function-meter limitation; P03.02/P03.04 complete.
- Active task `CRYPTO-HOLDCO-V2-P03-03`, PLANNED / nested PARTIAL.
- P03.05 is PLANNED / PARTIAL, later in sequence.
- P03 remains IN_PROGRESS; exit NOT PASSED; P04 not started.
- Counts 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED of 119.
- Continuity v34.24, audit 48, snapshot sequence 64.

## Mission and hard boundaries
Goal: zero-upfront, cloud-only crypto-native AI-agent revenue ecosystem with authenticated A2A, specialist agents, funded opportunity discovery, engineering delivery, and independently verified positive net revenue from unrelated buyers.
No local runtime, paid fallback/upgrade/snapshot, Cloudflare, owner-funded gas, wallet signing, trading, transfers, payments or external submissions without separate release gates. No revenue claim from synthetic records/proposals.

## Canonical resources and deployed Function
- Neon project `little-violet-66887398`, Free v3.
- Canonical DB/schema/main branch `crypto_holdco` / `holdco` / `br-calm-block-a1fbdnnj`.
- Runtime pilot branch `br-lively-flower-a15zb6ar`, DB `crypto_holdco`.
- GitHub repo `manish91082-coder/crypto-ai-holdco-runner`, branch `temporary-zero-cost-runtime-pilot`.
- Function `cryptoaicore`, deployment #12, Node.js 24, Singapore.
- Source SHA-256 `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`.
- CI #69 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46016226247.
- CI #70 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46017056190.

## Actual custom project quotas
Billing period 16-Nov-2026 to 01-Dec-2026:
- active_time_seconds cap 129,600; usage 94,687 (73.061%).
- compute_time_seconds cap 36,000 CU-sec (10 CU-hours); usage 23,950 (66.528%).
- transfer cap 1,000,000,000 bytes; usage 24,997,930 (2.500%).
- written data cap 268,435,456 bytes; usage 0.
- Function MTD active/waiting/invocations UNKNOWN on Free (API 403 and simplified Usage Summary omits Function metrics); not zero.
- Storage billing UNKNOWN; logical sizes are not invoice values.
- P03.05 owns the app-level daily invocation budget and proposed 80% fail-closed ceilings. They are NOT live.

## Function auth / least privilege
Function role `crypto_holdco_function`: NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOBYPASSRLS; `runtime` only, no canonical `holdco` schema.
Token tables now store SHA-256 hashes only plus subject/enabled/created_at/scopes/expires_at/revoked_at/rotation_group/last_used_at.
- API subject `owner-operator-pilot`; scopes: agents:read, demo:run, tasks:write, tasks:read:any, metrics:read, a2a:write.
- Cron subject `neon-scheduled-dispatcher`; scope dispatch:run.
- Both expiry timestamps: 2026-12-27T09:44:32.105Z. No rotation/reissue occurred; do not expose raw credentials.
- SECURITY DEFINER validators have fixed search path, enforce enabled/required scope/not revoked/not expired, and update last_used_at.
- Function role can EXECUTE validators but cannot directly SELECT token tables; PUBLIC EXECUTE revoked.
- CI #69 negative checks: unauthenticated metrics/tasks/A2A/cron endpoints all HTTP 401.
- Positive DB validator canary: API metrics:read=1, API wrong wallet:withdraw=0, cron dispatch:run=1; separate read-back confirmed both last_used_at non-null.
- This does NOT prove positive authenticated HTTP bearer route. No task inserted/dispatched.
- Keep tasks:read:any single-operator only until subject-bound task ownership is implemented.
- Cron token is currently carried in URL path; review logs/exposure before enabling scheduled trigger.

## Neon terms
Use Neon only as infrastructure for our own agent services. Do not resell/white-label Neon APIs/connectors or build a competing Neon backend. Customer is responsible for credentials and backups. Free plan offers no 24x7 SLA; Neon may modify/discontinue functionality.
Terms: https://d7umqicpi7263.cloudfront.net/eula/ETeCDF9JpM27sHwVLg5xdCTWvMfSD6N0ibw9OxKWt80

## Runtime / finance state
Governor PAUSE_DEGRADED / work_allowed=false. Scheduler trigger disabled. No live trading, signing, transfer, payment, external submission or owner gas. Realised net revenue 0. Seven roles remain logical roles in one Function, not seven independent LLM workers.

## Next WBS execution — remain on P03.03
1. Positive authenticated HTTP bearer canary without exposing raw credentials.
2. Secure token issuance/reissue/revoke/rotation and complete it before 27-Dec-2026 expiry.
3. Implement task-subject ownership; keep tasks:read:any single-operator only until then.
4. Review cron path-secret logging exposure; keep the scheduler disabled.
5. Finish Function deployment/runtime/region/environment/terms checklist.

Then continue sequentially to P03.05: persisted daily request/invocation budget, actual custom-quota accounting, 80% fail-closed stop, durable checkpoint/recovery and verified no-paid fallback. P03 remains open. No P04 or revenue claim.
