# Roadmap and Gate Status

Last reviewed: 2026-11-23 (P03.03 OCI account evidence checklist v1.0)

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

Latest candidate review: [P03.03 Secret-Safe Runtime Assurance v1.2](P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.2.md).  
Latest account evidence procedure: [OCI Tenancy Read-Only Evidence Checklist v1.0](P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.0.md).

OCI Vault HSM-backed asymmetric RSA + Instance Principals remains a **conditional** key-protection candidate. The next gate is now an account-specific read-only evidence request; do not provision anything before it passes.

### Exact account evidence still missing

- Existing tenancy confirmation and immutable Home Region.
- Subscription/payment posture: Free-Trial, Always-Free-only, or Pay-As-You-Go.
- Home-Region A1 OCPU/memory limit, usage and available balance.
- HSM-protected key-version limit, usage and available balance.
- Existing VCN and existing Internet Gateway/NAT Gateway/Service Gateway inventory.
- Proof that external Neon egress will not need an unverified or billable component and that overage cannot silently occur.

The Console path is **Profile → Tenancy** for Home Region, and **Governance & Administration → Tenancy Management → Limits, Quotas and Usage** for service limit/usage/available values. The Console may omit some resource limits; absence of a row must remain UNKNOWN, not be treated as zero.

### Network and pricing guardrails

- The Always Free Compute allowance applies in the tenancy Home Region; A1 allowance is published as 1,500 OCPU-hours and 9,000 GB-hours per month (2 OCPUs / 12 GB for an Always Free tenancy).
- Oracle publishes 20 HSM-protected key versions and 150 Always Free Vault secrets per tenancy; Private Vault is excluded.
- First 10 TB/month outbound internet transfer is published free, but outbound usage beyond the free allowance is billable. No hard usage cutoff has been proven.
- A VCN and Service Gateway are documented as no-charge; Service Gateway reaches supported Oracle Services Network endpoints only, not the external Neon API.
- NAT Gateway / public egress configuration is not approved merely because a separate gateway price is not displayed. Exact account-specific no-bill routing and overage safeguards must be verified.
- Always Free A1 compute may be reclaimed after a 7-day low-utilization period; it is not guaranteed 24x7 capacity.
- Instance users with SSH access inherit the VM's IAM permissions. Instance Principals also include `compartment_inspect`.

## Runtime and secret gates

| Gate | Status | Required evidence |
|---|---|---|
| Dedicated public repository boundary | COMPLETE | Public visibility, default branch `main`, write permission and file read-back verified |
| Public-safe runner scaffold | COMMITTED; NOT DISPATCHED | Manual-only workflow; no secrets or infrastructure calls; GitHub Actions run history remains zero |
| GitHub-hosted Actions as runtime | HOLD | Resolve Cloudflare supplier-path applicability against the hard exclusion; no dispatch |
| Neon Functions runtime | CANDIDATE ONLY | Secret storage/access/retention assurance, exact quota headroom, allowed supplier path and deployment review |
| Neon Function env as private-key vault | BLOCKED | Snapshot exists but no sufficient field-specific assurance |
| Neon Managed Better Auth OAuth for M2M | REJECTED | No `client_credentials`; tokens are issued for signed-in users |
| Bitwarden Secrets Manager Free | NOT SELECTED | No Free-tier event/audit logs; bootstrap token lifecycle; Neon secret-bootstrap dependency unresolved |
| Google Secret Manager | NOT SELECTED | Billing-account linkage and potential overage |
| OCI Vault HSM RSA + Instance Principals | CONDITIONAL CANDIDATE | Existing tenancy, home region, free quota, no-bill egress, exact IAM scope and signature/Neon validation |
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

P03 remains open; P04–P23 are not started. Production agents, qualified buyer receipts and multi-day P22 stability evidence are absent. Do not claim production 24x7 or realised revenue until the evidence exists.

Unknown cost, security semantics, supplier path, account quota or eligibility must fail closed.
