# Canonical Resume Prompt v2.7.3 — Crypto AI Holdings
Observed: 27-Nov-2026
Mission key: `crypto-ai-holdco-master`

Continue ONLY Crypto AI Holdings. Do not mix with ZAGRE/A2A-1000, PHANTOMX/Ghost Hunter or other trading-bot missions.

## Locked authority
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3b3da6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Never edit the locked Master or WBS.
- Current WBS phase: P03 Cloud Runtime & Resilience.
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04 COMPLETE.
- Next active WBS task: `CRYPTO-HOLDCO-V2-P03-03`, PLANNED / nested PARTIAL.
- P03.05 remains PLANNED / nested PARTIAL and comes later in sequence.
- P03 remains IN_PROGRESS; P03 exit NOT PASSED; P04 not started.
- Counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED (119 total).
- Continuity v34.21; audit round 44; snapshot sequence 61.

## Canonical systems
- Neon project: `little-violet-66887398`, plan `free_v3`.
- Canonical branch/database/schema: `br-calm-block-a1fbdnnj` / `crypto_holdco` / `holdco`.
- Runtime pilot branch: `br-lively-flower-a15zb6ar`, database `crypto_holdco`.
- GitHub repo: `manish91082-coder/crypto-ai-holdco-runner`, branch `temporary-zero-cost-runtime-pilot`.
- Latest repo CI: #55 SUCCESS, https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46012576148.

## Mission goal and non-negotiable constraints
Build a zero-upfront, cloud-only, crypto-native AI-agent revenue ecosystem with authenticated A2A coordination, funded opportunity discovery, specialist agents, engineering delivery, and independently verified positive net revenue from unrelated external buyers.

No laptop/local runtime, no paid fallback/upgrades, no Cloudflare, no owner-funded gas, no wallet signing, no live trading, no transfers, payments or external submission without separate locked release gates. No revenue claims from synthetic records or proposals.

## P03.01 completion: actual custom project quota telemetry
Live Neon project custom caps (the project's actual custom limits, not merely published Free defaults):
- active_time_seconds cap: 129,600 (36 hours per billing period).
- compute_time_seconds cap: 36,000 CU-seconds = 10 CU-hours.
- written_data_bytes cap: 268,435,456.
- data_transfer_bytes cap: 1,000,000,000.
- per-branch logical_size_bytes cap: 536,870,912.

Latest project usage:
- active_time_seconds 94,687 = 73.061%; remaining 34,913 seconds.
- compute_time_seconds 23,950 = 6.65278 CU-hours = 66.5278%; remaining 12,050 CU-seconds (3.34722 CU-hours).
- data_transfer_bytes 24,860,369 = 2.486%; remaining 975,139,631 bytes.
- written_data_bytes 0.
- Billing period: 2026-11-16T06:19:20Z to 2026-12-01T00:00:00Z.

These custom caps are tighter than published Neon Free default limits and control this project.

### Functions usage visibility limitation
Exact Functions active/waiting Capacity-Hours and MTD invocations are UNKNOWN, not zero:
- Neon Free detailed consumption API returns HTTP 403.
- Official Neon Plans documentation says the simplified Usage Summary does not show Function usage metrics.
- Keep recurring scheduling disabled. P03.05 must implement application-level invocation/day budgets and persisted quota guards.

Full telemetry: `docs/P03.01_NEON_PROJECT_QUOTA_TELEMETRY_2026-11-27.md`.

### P03.05 policy target, not deployed
Proposed internal soft stop at 80% of project custom quota:
- active time 103,680 seconds (8,993 seconds remaining to the soft stop at latest observation);
- compute 28,800 CU-seconds (4,850 CU-seconds remaining);
- transfer 800,000,000 bytes;
- written data 214,748,364 bytes.
These values are a design target, NOT live enforcement. P03.05 must implement and test persisted usage accounting, fail-closed dispatch stop, checkpoint and safe recovery before claims of enforcement.

## Four-goal-first gates
1. Functions MTD meter: not a blocker for engineering/on-demand synthetic tests; UNKNOWN on Free; scheduler disabled; application quota guards required before recurrence.
2. Billed storage: exact invoice meter remains UNKNOWN and is not a dev blocker on Free v3; do not infer from logical database size; no paid snapshots/upgrades.
3. Private canonical backup: must pass before first real buyer contract, accepted delivery, settled receipt or treasury/revenue ledger write. Synthetic engineering/read-only discovery may continue.
4. Governor: mandatory worker activation gate, PASS on both PAUSE and RUNNING recovery test in isolated pilot; final state PAUSE_DEGRADED / work_allowed=false.

## Runtime
- Neon Function `cryptoaicore`, deployment #11, Node.js 24, Singapore.
- Function role `crypto_holdco_function`; `/readyz` reports Governor PAUSE_DEGRADED and work_allowed=false.
- Seven A2A entries are logical roles inside one Function, not seven independent LLM instances.
- Scheduler trigger disabled; no recurring autonomous worker.
- All five known Postgres endpoints idle at the last checkpoint.
- Realised net revenue=0; no buyer or payment verified.

## Next active task: P03.03
Evaluate the existing Neon Function runtime against locked requirements:
- published plan/service terms and actual project-specific custom quotas;
- deployment region, Node.js runtime and archive/source integrity;
- Function route authentication, API/cron token handling, token hashes and rotation;
- runtime DB identity and least privilege;
- secret handling and deployment environment boundaries;
- safe on-demand endpoints versus disabled recurring scheduler;
- runtime deployment readiness, recovery and evidence.

Do not repeat broad OCI/Apps Script account inventories because neither is a selected dependency. Do not enable recurring scheduling. Do not begin P03.05 before P03.03 is exhausted. Keep Governor paused outside explicitly bounded synthetic tests.

## Continuity update
Canonical Neon mission: `P03_03_NEON_FUNCTION_RUNTIME_EVALUATION_ACTIVE`; active task P03.03; P03 remains IN_PROGRESS / exit NOT PASSED. Snapshot `snap.holdco.continuity.v34.21`, sequence 61.
GitHub checkpoint: `docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.21.md`.
