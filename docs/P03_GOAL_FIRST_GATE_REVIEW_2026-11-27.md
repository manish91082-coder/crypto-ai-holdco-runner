# P03 Goal-First Gate Review — 27-Nov-2026

Mission: `crypto-ai-holdco-master` only.  
Canonical Neon project: `little-violet-66887398`; canonical branch: `br-calm-block-a1fbdnnj`.  
Isolated runtime pilot: `br-lively-flower-a15zb6ar` / database `crypto_holdco`.  
Master Constitution v2.0.0 and WBS v2.0.0 remain immutable.

## Decision

The four previously grouped gates are split by release tier. They must not block engineering and synthetic testing when they only protect later automated scheduling or real financial records.

| Gate | Revised classification | Release rule |
|---|---|---|
| Exact Functions MTD usage meter | Telemetry/release gate, not engineering blocker | Console meter must be captured before recurring scheduling or sustained autonomous dispatch. Until then: on-demand only, trigger disabled. |
| Exact billed storage read-back | Not a development blocker on confirmed Free plan | Stay within published Free limits; monitor database/branch footprint; no paid snapshots or upgrade. |
| Private external backup of canonical `holdco` | First-real-business-data gate | Complete private backup and restore before first real buyer contract, accepted delivery record, receipt or treasury/revenue ledger write. Not needed before synthetic engineering or public read-only discovery. |
| Governor pause/recovery | Mandatory worker-activation gate; now PASS on pilot | Both PAUSE and RUNNING claim behavior must pass with the actual dispatcher SQL. Return to PAUSE before ending test. |

This is a release-tier adjustment, not a change to Master/WBS and not a production or revenue claim.

## Neon Free envelope (verified published values as of 27-Nov-2026)

- PostgreSQL: 100 CU-hours/project/month; 1 GB storage/project; 10 branches/project; 5 GB public transfer/project/month.
- Object Storage: 5 GB/project.
- Functions: 1,000,000 invocations/project/month; 10 active and 400 waiting Capacity-Hours/project/month.
- Current Neon project plan read-back: `free_v3`.
- Latest project snapshot: `compute_time_seconds=22622`, equivalent to 6.2839 CU-hours; `data_transfer_bytes=24068418`, about 0.481% of 5 GB.
- Functions MTD active/waiting/invocation meter remains **UNKNOWN** because the Free-plan consumption API returns HTTP 403. Do not interpret this as zero usage.
- Pilot PostgreSQL database size: 16,097,280 bytes. Branch logical-size proxies are about 40 MB. These figures are not invoice-grade storage metrics.

Official references:
- https://neon.com/blog/neon-free-plan-1-gb-per-project
- https://neon.com/blog/neon-backend-is-ga

## Governor recovery: two-state live test PASS

Branch `br-lively-flower-a15zb6ar`; Function DB identity `crypto_holdco_function`.

1. With Governor `PAUSE_DEGRADED`, Function role could read the control row but saw zero queued task rows.
2. With Governor temporarily `RUNNING`, the exact dispatcher query using `FOR UPDATE SKIP LOCKED` claimed one synthetic probe, returning `status=running` and `attempt_count=1`.
3. Governor was restored to `PAUSE_DEGRADED`; the test row was deleted; paused visibility returned to zero; no queued/running probe remained.
4. Function role has SELECT-only access to `runtime.control_plane`; INSERT/UPDATE/DELETE are denied.
5. Forced RLS remains enabled on `runtime.tasks`; both SELECT and UPDATE policies require Governor `RUNNING` and `work_allowed=true`.

An initial recovery test exposed that a SELECT policy restricted to queued rows also hid the newly claimed running row from `UPDATE ... RETURNING`. The SELECT policy was corrected to allow task visibility only while Governor is RUNNING, without restricting returned task status. The final two-state test passed.

Reproducible script: `db/tests/pilot/verify_governor_pause_running_recovery.sql`  
Static regression test: `tests/governor-migration.test.js`  
Runtime audit event: `GOVERNOR_PAUSE_RUNNING_RECOVERY_TEST_PASS`.

## Current deployed state

- Function deployment #11, Node.js 24, Singapore.
- `/readyz`: `database_role=crypto_holdco_function`, `governor_state=PAUSE_DEGRADED`, `work_allowed=false`.
- Seven logical specialist roles in the A2A card; not seven independent LLMs yet.
- GitHub Actions CI run #47: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46009145835 (**SUCCESS**); syntax, archived bundle, 9 unit/safety/migration tests, live readiness, A2A card and unauthenticated HTTP 401 all passed.
- Neon scheduler trigger remains disabled.
- All five Postgres endpoints were returned to idle after testing.
- No live trading, wallet signing, token transfer, payment, external submission or paid fallback.
- Realised net revenue remains zero; no revenue claim.

## Next execution policy

Continue bounded on-demand engineering and synthetic validation. Do not enable recurring automation while the Functions MTD meter is unknown. Do not write real buyer/receipt/treasury records before the private canonical backup/restore gate. Keep Governor PAUSE_DEGRADED until the next bounded test is explicitly executed.

P03.01 remains PARTIAL and P03 exit remains NOT PASSED. P03.03/P03.05 must be re-assessed against the new release tiers without repeating already completed work. No P04 claim until P03 exit evidence is reconciled.


## 27-Nov-2026 quota telemetry and P03.01 closure addendum
The project-specific Neon API read-back exposes custom caps narrower than Free defaults:
- active_time_seconds 129,600; current 94,687 (73.061%).
- compute_time_seconds 36,000 CU-sec (10 CU-hours); current 23,950 (66.5278%).
- data_transfer_bytes 1,000,000,000; current 24,860,369 (2.486%).
- written_data_bytes cap 268,435,456; current zero.
- per-branch logical_size cap 536,870,912 bytes.
These actual custom caps are authoritative for this project.

Neon Free Function active/waiting Capacity-Hours and MTD invocations are UNKNOWN, not zero: Free consumption API returns 403 and the simplified Usage Summary does not show Function metrics. Recurring scheduling stays disabled.

P03.01 is now COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION. Next active task P03.03. P03.05 remains later in sequence and must implement persistent application-level quotas, dispatch stop and the proposed 80% soft ceilings. These soft ceilings are not live enforcement. P03 remains IN_PROGRESS and P03 exit remains NOT PASSED.
