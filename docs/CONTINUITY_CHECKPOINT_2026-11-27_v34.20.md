# Crypto AI Holdings — Continuity Checkpoint v34.20
Observed: 27-Nov-2026  
Mission key: `crypto-ai-holdco-master`

## Canonical authority
- Neon project: `little-violet-66887398`
- Canonical database/schema/branch: `crypto_holdco` / `holdco` / `br-calm-block-a1fbdnnj`
- Isolated pilot: `br-lively-flower-a15zb6ar`, database `crypto_holdco`
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Both locked documents remain unchanged.

## Goal
Build a zero-upfront, cloud-only, crypto-native AI-agent revenue ecosystem with authenticated A2A coordination, specialist agents, real external buyers, accepted delivery and independently verified positive net revenue. Do not confuse this mission with the wider ₹1,000/day/ZAGRE workstream or a standalone trading bot.

## Four-gate decision
1. Functions exact MTD usage meter: not a blocker for engineering/synthetic tests or bounded on-demand work. It remains mandatory before recurring scheduling or sustained automated dispatch. Exact Functions MTD use remains UNKNOWN because the Free-plan API returns 403.
2. Billed storage console meter: not a development blocker while on confirmed Free `free_v3`, no paid snapshots, no upgrade. Published limits and current footprint are tracked. PostgreSQL DB size and branch logical-size proxies are not invoice-grade.
3. Private external canonical backup: release gate before first real buyer contract, accepted delivery, settled receipt or treasury/revenue ledger write. It does not block isolated engineering, synthetic E2E or public read-only discovery.
4. Governor pause/recovery: mandatory worker-activation gate, now passed on the isolated pilot using the exact dispatcher claim SQL. Final state returned to PAUSE_DEGRADED.

Full decision and evidence: `docs/P03_GOAL_FIRST_GATE_REVIEW_2026-11-27.md`.

## Governor proof
- Pilot database table `runtime.control_plane`: final `PAUSE_DEGRADED`, `work_allowed=false`.
- `runtime.tasks` RLS enabled and forced; Function role SELECT and UPDATE policies require Governor RUNNING and work_allowed=true.
- Function role has SELECT only on control_plane; INSERT/UPDATE/DELETE are denied.
- Paused state: Function role sees zero queued tasks.
- Controlled RUNNING state: exact `FOR UPDATE SKIP LOCKED` dispatcher claim succeeded for one synthetic probe, status running, attempt_count=1.
- Re-paused; probe cleaned; queue visibility returned to zero. Runtime audit event: `GOVERNOR_PAUSE_RUNNING_RECOVERY_TEST_PASS`.
- Regression test: `tests/governor-migration.test.js`; reproducible SQL: `db/tests/pilot/verify_governor_pause_running_recovery.sql`.

## Runtime
- Neon Function `cryptoaicore`, deployment #11, Node.js 24, Singapore.
- Live /readyz reports `crypto_holdco_function`, `PAUSE_DEGRADED`, `work_allowed=false`.
- Scheduler trigger disabled; no autonomous polling.
- No live wallet signing, trading, transfers, payments, external submissions or paid fallback.
- Seven roles are currently logical specialist roles inside one Function, not seven independent concurrently running LLM instances.
- Realised net revenue = 0; no revenue claim.
- All five known Postgres endpoints were suspended/idle after this checkpoint.

## Current CI
- Run #47: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46009145835
- Conclusion: SUCCESS. Includes syntax, archived bundle integrity, corrected deterministic build, original domain/safety tests, four Governor migration regression tests, live readiness check, seven-role agent card and unauthenticated metrics HTTP 401.

## Phase state
- Current phase P03 Cloud Runtime & Resilience.
- P03.01 remains PARTIAL. P03.02/P03.04 remain COMPLETE. P03.03/P03.05 require re-assessment against gate tiers.
- P03 exit NOT PASSED. P04 not started.
- Do not modify Master/WBS. Do not re-audit OCI/Apps Script repeatedly; neither is a selected runtime dependency.
- Continue goal-first bounded engineering. Do not activate schedules until Functions MTD headroom is visible. Do not write real financial records before private canonical backup/restore passes.
