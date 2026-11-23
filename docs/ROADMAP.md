# Roadmap and Gate Status

Last reviewed: 2026-11-23 (P03.03 assurance v1.2)

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

Latest review: [P03.03 Secret-Safe Runtime Assurance v1.2](P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.2.md).

**OCI Vault HSM-backed asymmetric RSA + Instance Principals remains the strongest conditional key-protection candidate.** Its main official-documentation strengths are HSM non-exportability, KMS SHA-256 RSA PKCS#1 v1.5 signing with raw-message mode, Instance Principal identity rotation and OCI Audit attribution, plus published Always Free A1/Vault allowances.

Newly clarified risks and blockers:

- A1 Always Free compute may be reclaimed after a 7-day low-utilization period. It is not guaranteed 24x7 capacity.
- Instance users with SSH access inherit the VM's IAM permissions. Instance Principals also include non-revocable `compartment_inspect`.
- OCI Service Gateway reaches supported Oracle Services Network endpoints in the same region. It does not provide a private route to the external Neon API.
- The worker therefore needs a separately verified internet egress route to Neon. The first 10 TB/month of outbound transfer is documented free, but the complete public-IP/NAT/route/account configuration is not yet proven zero-bill.
- OCI tenancy existence, home region, free-tier eligibility, A1 capacity, quota headroom, IAM authority, egress route and no-overage controls are UNKNOWN.
- OCI KMS/RS256 semantics are now an official algorithm-level match, but an independent signature proof and Neon Data API branch test have not been run.
- No OCI resource/key/VM/IAM policy or Neon test resource has been provisioned.

## Runtime and secret gates

| Gate | Status | Required evidence |
|---|---|---|
| Dedicated public repository boundary | COMPLETE | Public visibility, default branch `main`, write permission and file read-back verified |
| Public-safe runner scaffold | COMMITTED; NOT DISPATCHED | Manual-only workflow; no secrets or infrastructure calls; GitHub Actions run history remains zero |
| GitHub-hosted Actions as runtime | HOLD | Resolve Cloudflare supplier-path applicability against the hard exclusion; no dispatch |
| Neon Functions runtime | CANDIDATE ONLY | Secret storage/access/retention assurance, exact quota headroom, allowed supplier path and deployment review |
| Neon Function env as private-key vault | BLOCKED | Snapshot exists but no sufficient field-specific assurance |
| Neon Managed Better Auth OAuth for M2M | REJECTED | Official Neon docs say no `client_credentials`; tokens are issued for signed-in users |
| Bitwarden Secrets Manager Free | NOT SELECTED | No Free-tier event/audit logs; bootstrap token lifecycle; Neon secret-bootstrap dependency unresolved |
| Google Secret Manager | NOT SELECTED | Billing-account linkage and potential overage |
| OCI Vault HSM RSA + Instance Principals | CONDITIONAL CANDIDATE | Account/home-region eligibility, HSM key creation limits, exact IAM scope, network egress no-bill route and signature/Neon validation |
| Secret provisioning method | BLOCKED | No production key path approved |
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
