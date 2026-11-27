# Crypto AI Holdings — Continuity Checkpoint v34.21
Observed: 27-Nov-2026
Mission key: `crypto-ai-holdco-master`

## Canonical authority
- Neon project: `little-violet-66887398`, plan `free_v3`
- Canonical branch/database/schema: `br-calm-block-a1fbdnnj` / `crypto_holdco` / `holdco`
- Isolated runtime pilot: `br-lively-flower-a15zb6ar`, database `crypto_holdco`
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Master and WBS immutable and unchanged.

## Latest WBS task state
- P03.01: COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04: COMPLETE.
- P03.03: next active WBS task; currently PLANNED / nested PARTIAL.
- P03.05: PLANNED / nested PARTIAL; remains later in sequence.
- P03 remains IN_PROGRESS; P03 exit NOT PASSED; P04 not started.
- Counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED (119 total).
- Continuity v34.21; audit round 44; snapshot sequence 61.

## P03.01 quota outcome
Project custom limits, not published defaults, are controlling:
- active_time_seconds cap 129,600; current 94,687 (73.061%), remaining 34,913.
- compute_time_seconds cap 36,000 CU-seconds = 10 CU-hours; current 23,950 = 6.65278 CU-hours (66.5278%), remaining 12,050 CU-seconds.
- transfer cap 1,000,000,000 bytes; current 24,860,369 (2.486%), remaining 975,139,631.
- written_data_bytes cap 268,435,456; current 0.
- branch logical_size_bytes cap 536,870,912.
Billing period: 2026-11-16T06:19:20Z to 2026-12-01T00:00:00Z.

Functions active/waiting Capacity-Hours and MTD invocations are UNKNOWN because the Free consumption API returns 403 and Neon’s simplified Usage Summary does not display Function usage. They are not zero. Do not enable recurring scheduling. Full quota evidence: `docs/P03.01_NEON_PROJECT_QUOTA_TELEMETRY_2026-11-27.md`.

## P03.05 future soft-stop policy, not deployed
Proposed 80% thresholds: active 103,680 seconds; compute 28,800 CU-seconds; transfer 800,000,000 bytes; writes 214,748,364 bytes. Current headroom to soft stop: active 8,993 seconds; compute 4,850 CU-seconds. This is design only. P03.05 must implement persistent metering, fail-closed dispatch stop, durable checkpoints and safe recovery before claiming enforcement.

## Runtime and safety
- Neon Function `cryptoaicore`, deployment #11, Node.js 24, Singapore.
- Function role `crypto_holdco_function`; /readyz reports Governor PAUSE_DEGRADED and work_allowed=false.
- Scheduler trigger disabled; all five Postgres endpoints idle at end of last audit.
- Governor two-state live recovery test passed with actual dispatcher CTE: paused queue visibility=0; controlled RUNNING claim=1 synthetic probe; Governor re-paused; probe removed.
- Seven specialist roles remain logical roles in one Function, not seven independent LLM instances.
- No wallet signing, trading, transfers, payments or external submission. Realised net revenue=0.
- GitHub CI path filters prevent docs-only commits from invoking live runtime smoke. Run #55 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46012576148.

## Next active work: P03.03
Evaluate Neon Functions runtime against locked requirements: service terms, region/runtime, function authentication, DB identity and least privilege, secrets boundaries, published quotas vs actual project custom caps, safe on-demand routes, disabled scheduling, deployment source integrity and recovery. Do not repeat wide OCI or Apps Script inventory; neither is a selected dependency. Keep the Governor paused outside bounded tests. P03.05 follows P03.03 and implements the application quota Governor.
