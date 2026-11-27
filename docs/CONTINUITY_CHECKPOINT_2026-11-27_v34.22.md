# Crypto AI Holdings — Continuity Checkpoint v34.22
Observed: 27-Nov-2026
Mission key: `crypto-ai-holdco-master`

## Locked authority
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3b3da6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Master/WBS immutable and unchanged.

## Canonical systems
- Neon project: `little-violet-66887398`, Free v3.
- Canonical database/schema/branch: `crypto_holdco` / `holdco` / `br-calm-block-a1fbdnnj`.
- Isolated pilot: `br-lively-flower-a15zb6ar`, database `crypto_holdco`.
- GitHub repo: `manish91082-coder/crypto-ai-holdco-runner`, branch `temporary-zero-cost-runtime-pilot`.
- Function `cryptoaicore`, deployment #12, Node.js 24, Singapore.
- Source SHA-256: `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`.

## WBS and phase
- Current phase P03 Cloud Runtime & Resilience.
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04 COMPLETE.
- P03.03 active, PLANNED / nested PARTIAL.
- P03.05 PLANNED / nested PARTIAL, later in sequence.
- P03 remains IN_PROGRESS; P03 exit NOT PASSED; P04 not started.
- Counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED (119 total).
- Continuity v34.22; audit round 46; snapshot sequence 62.

## P03.03 runtime and token hardening
- Function identity `crypto_holdco_function`; NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOBYPASSRLS; no canonical holdco schema access.
- Token tables include scopes, expires_at, revoked_at, rotation_group and last_used_at. Hashes only; no raw bearer or hash was read.
- API token scopes: agents:read, demo:run, tasks:write, tasks:read:any, metrics:read, a2a:write. Cron token: dispatch:run only.
- Both existing records expire 27-Dec-2026 09:44:32 UTC. No replacement created or rotation performed.
- SECURITY DEFINER token validators have a fixed search_path and enforce enabled/scope/expiry/revocation; successful validation updates last_used_at. Function role can execute validators but cannot directly SELECT token tables.
- Route scopes are enforced. Body max 65,536 bytes; 413 for oversized, 400 invalid JSON; generic internal errors do not expose DB/SQL detail.
- CI #69 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46016226247. Unauthenticated metrics/task-write/A2A/cron routes all return 401.
- Positive bearer canary and valid authenticated route not independently verified; secure rotation procedure and task subject ownership remain open. `tasks:read:any` is restricted to the single operator token in this pilot only.
- Last-used update code deployed but no successful authenticated route has been observed since migration.

## Neon project quota and Functions meter
Actual custom project caps govern:
- Active cap 129,600 sec; latest use 94,687 sec (73.061%).
- Compute cap 36,000 CU-sec (10 CU-hours); latest use 23,950 (66.5278%).
- Transfer cap 1,000,000,000 bytes; latest use 24,860,369 (2.486%).
- Write cap 268,435,456 bytes; latest use 0.
- Functions active/waiting/invocation MTD remains UNKNOWN on Free (API 403 and simplified Usage Summary not showing Function metrics). Keep scheduler disabled.
- Proposed 80% soft stop belongs to P03.05, not live enforcement.

## Governor and money boundary
- Governor PAUSE_DEGRADED, work_allowed=false.
- Neon schedule trigger disabled; no recurring polling.
- All known Postgres endpoints idle at last verification.
- No live trading, wallet signing, transfers, payments or external submissions.
- Seven roles are logical entries in one deterministic Function, not independent LLM instances.
- Realised net revenue=0; no revenue claim.

## Next active work
Continue P03.03:
1. Establish positive-token authenticated canary and valid request evidence without exposing raw bearer/hash.
2. Implement secure token issuance/rotation/reissue/revocation process before 27-Dec-2026 expiry.
3. Decide/implement task-subject ownership; keep tasks:read:any restricted to single operator until multi-tenant isolation.
4. Observe successful last_used_at update through a valid request.
5. Finish the runtime/deployment/service-terms/secrets checklist.
6. Keep scheduler disabled and Governor paused outside bounded tests.

Then, and only after P03.03 is exhausted, proceed to P03.05 application-level daily invocation budgets, persistent custom-quota accounting, 80% fail-closed stop, checkpoint/recovery and free fallback. No P04 claim until P03 exit evidence passes.
