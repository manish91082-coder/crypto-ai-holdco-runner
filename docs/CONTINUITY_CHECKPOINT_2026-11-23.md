# Crypto AI Holdings — Continuity v34.2 / P03.03 OCI HSM and Network Assurance

**Checkpoint:** 23 November 2026 (Asia/Kolkata)  
**Formal runtime audit lineage:** Audit Round 38 remains the latest formal runtime audit; v34.2 records the latest official-source verification and cross-chat continuation state.  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED; 24 phases / 119 tasks  
**Mission key:** `crypto-ai-holdco-master`  
**Active phase/task:** P03 / P03.03 Secret-Safe Runtime Assurance

## 1. Project identity and locked goal

This is only **Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem**. It is separate from ZAGRE / AI Agent-to-Agent Revenue Ecosystem, the Supabase ₹1,000/day mission, PHANTOMX, Ghost Hunter and trading bots.

Ultimate success requires independently verified realised net revenue greater than zero from an unrelated buyer/sponsor after direct costs, fees, gas, refunds and losses. Sustainable success requires repeated independent receipts and positive rolling net economics.

First implementation objective: complete the P01–P05 foundations; then build and test specialist agents, A2A/MCP, opportunity discovery, service offers and delivery; separately gate payments/treasury/chain work; prove an external buyer receipt, repeatability and best-effort recovery.

Master Constitution v2.0.0 and WBS v2.0.0 remain unchanged.

## 2. Canonical task and live-state read-back

- Task rows: 119 total; 15 COMPLETE, 1 BLOCKED, 103 PLANNED.
- P00: 4/4 COMPLETE.
- P01: 4 COMPLETE; P01.04 BLOCKED on exact pilot eligibility, KYC, AI-use, IP, fee, gas and payout evidence.
- P02: 5/5 COMPLETE; first-wave paths selected, no live buyer/pilot claimed.
- P03: P03.02 and P03.04 COMPLETE. P03.01, P03.03 and P03.05 have partial evidence but task rows are not COMPLETE.
- P04–P23: PLANNED.
- P03 exit gate remains unmet: verified cloud topology and quota limits, pause/recovery tests, no paid fallback.
- Canonical Neon main branch: READY; Functions 0; Triggers 0; Data API disabled.
- Global Quota Governor: `PAUSE_DEGRADED`; `work_allowed=false`. Function active/waiting Capacity-Hours and storage UNKNOWN; monthly invocation observation DEGRADED/stale.
- Production agent instances, task runs, agent messages, opportunities, scheduler invocations and revenue events each returned zero in the latest read-only verification.
- Existing temporary validation branch has a configured expiry of 23 Nov 2026 16:00 IST. Do not reuse, extend, delete or repurpose it.

No Neon or OCI resource provisioning, branch/role/ACL/schema/credential/Data API/Function/Trigger change, workflow dispatch, wallet action or financial activity occurred.

## 3. Official-source P03.03 v1.2 findings

New public-safe report:
`docs/P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.2.md`

The OCI KMS candidate is strengthened by official documentation:

- An RSA/ECDSA asymmetric key with HSM protection stores its private key in the HSM and does not allow its export; the public key can be retrieved. The documented HSM assurance is FIPS 140-2 Security Level 3.
- OCI KMS supports RSA SHA-256 PKCS#1 v1.5 signing. Its Sign operation defaults to RAW message mode, matching the byte-level RS256 construction at the algorithm level. End-to-end signature proof is still pending.
- Oracle documents 1,500 OCPU-hours plus 9,000 GB-hours per month for A1, 20 HSM-protected key versions and 150 Always Free Vault secrets per tenancy; private Vaults are excluded. These are documented allowances, not account-specific remaining quota proof.
- OCI Instance Principals use rotating instance identity certificates; Dynamic Group membership and IAM policy grant permissions without storing a user API key on the VM. OCI Audit records instance OCID as the principal identity.
- Users with SSH access inherit the instance's IAM privileges. Instance Principals also include `compartment_inspect`, which Oracle says cannot be revoked.
- OCI may reclaim A1 instances after seven days if CPU p95, network and A1 memory utilization all remain below 20%. Never generate fake traffic to defeat reclamation.
- OCI Service Gateway permits private access only to supported Oracle services in the same region. It does not provide private connectivity to Neon, which is an external API. A separate internet egress path is required.
- Oracle documents first 10 TB/month outbound internet transfer as free. The complete VM public-IP/NAT/Internet Gateway/route configuration, eligibility and no-overage control are not yet verified.
- Neon Data API JWT role claim selects the PostgreSQL role; `sub` identifies the subject. PostgREST documents RS256/JWKS, but the exact Neon Data API acceptance, issuer enforcement and branch-specific role permissions remain untested.
- Neon Managed Better Auth OAuth has no `client_credentials` grant and is rejected for unattended machine-to-machine bootstrap.

## 4. Candidate decision

**OCI Vault HSM-protected RSA + Instance Principals** remains the strongest conditional signing/key-protection candidate. The signing design is not approved for production or provisioning.

Neon Function environment snapshots are not approved as the private signing-key vault because required field-specific protection/access/retention/logging assurances remain unproven. Bitwarden Free, Google Secret Manager and GitHub-hosted Actions retain their prior rejected/not-selected/hold dispositions.

## 5. Current open gates

- OCI account existence, tenancy home region, eligibility and exact Always Free capacity: UNKNOWN.
- HSM RSA key allocation and permitted IAM scope: not provisioned.
- SSH/instance access boundary: must be defined before granting the VM HSM signing authority.
- Internet egress route to the Neon API and all associated networking charges: UNKNOWN.
- Neon Data API RS256 acceptance, `iss` validation, authenticator membership and role switch: NOT TESTED.
- Public-only JWKS publishing route without Cloudflare or paid runtime: DESIGN ONLY.
- Neon Function/storage quota remains UNKNOWN/DEGRADED; governor remains PAUSED.

## 6. Next single action

Obtain **read-only evidence of the existing OCI tenancy**: account status, tenancy home region, Free/Always Free eligibility and current A1/Vault quotas. Do not create a new account or any resources. The exact OCI account and region are not available to the current connected tools, so a user-provided redacted Console screenshot or read-only account evidence is required before a tenancy-specific decision.

After account eligibility is established, the next internal check remains network egress cost and policy. Only if all zero-cost/security conditions pass should a separately authorized short-lived Neon child-branch interoperability test be proposed.

## 7. Exact resume point

- Active phase: P03 Cloud Runtime and Resilience.
- Active task: P03.03 Secret-Safe Runtime Assurance.
- Task row status remains PLANNED; nested progress is PARTIAL.
- Production work remains paused.
- Do not create OCI account/resources, VM, HSM key, Vault, Secret, Dynamic Group, IAM policy, network gateway, public IP, Neon branch, Data API, Function, Trigger or secret until its explicit gate and separate bounded authorization pass.
- Do not move to P04 or another phase.

**Mission state:** P03 IN PROGRESS; Quota Governor PAUSED; no production agents, no active opportunity sources, no verified revenue.
