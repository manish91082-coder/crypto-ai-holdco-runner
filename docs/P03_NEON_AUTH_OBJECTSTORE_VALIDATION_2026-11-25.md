# P03 Neon Runtime Authentication Investigation — Public-Safe Summary

**Date:** 25 November 2026  
**Phase:** P03 — Cloud runtime and resilience  
**Disposition:** Partial evidence advance; production remains paused.

## Results

A disposable cloud branch was used to test three authentication assumptions:

1. **Function-injected Postgres URL:** a read-only connection failed with SQLSTATE 28P01 using SCRAM-SHA-256. The injected URL alone was not a passwordless database credential.
2. **Data API anonymous request:** the request failed with HTTP 401 / PGRST302. Even an anonymous Postgres role requires a valid JWT bearer token.
3. **Private Object Storage bootstrap:** a Function request returned HTTP 403. The deployed probe did not preserve the S3 error body/code, so the cause is unresolved. The temporary one-minute diagnostic recorded 55 failed application events in the disposable environment only.

No Auth account, machine identity, password, session, JWT, or business-data row was created.

## Cleanup and production boundary

The disposable test environment was cleaned up: Functions 0, Triggers 0, Data API disabled, buckets 0, Auth disabled. The test branch was retained for audit history. Production main was not modified.

The failed manual SigV4 probe does not establish that Object Storage itself is unavailable. The next test, if separately continued, should use the documented AWS SDK pattern (forcePathStyle: true) or an independently standards-tested signer, capture only sanitised S3 error code/request ID, and run once without a recurring schedule.

## P03 status

P03 remains IN_PROGRESS / NOT PASSED:
- P03.01 PARTIAL
- P03.02 COMPLETE
- P03.03 PARTIAL / BLOCKED
- P03.04 COMPLETE
- P03.05 PARTIAL / BLOCKED

The conditional Google Apps Script + Google OIDC candidate remains preflight-only. Owner-side identity preflight and OCI account/network evidence are still outstanding. Quota Governor remains fail-closed. No production worker, recurring workload, opportunity scan, buyer, or realised revenue is claimed.

The locked Master Constitution/WBS v2.0.0 remain unchanged. The P01/WBS/Mission-State sequencing discrepancy remains OPEN.

**P03 exit: NOT PASSED. Do not start P04.**
