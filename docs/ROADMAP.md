# Roadmap and Gate Status

Last reviewed: 2026-11-23 (P03.03 research v1.1)

## Mission control

- Locked Master Constitution: v2.0.0.
- Locked WBS: v2.0.0, 24 phases / 119 tasks.
- Current active phase: P03 — Cloud runtime and resilience.
- One active WBS phase per work response. See `docs/EXECUTION_CONTROL_PROTOCOL.md`.
- Never mark a phase complete unless every numbered task, phase exit gate, tests, independent review and continuity update pass.

## Task-state read-back

| Scope | Verified status |
|---|---|
| Total task rows | 119 |
| COMPLETE | 15 |
| BLOCKED | 1 |
| PLANNED | 103 |
| P00 | 4/4 COMPLETE |
| P01 | 4 COMPLETE; P01.04 BLOCKED on pilot-specific eligibility |
| P02 | 5/5 COMPLETE |
| P03 | P03.02 and P03.04 COMPLETE; P03.01, P03.03, P03.05 retain partial evidence but are not COMPLETE |
| P04–P23 | PLANNED |

## P03.03 secret-safe runtime decision

The newest candidate is **OCI Vault HSM-backed asymmetric signing + Instance Principals**, documented in [P03.03 Secret-Safe Runtime Assurance v1.1](P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.1.md).

- OCI documents Always Free HSM key-version and secret allowances, RSA/ECDSA signing and Instance Principals. This is a provider-documented candidate, not proof of this account's eligibility.
- Candidate design keeps the private signing key inside OCI KMS/HSM and uses an instance principal to request short-lived RS256 signing; the public key alone is published in JWKS.
- PostgREST documents RS256 support, but exact Neon Data API acceptance and OCI KMS signature byte semantics remain untested.
- OCI's Always Free A1 VM can be reclaimed after seven days under defined low-CPU/network/memory thresholds; do not describe this as guaranteed 24x7 runtime.
- Existing OCI account, home region, capacity, public-IP/network cost, compartment quotas and no-overage posture are UNKNOWN.
- No OCI account/resource/key/policy/VM was created. No Neon branch or Data API was provisioned.

## Runtime and secret gates

| Gate | Status | Required evidence |
|---|---|---|
| Dedicated public repository boundary | COMPLETE | Public visibility, default branch `main`, write permission and file read-back verified |
| Public-safe runner scaffold | COMMITTED; NOT DISPATCHED | Manual-only workflow; no secrets or infrastructure calls; GitHub Actions run history remains zero |
| GitHub-hosted Actions as runtime | HOLD | Resolve Cloudflare supplier-path applicability against the hard exclusion; no dispatch |
| Neon Functions runtime | CANDIDATE ONLY | Secret storage/access/retention assurance, exact quota headroom, allowed supplier path and deployment review |
| Neon Functions env as private-key vault | BLOCKED | Snapshot exists but no sufficient field-specific assurance |
| Neon Managed Better Auth OAuth for M2M | REJECTED | Official Neon docs say no `client_credentials`; tokens are issued for signed-in users |
| Bitwarden Secrets Manager Free | NOT SELECTED | No Free-tier event/audit logs; bootstrap token session lifecycle; Neon secret-bootstrap dependency unresolved |
| Google Secret Manager | NOT SELECTED | Free allowance still tied to billing account and possible overage |
| OCI Vault + Instance Principals | CONDITIONAL CANDIDATE | Account/home-region eligibility, free resources, KMS signing semantics, no-overage network route and IAM scope must be verified |
| Secret provisioning method | BLOCKED | No approved production key path yet |
| Exact deployment configuration review | NOT STARTED | Full target config and branch-bound dry-run plan |
| Disposable branch integration QA | NOT AUTHORIZED | Separate bounded approval, cost evidence and cleanup plan |
| Live Data API/JWKS/SQL validation | NOT STARTED | Branch-only approval and complete negative security tests |
| Production/recurring workloads | PAUSED | Runtime, secret, security, quota, cost and operational gates must all pass |

## Live baseline

- Canonical main branch read-back: READY.
- Main Functions: 0.
- Main Triggers: 0.
- Data API: disabled.
- Global quota governor: `PAUSE_DEGRADED` / `work_allowed=false`.
- Function active/waiting Capacity-Hours and storage remain UNKNOWN; invocation observation is DEGRADED/stale.
- Production agent instances, task runs, agent messages, opportunities, revenue events and scheduler invocations: zero at the latest read-only query.
- Temporary validation branch expiry is configured for 2026-11-23 16:00 IST. Do not reuse, extend, delete or repurpose it.

## Delivery-time realism

The full production agent swarm cannot be certified by the evening of 2026-11-23 from this verified state. P03 remains open, P04–P23 are not started, production agents and qualified buyer receipts are absent, and P22 requires multi-day observed stability. Same-day objective is an audited P03 go/no-go checkpoint, not an unsupported 24x7 production claim.

Unknown cost, security semantics, supplier path, account quota or eligibility must fail closed.
