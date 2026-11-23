# Crypto AI Holdings — Continuity v34.6 / P03.03 OCI Free-Tier Spend Guard

**Checkpoint:** 23 November 2026 (Asia/Kolkata)  
**Project:** Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem  
**Mission key:** `crypto-ai-holdco-master`  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED; 24 phases / 119 tasks  
**Active phase/task:** P03 Cloud Runtime and Resilience / P03.03 Secret-Safe Runtime Assurance  
**Review lineage:** Audit Round 38 remains latest formal runtime/deployment audit; v1.5 is official-source and read-only research only.

## 1. Mission objective and immutable boundaries

Ultimate success requires independently verified realised net revenue greater than zero from an unrelated external buyer/sponsor after direct costs, data/compute/provider fees, gas, facilitator fees, refunds and losses. Sustainable success requires repeated independent receipts and positive rolling net economics.

First implementation objective remains completion of the P01–P05 legal, commercial, runtime, evidence and zero-trust foundations. Only after those gates may the specialist agent workforce, A2A/MCP fabric, opportunity discovery, service catalogue and work factory be activated. Payments, treasury, and on-chain execution retain their own separate gates.

Constraints unchanged: zero upfront owner capital; no owner-funded gas; no paid fallback or automatic upgrade; Cloudflare excluded; no laptop/local server/WSL/self-hosted runtime dependency; GitHub optional public source control only; unknown cost/quota/region/eligibility/security fails closed; tax deferred; no legacy crypto/trading/flash-loan repository reuse; no secrets in chat/files/SQL/logs; no wallet signing, transfers, live trading, staking, MEV or live flash-loan execution in this pre-production stage.

## 2. Canonical identity and locked checksums

- Neon project: `crypto-autonomous-holdco-memory` / `little-violet-66887398`.
- Region/platform: `aws-ap-southeast-1` / AWS.
- Database/schema: `crypto_holdco` / `holdco`.
- Canonical main branch: `br-calm-block-a1fbdnnj`.
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`.
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`.
- P03.03 report v1.5 SHA-256: `ad045f081a1eedbfd97bbc4bd6e64c1dac08f63292c4a8c11daeec05018607e1`.
- OCI checklist v1.2 SHA-256: `f80f954a07d9b4263338e02f5aac95696ce7dfa3261629b416126a40dc0dfd3b`.

Master Constitution and WBS remain LOCKED and unchanged.

## 3. Cold-start live-state read-back

- Neon account/project read-back remains Free (`free_v3`), project AWS Singapore.
- Main `br-calm-block-a1fbdnnj`: READY; Functions 0; Triggers 0; Data API disabled.
- Legacy validation branch `br-round-block-a16i9agr`: READY at latest read-back with existing `n24smoke` completed, 0 Triggers, Data API disabled; configured expiry `2026-11-23T10:30:00Z` (16:00 IST). Do not reuse, extend, delete or repurpose; let expiry policy operate.
- Task table: 119 rows; COMPLETE 15, BLOCKED 1, PLANNED 103.
- P00 4/4 COMPLETE; P01 baseline complete with P01.04 blocked on pilot-specific evidence; P02 5/5 COMPLETE; P03.02/P03.04 COMPLETE; P03.01/P03.03/P03.05 remain partial; P04–P23 planned.
- P03.03 row remains `PLANNED`; nested progress remains `PARTIAL`.
- Quota Governor `PAUSE_DEGRADED`, `work_allowed=false`. Function active Capacity-Hours, waiting Capacity-Hours and storage remain UNKNOWN; monthly invocation observation 11 remains stale lower-bound / DEGRADED.
- Agent instances, task runs, agent messages, opportunities, revenue events and scheduler invocations: 0.
- OCI account, Home Region, quotas, VCN, GUA, IGW, egress rules and billing state: UNKNOWN; no OCI tenancy evidence supplied.

## 4. P03.03 v1.5 research findings

### OCI account and spend guard

- Oracle describes OCI Budgets as soft spending limits; budget alerts are evaluated periodically every 24 hours. They are notifications, not a hard spend cap.
- Oracle states that Free Tier includes unlimited-duration Always Free services and a time-limited $300 / 30-day Free Trial. Its FAQ says identity verification may place a temporary card authorization hold; Oracle states that the card is not actually charged unless the account is upgraded.
- For a standard Free Trial, Always Free resources remain after trial expiry; paid trial resources are reclaimed if the account is not upgraded. Some special Free Trial offers may suspend rather than continue as Always Free.
- Oracle publishes 20 HSM-protected master-key versions and 150 Always Free Vault secrets per tenancy; Private Vaults are excluded from the Always Free allocation.
- Oracle says VCN creation/use is free and public internet egress is free for the first 10 TB/month globally; other OCI services and egress beyond the allowance may be chargeable.
- Consequence: account type must be proven. A standard Always-Free-only / non-upgraded account is a conditional no-charge candidate within Always Free quotas. A Pay-As-You-Go/paid account is NO-GO under the current zero-spend constraint unless every billable path is independently prevented. Budget alerts do not solve this.

### OCI IPv6 network and controls

- Oracle documents an Oracle-assigned GUA `/56`, public IPv6-enabled `/64` subnets, Internet Gateway routing, and an Internet Resolver that supports resolution of external IPv6 hostnames.
- IPv6 security rules can restrict destination CIDR ranges. This is useful only if the exact Neon Data API AAAA set is stable and bounded.
- The IPv6 default security-list examples include broad SSH ingress and broad egress patterns. No worker may inherit public SSH from `::/0` or unrestricted egress.
- A1 idleness reclamation and Home Region availability remain reliability limitations; no guaranteed 24x7 runtime is established.

### Neon Data API and secret-storage boundary

- Neon Data API is a branch-specific HTTPS endpoint using a compute-specific `apirest` hostname. AWS PostgreSQL IPv6 support does not prove Data API AAAA or IPv6 HTTPS.
- Neon explicitly states Data API is not protected by IP Allow and is unsupported with IP Allow or Private Networking. Treat it as publicly reachable; authorization must rely on signed JWTs and narrowly scoped PostgreSQL GRANT/RLS, with OCI worker-side destination egress and TLS checks.
- Neon Function environment variables are per-deployment snapshots; `NEON_DATA_API_URL` is branch-scoped when Data API exists. Reviewed docs still do not establish the field-specific encryption/access/retention/audit assurances required to treat these snapshots as a private signing-key vault.
- Data API exact AAAA/TTL/TLS and address stability remain UNKNOWN. No exact API URL was retrieved and no probe was run.

## 5. Network and spend decision

Preferred conditional hypothesis remains OCI public-GUA IPv6 + Internet Gateway → Neon Data API HTTPS. It remains NOT VERIFIED and NOT PROVISIONED. No IPv4/NAT fallback is authorized. If account status is Pay-As-You-Go, if the exact resources are not Always Free, if no-charge cannot be established, or if a hard spend boundary is required but absent, NO-GO. If AAAA is missing/unstable or strict egress cannot be maintained, NO-GO.

## 6. Current documents and repository synchronization

- Library: `P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.5.md`.
- Library: `P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.2.md`.
- Library: `CONTINUITY_v34.6.md`.
- Public repository `manish91082-coder/crypto-ai-holdco-runner` is being advanced to v34.6 / v1.5 as public-safe process documentation only. It is not an operational runtime dependency or authority to dispatch workflows.

## 7. No-change confirmation

No OCI resource/account/VM/VCN/prefix/route/gateway/security rule/HSM key/IAM policy was created or changed. No Neon branch, Data API, Function, Trigger, role, credential, secret or signing key was created or changed. No GitHub workflow was dispatched. No wallet, transaction, payment, signing, withdrawal, or financial activity occurred. No task or phase was marked complete.

## 8. Exact resume point

- Active phase: P03 Cloud Runtime and Resilience.
- Active task: P03.03 Secret-Safe Runtime Assurance.
- Task row: PLANNED; nested progress: PARTIAL.
- Quota Governor: PAUSE_DEGRADED / work_allowed=false.
- Next action: obtain redacted read-only OCI subscription state, Home Region, A1/HSM quotas, existing VCN/IPv6/IGW/security rules, DNS resolver and visible cost/usage evidence using checklist v1.2.
- If there is no existing eligible account, continue same-phase research into non-paid cloud-only alternatives; do not create an account or cross into P04.

**Mission state:** P03 IN PROGRESS; production recurring workloads PAUSED; no approved 24x7 runtime; no production agents; no independently verified revenue receipt.