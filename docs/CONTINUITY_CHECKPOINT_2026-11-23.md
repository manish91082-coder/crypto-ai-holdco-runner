# Crypto AI Holdings — Continuity v34.1 / P03.03 OCI KMS Candidate Research

**Checkpoint:** 23 November 2026 (Asia/Kolkata)  
**Audit lineage:** Formal runtime baseline remains Audit Round 38; v34.1 adds this response's OCI KMS/Instance Principals research and the repository/ledger updates.  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED; 24 phases / 119 tasks  
**Mission key:** `crypto-ai-holdco-master`  
**Active phase/task:** P03 / P03.03 Secret-Safe Runtime Assurance

## 1. Project identity and locked goal

This is only **Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem**. It is not ZAGRE / AI Agent-to-Agent Revenue Ecosystem, the Supabase ₹1,000/day mission, PHANTOMX, Ghost Hunter or a trading-bot project.

Ultimate success requires independently verified realised net revenue greater than zero from an unrelated buyer/sponsor after all direct costs, fees, gas, refunds and losses. Sustainable success requires repeated independent receipts and positive rolling net economics.

First implementation objective: complete the P01–P05 foundations; then build and test specialist agents, A2A/MCP, opportunity discovery, service offers and delivery; then separately gate payment/treasury/chain work; prove an external buyer receipt; prove repeatability and best-effort 24x7 recovery.

Master Constitution v2.0.0 and WBS v2.0.0 were not changed.

## 2. Canonical task and live-state read-back

- Task rows: 119 total; 15 COMPLETE, 1 BLOCKED, 103 PLANNED.
- P00: 4/4 COMPLETE.
- P01: 4 COMPLETE; P01.04 BLOCKED on an exact pilot's eligibility, KYC, AI-use, IP, fee, gas and payout evidence.
- P02: 5/5 COMPLETE; first-wave paths selected, no live buyer/pilot claimed.
- P03: P03.02 and P03.04 COMPLETE. P03.01, P03.03 and P03.05 have partial evidence but task rows are not COMPLETE.
- P04–P23: PLANNED.
- P03 phase exit gate remains unmet: verified cloud topology and quota limits, pause/recovery tests, no paid fallback.
- Canonical main branch: READY; Functions 0; Triggers 0; Data API disabled.
- Global quota governor: `PAUSE_DEGRADED`; `work_allowed=false`. Function active/waiting Capacity-Hours and storage remain UNKNOWN; invocation observation DEGRADED/stale.
- Agent instances, task runs, agent messages, opportunities, revenue events and scheduler invocations each remain zero in the latest read-only verification.
- Existing temporary Neon validation branch has a configured expiry of 23 Nov 2026 16:00 IST. Do not reuse, extend, delete or repurpose it.

No Neon live provisioning, schema/role/ACL/password/Data API/Function/Trigger/branch mutation, wallet action or financial activity occurred in this response.

## 3. New P03.03 research decision

A new public-safe engineering record was added:

`docs/P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.1.md`

The strongest new conditional candidate is OCI Vault HSM-backed RSA signing with OCI Instance Principals:

- OCI documents 150 Always Free Vault secrets and 20 HSM-protected key versions per tenancy, while private Vault is not in the free allowance.
- OCI documents RSA/ECDSA asymmetric signing and SHA-256 RSA PKCS#1 v1.5 signing. Oracle documents retrieval of RSA/ECDSA public keys in PEM format.
- OCI Instance Principals allow a compute instance to call permitted OCI APIs without placing a user API key/config file on the worker; a Dynamic Group and least-privilege policy are required.
- Proposed design retains the RSA private key inside the HSM; the VM requests short-lived signatures and publishes only the public key through a JWKS endpoint. RS256 is the first algorithm candidate because KMS exposes SHA-256 RSA PKCS#1 v1.5 signing and PostgREST documents RS256/JWKS support.
- This mapping is a technical rationale, not a compatibility proof. Exact Neon Data API acceptance, KMS byte semantics, key/JWKS construction and issuer enforcement need separate disposable-branch tests.

## 4. Critical OCI limitations and open questions

- The user's OCI account existence, home region, verification status, Always Free eligibility and A1 capacity are unknown.
- Compute must be deployed in the tenancy home region; free capacity may be unavailable.
- Always Free A1 compute can be reclaimed if, across a seven-day period, CPU p95, network and A1 memory utilization all remain below the provider's published thresholds. This is not a guaranteed 24x7 VM.
- Public-IP/network routing cost, egress route, compartment quotas, no-overage enforcement, data residency, SSH access exposure and account billing state need proof.
- Instance Principal permissions are usable by users with access to the VM; SSH access therefore requires strict control.
- Neon Data API's RS256 acceptance and `iss` enforcement are not yet proven.
- The public JWKS hosting route must itself avoid Cloudflare and paid service dependencies.
- No OCI account/resource, VM, Vault, HSM key, Dynamic Group or IAM policy has been created.

## 5. Other candidate decisions retained

- Neon Functions custom environment values are deployment snapshots; the reviewed docs still do not provide enough field-specific evidence for private-key encryption, privileged access, old-snapshot retention/deletion, logs and auditability. Not approved as a private-key vault.
- Neon Managed Better Auth OAuth is rejected for autonomous M2M token issuance because its official documentation says no `client_credentials` grant; tokens are issued on behalf of a signed-in user.
- Bitwarden Secrets Manager Free is not selected: native event/audit logs are not included, and bootstrap-token/session lifecycle does not solve the unresolved Neon environment bootstrap dependency.
- Google Secret Manager is not selected under the no-bill constraint because billing-account linkage and potential overage remain.
- GitHub remains public source control only; its manual workflow is undispatched and Actions run history is zero. GitHub-hosted Actions remains on HOLD; Cloudflare exclusion unchanged.

## 6. Branch-only test plan — no authorization yet

Before any OCI or Neon resource creation: verify account/home region/eligibility, exact zero-charge allowances, public-IP/network route, IAM/quota controls and data residency; separately obtain bounded authorization for a new expiring Neon child branch and cleanup.

If preconditions pass, test one HSM RSA signing key and one instance identity; verify signature independently; publish public-only JWKS; on the authorized test branch expose only `holdco_api` with one `SECURITY INVOKER` RPC; validate positive/negative JWT claims, bad signatures, role, raw-table access, unrelated RPCs, concurrency/idempotency/daily cap, kill switch and rotation. Verify cleanup; never promote to main automatically.

A passing test does not authorize production deployment, recurring triggers, source activation, agent assignment or financial actions.

## 7. Exact current resume point

- Active phase: P03 Cloud Runtime and Resilience.
- Active task: P03.03 Secret-Safe Runtime Assurance.
- Status: PARTIAL; task row remains PLANNED; P03 IN PROGRESS.
- Next single action: establish read-only evidence of OCI account/home-region/Always Free eligibility and network/cost controls, then decide whether the OCI signing candidate is admissible for a separately authorized disposable-branch test.
- Do not create an OCI account/resource, Vault key, dynamic group, IAM policy, Neon branch, Data API, Function, Trigger or secret at this stage.

**Mission state:** P03 IN PROGRESS; global quota governor PAUSED; production workloads off; no production agents; no verified revenue.
