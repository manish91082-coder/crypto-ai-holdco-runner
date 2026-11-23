# Roadmap and Gate Status

Last reviewed: 2026-11-23 (P03.03 IPv6 egress feasibility)

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

## P03.03 runtime and network decision

Latest report: [P03.03 Secret-Safe Runtime Assurance v1.3](P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.3.md).  
Latest account evidence procedure: [OCI Tenancy Read-Only Evidence Checklist v1.1](P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.1.md).

### Preferred hypotheses

- **Key protection:** OCI Vault HSM-protected RSA + Instance Principals remains the strongest conditional signing candidate. Private key non-exportability and KMS SHA-256 RSA PKCS#1 v1.5 are documented; live signature proof/account eligibility remain open.
- **Network:** OCI public GUA IPv6 + Internet Gateway is the preferred path to test before IPv4 NAT/public IPv4. It could avoid NAT/public IPv4, but is not approved/proven.
- **Neon:** AWS PostgreSQL endpoints support IPv6. Data API is a separate branch-specific HTTPS URL returned by its configuration API; official documentation reviewed does not establish that this hostname has AAAA/IPv6 HTTPS.
- **Security:** Remove IPv6 SSH TCP/22 from `::/0`; deny all inbound management. Restrict egress to the exact Neon Data API IPv6 destination set. Dynamic/unbounded AAAA or unrestrictable egress means NO-GO.
- **Billing:** APAC first 10 TB/month outbound transfer is listed free; overage can be billed. Account-specific GUA/IGW charges and no-overage controls are UNKNOWN. Do not infer zero-cost from missing pricing rows.

### Read-only account evidence required

- Existing tenancy, subscription category and Home Region.
- A1 and HSM quota limit/usage/available.
- Existing VCN IPv6 prefix type: Oracle GUA /56, BYOIPv6, ULA or none.
- Existing subnet public/private state, IPv6 /64 and route `::/0` to IGW.
- Existing Internet/NAT/Service Gateways.
- Existing IPv6 ingress/egress rules, especially SSH from `::/0` and unrestricted egress.
- Exact billing/no-overage treatment for GUA/IGW configuration.

See the updated checklist. No account signup, upgrade, payment, network/VM/key resource or quota increase at this gate.

## Runtime and secret gates

| Gate | Status | Required evidence |
|---|---|---|
| Public repository boundary | COMPLETE | Public repo and file read-back verified |
| Public-safe runner scaffold | COMMITTED; NOT DISPATCHED | Manual-only; no secrets; Actions run history zero |
| GitHub-hosted Actions as runtime | HOLD | Cloudflare supplier-path issue unresolved; no dispatch |
| Neon Functions runtime | CANDIDATE ONLY | Secret assurance, quota headroom, supplier path and deployment review |
| Neon Function env as private-key vault | BLOCKED | Snapshot exists; field-specific assurance insufficient |
| Neon Managed Better Auth OAuth for M2M | REJECTED | No `client_credentials`; signed-in user required |
| Bitwarden Free | NOT SELECTED | Audit/bootstrap limitations |
| Google Secret Manager | NOT SELECTED | Billing account/overage incompatible |
| OCI Vault HSM RSA + Instance Principals | CONDITIONAL | Account/Home Region/free quota/IAM/network eligibility/signature proof |
| OCI GUA IPv6 + IGW to Neon Data API | PREFERRED NETWORK HYPOTHESIS | Exact Data API AAAA/TLS, stable egress allowlist and billing evidence |
| IPv4 NAT/public IPv4 egress | SECONDARY ONLY | No-bill behavior must be proven if IPv6 fails |
| Secret provisioning | BLOCKED | No production key path approved |
| Disposable branch integration QA | NOT AUTHORIZED | Separate bounded authorization, cost evidence and cleanup |
| Production/recurring workloads | PAUSED | All runtime/security/quota/cost gates must pass |

## Live baseline

- Neon canonical main branch: READY.
- Main Functions: 0; Triggers: 0; Data API disabled.
- Global Quota Governor: `PAUSE_DEGRADED` / `work_allowed=false`.
- Production agents, task runs, messages, opportunities, revenue events and scheduler invocations: zero at latest read-only query.
- Existing temporary validation branch expiry remains 2026-11-23 16:00 IST. Do not reuse, extend, delete or repurpose.

## Delivery-time realism

P03 remains open; P04–P23 are not started. No production agents, buyer receipts or multi-day P22 stability evidence. Do not claim production 24x7 or realised revenue without proof.

Unknown cost, security semantics, supplier path, quota or eligibility fails closed.
