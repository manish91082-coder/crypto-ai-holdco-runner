# Crypto AI Holdings - P03 Phase Execution Report v5.12
Observed: 28-Nov-2026
Mission: crypto-ai-holdco-master
Phase: P03_CLOUD_RUNTIME_AND_RESILIENCE
Active task: CRYPTO-HOLDCO-V2-P03-03

## Executive decision
P03.03 remains ACTIVE / PARTIAL. The Google Apps Script to Neon Function OIDC scheduler is a conditional source-only candidate, not WBS-accepted, deployed or armed. An internal readiness review v1.0 finds material gates open: independent acceptance, owner Google identity/audience, account type/quota, execution region, replay-token freshness, actual SQL migration execution, deployment and P03.05 quota/recovery controls.

## Runtime / current deployment
- Neon Function cryptoaicore deployment #17 remains active, Node.js24, Singapore, isolated branch br-lively-flower-a15zb6ar.
- Active source SHA-256 d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- DB identity crypto_holdco_function.
- Governor PAUSE_DEGRADED / work_allowed=false.
- Existing Neon trigger trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, POST /internal/dispatch, disabled, next_run_at=null.
- No Apps Script project, trigger, audience or subject allowlist values created. No Function #18.

## Previous application-token proof remains valid
- CI #121 run 46046289848, 44/44 tests, 17 OIDC claims.
- Synthetic app bearer metrics:read returned GET /v1/metrics HTTP 200, wrong-scope GET /v1/agents HTTP 401 and was revoked; provider metadata confirmed disabled/revoked.
- This is not the owner-operator-pilot token.
- Owner token remains enabled, expires 2026-12-27T09:44:32.105Z, last_used_at 2026-11-27T14:55:00.737Z. It is untested via positive HTTP, not rotated; consumer census and protected delivery remain open.

## Google Apps Script source candidate v1.3
- Candidate spec: docs/P03.03_GOOGLE_APPS_SCRIPT_FUNCTION_OIDC_SCHEDULER_v1.3.md.
- Function OIDC path avoids Neon Data API and new PostgreSQL roles. It verifies Google signature/JWKS, issuer, exact audience and SHA-256(subject hash), then uses existing crypto_holdco_function. Manifest asks only openid and script.external_request.
- Candidate helper corrections: JWKS max-age parsing now honors Cache-Control; preflight and verifier use the correct printable-ASCII subject validation.
- CI #143 https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46099689692: SUCCESS, 64/64 tests, 0 failures. Deterministic patched Function candidate source SHA-256 aa1224dca47b2b670bd006a2935befcfa7f718bdce89a77b344f107839ff908d. Live Neon smoke skipped; this is source/build/unit proof only.
- Active Function remains #17 with source hash above. Candidate not deployed.
- Replay migration db/migrations/pilot/20261128_google_scheduler_replay_guard.sql and SQL test db/tests/pilot/verify_google_scheduler_replay_guard.sql remain source-only; CI #138 statically checked them, 62/62 tests. The SQL was not applied or executed.

## WBS acceptance review
- Review document: docs/P03.03_GOOGLE_SCHEDULER_WBS_ACCEPTANCE_REVIEW_v1.0.md.
- It maps the candidate to P03.03's locked runtime evaluation gate and P03 phase exit.
- Decision: NOT ACCEPTED FOR DEPLOYMENT. This is an internal readiness review, not the WBS-required independent acceptance.
- Open: owner account type/authority, exact audience and subject hash, Apps Script execution region, account-specific quota, trigger behavior, repeated ID-token freshness, actual replay SQL, deployment, P03.05 budget/freshness/checkpoint/recovery, owner token HTTP/census/protected delivery and independent review.

## Resource envelope
- Neon active time: 113,587/129,600 sec = 87.64%, remaining 16,013.
- Compute: 28,717/36,000 sec = 79.77%, remaining 7,283.
- Transfer: 31,038,118/1,000,000,000 bytes = 3.10%.
- Window ends 2026-12-01T00:00:00Z.
- Functions MTD invocation/active/waiting Capacity-Hours remain UNKNOWN/degraded; 111 invocations is only a lower-bound log metric.
- Keep candidate unarmed; do not deploy #18 or apply replay SQL in the current window.

## Required next actions
1. Obtain separate independent reviewer acceptance against locked P03.03/P03 exit criteria.
2. Obtain owner-created Apps Script identity preflight; preserve only issuer/audience/SHA-256(sub)/iat/exp metadata.
3. Verify that successive trigger executions receive unique token hashes; otherwise change replay semantics before deployment.
4. Verify owner account type, remaining Google quota and project access.
5. After Neon quota reset, measure live free-plan headroom.
6. Complete P03.05 controls in sequence: daily budgets, account-specific counters, 80% fail-closed stop, freshness, durable checkpoint/recovery and pause/resume tests.
7. Complete owner-operator-pilot actual-token HTTP test, full manual/external consumer census and protected one-time delivery before rotation.
8. Only after the gates: isolated replay SQL application/test, deployment #18, Google positive/negative HTTP tests, later separate trigger installation approval.

## WBS state
P03.01 COMPLETE with known Functions-meter limitation; P03.02/P03.04 COMPLETE; P03.03 ACTIVE/PARTIAL; P03.05 PLANNED/NOT ACTIVE. P03 exit NOT PASSED; P04 NOT STARTED. Counts 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED. Locked Constitution/WBS unchanged. No financial activity; realised net revenue 0.
