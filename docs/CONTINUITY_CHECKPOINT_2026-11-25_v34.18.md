# Crypto AI Holdings — Continuity Checkpoint v34.18

**Date:** 25 November 2026  
**Mission key:** crypto-ai-holdco-master  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED, 24 phases / 119 numbered tasks  
**Active phase:** P03 — Cloud runtime and resilience

## Current P03 decision

P03 remains IN_PROGRESS; exit gate NOT PASSED. The provider API/catalog login-flag mismatch for the runtime role has been resolved by aligning the PostgreSQL flag with the provider's NOLOGIN contract. A separate authenticated runtime path remains unproven.

## Runtime role alignment

Neon provider role API: `authentication_method=no_login`. Before correction, PostgreSQL catalog reported `rolcanlogin=true`. Neon documentation defines NOLOGIN as a role that cannot authenticate. A minimally scoped `ALTER ROLE holdco_runtime NOLOGIN` was applied using an owner role with CREATEROLE. No password reset, password/hash retrieval, grants, revokes, membership/ownership change or login attempt was performed.

Post-change: provider API still says `no_login`; PostgreSQL catalog now says `rolcanlogin=false`. The role remains non-superuser and inherits the non-login worker privilege group. Existing mission/source/quota/scheduler reads and column-scoped scheduler writes remain; no task-run insert or scheduler delete. A separate secret-safe LOGIN identity or OIDC/JWT runtime path is still required. Do not turn this permission-group role back into LOGIN.

Detailed public-safe audit: [P03_RUNTIME_ROLE_NOLOGIN_ALIGNMENT_2026-11-25.md](P03_RUNTIME_ROLE_NOLOGIN_ALIGNMENT_2026-11-25.md).

## Quota Governor v0.2.1

Offline only; 33/33 tests pass. Current six-resource 25-Nov snapshot replay keeps Functions capacity UNKNOWN and invocations DEGRADED/stale. Exact-six resource contract unchanged; Object Storage and branch inventory remain separate audit context. No deployment, schema migration or dispatch authority. Global state remains `PAUSE_DEGRADED / work_allowed=false`.

## Production posture

Main Functions 0, Triggers 0, Data API disabled, no Object Storage buckets. S3 canary remains NOT PROVEN; disposable resources are removed/revoked. Main compute is suspended after canonical update/read-back. No production agents, schedules, sources, opportunities, payments, trades or realised revenue are active. No paid fallback, wallet top-up or upgrade.

## WBS status

| Task | State |
|---|---|
| P03.01 | PARTIAL |
| P03.02 | COMPLETE |
| P03.03 | PARTIAL / BLOCKED |
| P03.04 | COMPLETE |
| P03.05 | PARTIAL / BLOCKED |

Open blockers: separate authenticated no-cost runtime identity, live Functions quota/pause/recovery integration, S3 canary, Google OIDC preflight, OCI evidence, and P01/WBS/Mission-State sequencing reconciliation. Locked WBS must not be mutated or reordered.

**P03 EXIT NOT PASSED. Do not start P04.**
