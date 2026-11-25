# Roadmap and Gate Status

Last reviewed: 2026-11-23 (P03.03 v1.5 OCI Free-Tier spend guard and IPv6 egress controls)

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

Latest report: [P03.03 Secret-Safe Runtime Assurance v1.5](P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.5.md).  
Latest account evidence procedure: [OCI Tenancy Read-Only Evidence Checklist v1.2](P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.2.md).

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


## Current checkpoint overlay — Continuity v34.6 (23 November 2026)

This overlay supersedes prior P03.03 network/cost hypothesis wording above where it differs.

- Active phase/task remains P03 / P03.03. Task row is PLANNED; nested progress is PARTIAL. Counts remain 15 COMPLETE, 1 BLOCKED, 103 PLANNED of 119.
- OCI Budgets are soft limits; budget alerts are evaluated every 24 hours and are not hard spend stops. Do not count a budget alert as a zero-charge guarantee.
- Only a proven, non-upgraded standard Free Tier / Always-Free-only account with exact Always Free resources and verified quota can be a conditional zero-charge candidate. A Pay-As-You-Go or unknown account state is NO-GO under the current policy. Standard Free Trial paid resources are reclaimed if not upgraded; special trial offers may suspend instead.
- OCI IPv6 Resolver support and IPv6 CIDR security rules make constrained egress technically plausible, but the exact Neon Data API AAAA/TLS and stable allowlist are UNKNOWN.
- Neon Data API is not protected by Neon IP Allow / Private Networking. Use strict worker-side egress, TLS hostname verification, JWT, and narrow PostgreSQL GRANT/RLS; this remains a public HTTPS service.
- Neon Function env variables are deployment snapshots. Field-specific assurance for holding private signing keys remains insufficient; not approved as a private-key vault.
- No OCI account evidence supplied; no resource or branch QA authorized; no provisioning or secret creation.
- Quota Governor remains PAUSE_DEGRADED / work_allowed=false. Main Functions 0, Triggers 0, Data API disabled. Production workloads remain paused.

Next action: obtain redacted, read-only OCI account type/upgrade state, Home Region, A1/HSM quota, existing VCN/IPv6/IGW/security-rule, resolver, and cost/usage evidence using checklist v1.2.

## P03.03 Alternate runtime assessment v1.0 / Continuity v34.7 (23 Nov 2026)

- Trigger.dev Cloud Free is a conditional managed-task candidate for a bounded synthetic-only pilot, **not** a production runtime. Published Free: $0/month, no card, $5 monthly credits, 20 concurrent runs, 10 schedules and one-day logs/query history. Its task code runs on managed workers with no fixed task timeout, but Free has no 99% uptime undertaking and the $5 credit pool excludes external model/API costs.
- Material security caution: vendor-reported 1 Nov 2026 incident affected 0.66% of customer environments and exposed root API keys/environment variables in some environments; account-specific impact remains unknown. No credentials, DB passwords, external API tokens, customer data or private keys in any initial synthetic test.
- Netlify generic compute is not approved for this swarm under its 4 Nov 2026 AUP restriction; Inngest is orchestration over customer-hosted workers; Deno beta has no uptime guarantee; Val Town is winding down; Pipedream Free is development-only; QStash is queue-only.
- OCI account/subscription/quotas/VCN/IPv6/billing evidence is still UNKNOWN. OCI remains the first conditional persistent-VM hypothesis. Trigger.dev account and non-local/non-GitHub deployment path are also UNKNOWN.
- Main Neon remains Functions 0 / Triggers 0 / Data API disabled; Quota Governor PAUSE_DEGRADED / work_allowed=false; production agents and recurring workloads remain paused. No deployment or account was created.
- Active task remains P03.03, WBS PLANNED / nested PARTIAL. Counts remain 15 COMPLETE, 1 BLOCKED, 103 PLANNED of 119.
- Canonical continuity: `docs/CONTINUITY_CHECKPOINT_2026-11-23.md` (v34.7). Assessment: `docs/P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.0.md`.
- Next single action: obtain redacted read-only OCI subscription/upgrade status, Home Region, A1/HSM quotas, existing VCN/IPv6/IGW/effective egress/DNS and visible cost evidence using checklist v1.2. Do not provision or cross into P04.


## P03.03 Alternate runtime eligibility v1.1 / Continuity v34.8 (23 Nov 2026)

- OCI account/subscription/quotas/VCN/IPv6/effective egress/billing evidence remains UNKNOWN. OCI Always Free A1 + GUA IPv6/IGW remains the first conditional persistent-runtime hypothesis, not approved.
- Trigger.dev Cloud Free remains a conditional synthetic-only pilot candidate, not a production runtime; $5/month compute credits, 20 concurrent runs, 10 schedules, one-day logs, no Free SLA, recent vendor-reported 1 Nov credential incident, and unknown non-local/non-GitHub deployment path remain blockers.
- Northflank Sandbox has always-on compute and small free resources, but Northflank requires a payment method before creating resources and says Sandbox must not be used for production. Reject.
- Modal Starter has $30/month compute credits and limited scheduled functions. Modal Workspace budget is documented as a hard outer cap, but exact fresh-Starter zero-exposure cap/credit interaction, no-card eligibility, and compliant deployment route are UNKNOWN. Modal model APIs are separately billed; no deployment/account test performed. Conditional research only, not approved.
- Fly.io Free requires a card and transitions to Pay-As-You-Go after its $5 monthly allowance. Reject.
- Hugging Face Spaces free static hosting is distinct from compute-backed Gradio/Docker Spaces, which require paid plans; free hardware sleeps after inactivity. Not a worker runtime.
- No reviewed provider meets all locked production requirements for zero-upfront, no-card, no-paid-overage, hard no-bill boundary, durable worker, adequate observability/security and a verified no-local/no-GitHub operational deployment route.
- Neon main remains Functions 0 / Triggers 0 / Data API disabled. Quota Governor PAUSE_DEGRADED / work_allowed=false. P03.03 row remains PLANNED / nested PARTIAL; counts remain 15 COMPLETE, 1 BLOCKED, 103 PLANNED of 119.
- Assessment: `docs/P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.1.md`. Latest continuity: `docs/CONTINUITY_CHECKPOINT_2026-11-23.md` (v34.8).
- Next single action: obtain redacted read-only OCI subscription/upgrade status, Home Region, A1/HSM quotas, existing VCN/IPv6/IGW/effective egress/DNS and visible cost evidence using checklist v1.2. Do not provision, add a payment method or cross into P04.


## 25 November 2026 — current execution overlay

- Active WBS phase remains P03 — Cloud runtime and resilience; P03 is not complete.
- Main database is READY; Functions 0, Triggers 0, Data API disabled; Quota Governor remains PAUSE_DEGRADED / work_allowed=false.
- Production agents, live opportunity scanning, and verified revenue receipts are not active.
- The operational task queue is not the canonical 119-task WBS register. Historical task counts must be identified by checkpoint/version, and the P01 phase-summary/task-count discrepancy must be reconciled before status changes.
- One response must exhaust independently executable work in one active phase. A phase can be marked COMPLETE only when all tasks and its exit gate pass; external dependencies remain blockers and do not justify skipping phases.
- Latest dated checkpoint: `docs/CONTINUITY_CHECKPOINT_2026-11-25.md`. Execution directive: `docs/EXECUTION_MODE_ADDENDUM_2026-11-25.md`.

## 25 November 2026 — P03 provider evidence refresh

- Neon Free published limits have been rechecked against the official plans documentation; database storage and public network transfer observations have fresh read-backs and pass the project safe ceilings.
- Function active/waiting capacity observations remain unknown and monthly invocation evidence remains degraded, so the Quota Governor remains paused.
- OCI Always Free is a conditional candidate only; the account's Home Region, upgrade state, A1 quota, network topology, billing and secret-safe deployment are not verified. Budgets are soft alerts, not hard spend stops.
- P03 remains IN_PROGRESS; do not begin P04. See `docs/P03_OFFICIAL_PROVIDER_EVIDENCE_2026-11-25.md` and `docs/CONTINUITY_CHECKPOINT_2026-11-25_v34.10.md`.