# P03 S3 SigV4 Root-Bundle Diagnostic — Public-Safe Summary

**Date:** 25 November 2026  
**Phase:** P03 — Cloud runtime and resilience  
**Disposition:** Partial advance; actual S3 object-operation canary remains NOT RUN.

## Evidence advanced

Neon’s current Object Storage documentation confirms the S3 credential field mapping, branch-scoped Function environment injection, and `forcePathStyle: true` requirement for the AWS SDK for JavaScript. A zero-dependency Node.js 24 diagnostic was built to use the injected Function environment and perform a bounded List / PUT / GET / DELETE test against a private disposable bucket. The local ZIP passes integrity checks and the SigV4 signing implementation matches the AWS published example signature. This is signer correctness evidence only, not proof of Neon storage access.

The diagnostic bundle was corrected to place `index.mjs` and `package.json` at ZIP root. Function `p03s3probe` deployment v5 completed on the disposable branch. The trigger remains disabled. A short-lived, branch-bound `storage:read` + `storage:write` credential and private test bucket exist only on that disposable branch.

## Unresolved invocation path

No S3 application request has yet reached the handler. The trigger scheduler did not produce a Function invocation and remains disabled. TinyFish browser automation could not start because its wallet balance was negative; no paid top-up will be used. The web fetch route could not access the Function URL, and the local runtime DNS resolver could not resolve that host. Therefore storage authentication remains unproven, neither success nor failure.

A high-entropy nonce-protected manual GET capability has been configured on the disposable test Function, but its nonce is not published or stored in this public report. The remaining one-time canary requires a single operator GET. The endpoint is designed to expose only safe status/error diagnostics and to attempt cleanup of the synthetic test object.

## Production boundary

Canonical production main remains Functions 0, Triggers 0, Data API disabled. No main-branch service, role, storage bucket, business record, opportunity source, worker, wallet or revenue action was activated or changed. The disposable branch is retained for audit only.

P03 remains IN_PROGRESS / NOT PASSED. P03.01, P03.03 and P03.05 remain PARTIAL/BLOCKED; P03.02 and P03.04 remain COMPLETE. Google OIDC owner preflight, OCI account/network/billing evidence, live quota freshness and live pause/recovery proof remain outstanding. The P01/WBS/Mission-State discrepancy remains OPEN. Master Constitution/WBS v2.0.0 remain locked and unchanged.

Public continuity: [CONTINUITY_CHECKPOINT_2026-11-25_v34.14.md](CONTINUITY_CHECKPOINT_2026-11-25_v34.14.md).

**P03 exit: NOT PASSED. Do not start P04.**
