# Canonical Resume Prompt v2.7.2 — Crypto AI Holdings
Observed: 27-Nov-2026
Mission key: `crypto-ai-holdco-master`

Continue ONLY Crypto AI Holdings. Do not mix with ZAGRE/A2A-1000, PHANTOMX/Ghost Hunter, or other trading-bot work.

## Immutable locks
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Master and WBS are unchanged. Never edit or bypass them without a separate explicit change-control process.

## Canonical resources
- Neon project: `little-violet-66887398`, plan `free_v3`
- Canonical DB/schema/branch: `crypto_holdco` / `holdco` / `br-calm-block-a1fbdnnj`
- Isolated pilot: `br-lively-flower-a15zb6ar`, database `crypto_holdco`
- Mission status: `P03_GOAL_FIRST_GATES_RECLASSIFIED_BOUNDED_ON_DEMAND_ONLY`
- Phase: `P03_CLOUD_RUNTIME_AND_RESILIENCE`
- Active task: `CRYPTO-HOLDCO-V2-P03-01`, database status PLANNED and progress PARTIAL
- Continuity v34.20, snapshot sequence 60
- P03.01 remains PARTIAL; P03.02/P03.04 COMPLETE; P03.03/P03.05 require re-assessment against the updated gate tiers. P03 exit NOT PASSED. P04 not started.

## Mission goal
Zero-upfront, cloud-only crypto-native revenue ecosystem with authenticated A2A collaboration, specialist agents, funded opportunity qualification, engineering/delivery and independent payment verification. The outcome must be actual net revenue from unrelated buyers, not proposals, synthetic fixtures or model-generated receipts.

No local laptop/server. No paid fallback, no Cloudflare, no owner-funded gas, no automatic upgrades, no unapproved wallet signing, transfers, trades, external submissions or payments.

## Goal-first four-gate decision
Do not let the four checks create a circular blocker to all work. Apply them at the release tier they protect:

1. **Functions MTD usage:** UNKNOWN because Neon Free consumption API returns HTTP 403. Not a blocker to engineering, synthetic tests or bounded on-demand work while scheduler stays disabled. It is mandatory before recurring scheduling or sustained autonomous dispatch. Do not infer zero.
2. **Billed storage:** exact Console meter is not a development blocker on confirmed Free v3. Published limits: 1GB PostgreSQL/project and 5GB Object Storage/project. Monitor headroom. Do not enable paid snapshots or upgrade. PostgreSQL/branch logical sizes are not invoice storage.
3. **Private canonical backup:** mandatory before first real buyer contract, accepted delivery, settled receipt or treasury/revenue ledger write. Does not block synthetic engineering or public read-only discovery. Public GitHub must never contain private canonical ledger data.
4. **Governor pause/recovery:** mandatory worker-activation gate, now PASS in both states using the exact dispatcher claim CTE. Final state is PAUSE_DEGRADED and work_allowed=false.

Full gate decision and evidence: `docs/P03_GOAL_FIRST_GATE_REVIEW_2026-11-27.md`.

## Governor live proof
Pilot branch `br-lively-flower-a15zb6ar`; Function database role `crypto_holdco_function`.
- `runtime.control_plane` final state `PAUSE_DEGRADED`, `work_allowed=false`.
- `runtime.tasks` RLS is enabled and forced.
- SELECT and UPDATE policies require Governor RUNNING and work_allowed=true.
- Function role has SELECT only on control_plane; INSERT/UPDATE/DELETE are denied.
- In PAUSE, Function role sees zero queued rows.
- In controlled RUNNING, actual dispatcher query (`FOR UPDATE SKIP LOCKED` followed by UPDATE RETURNING) claims one synthetic probe: status=running, attempt_count=1.
- Governor restored to PAUSE; probe removed; final queued/running counts zero.
- An initial queued-only SELECT policy blocked UPDATE RETURNING; corrected policy permits visibility only while RUNNING without hiding the running row.
- Reproducible test: `db/tests/pilot/verify_governor_pause_running_recovery.sql`.
- Static tests: `tests/governor-migration.test.js`.

## Runtime state
- Neon Function `cryptoaicore`, deployment #11, Node.js 24, Singapore.
- Source SHA-256: `931c4635c038ec9855db1137df5b7822e0313020b59fdaaae9f4b1b5b0d29741`.
- `/readyz` reports database role `crypto_holdco_function`, Governor `PAUSE_DEGRADED`, work_allowed=false.
- Seven A2A specialist roles are logical roles in one Function, not yet seven independent LLM instances.
- Neon scheduler trigger remains disabled. All known Postgres endpoints were idled after the audit.
- No live trading, wallet signing, transfers, payments, external submissions or revenue claim. Realised net revenue=0.

## Neon Free telemetry
Published limits (current sources):
- 100 CU-hours/project/month; 1GB PostgreSQL/project; 10 branches/project; 5GB public transfer/project/month.
- 5GB Object Storage/project.
- Functions 1M invocations/project/month, 10 active and 400 waiting Capacity-Hours/project/month.
Sources:
https://neon.com/blog/neon-free-plan-1-gb-per-project
https://neon.com/blog/neon-backend-is-ga

Live project snapshot:
- `compute_time_seconds=22622` = 6.2838889 CU-hours
- `active_time_seconds=89443`
- `data_transfer_bytes=24068418` (~0.481% of 5GB)
- Pilot `pg_database_size=16097280` bytes
- Branch logical-size proxy ~40MB, not billing storage
- Functions MTD usage remains UNKNOWN.

## Latest CI
Run #47: SUCCESS  
https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46009145835

Nine tests passed (five domain/safety + four Governor SQL migration regressions). Live readiness, seven-role A2A card and unauthenticated metrics HTTP 401 passed.

## Next action
Continue bounded on-demand engineering within P03; do not start repeating OCI or Apps Script inventories because neither is selected as a runtime dependency. Reassess P03.03/P03.05 against the new gate tiers. No recurring scheduler until Function MTD headroom is known. No real buyer/financial ledger data until private canonical backup/restore passes. Keep Governor paused outside bounded synthetic tests. No Master/WBS edit and no revenue claim.
