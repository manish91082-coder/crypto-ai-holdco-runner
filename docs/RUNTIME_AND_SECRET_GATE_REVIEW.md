# Runtime and Secret-Storage Gate Review

**Review date:** 2026-11-23  
**Classification:** Public-safe engineering decision record  
**Decision:** No runtime or secret store is approved for operational use yet.

## 1. GitHub source repository versus GitHub-hosted execution

The dedicated public repository is approved as a source-control boundary. Its manual preflight workflow is intentionally inert and has not been dispatched.

GitHub's published subprocessor documentation includes Cloudflare as a content-delivery subprocessor. The page describes the Enterprise DPA scope, so it is not sufficient by itself to establish the exact routing/applicability for every personal/free-account request. However, because this project excludes Cloudflare from every layer, GitHub-hosted Actions execution remains on HOLD until that applicability is resolved in writing or the policy owner explicitly changes the constraint.

**Decision:** Keep GitHub as the approved source repository. Do not use GitHub-hosted Actions as the operating runtime at this gate.

Reference: https://docs.github.com/en/site-policy/privacy-policies/github-subprocessors

## 2. Neon Functions: candidate, not yet an approved secret vault

Current Neon documentation states that each Function deployment carries its own snapshot of user-defined environment variables. Variables can be supplied at deployment time, and branch environment variables can also be pulled locally with the Neon CLI.

That establishes how values are configured and made available to a Function. It does not, by itself, establish the additional assurances required here for custom secret values: encryption and key management, who can retrieve or inspect deployment values, retention/deletion of old deployment snapshots, log/trace exposure, auditability, and least-privilege access.

Neon's current Free plan documentation lists 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million Function invocations per project per month. Those are plan allowances, not evidence of this project's remaining headroom. The project must not assume the allowance is unused or that overage is impossible.

**Decision:** Neon Functions remains a conditional runtime candidate. Do not deploy a secret-bearing Function or add custom secret environment variables until the storage/access/retention questions and exact quota/cost controls are answered.

References:
- https://neon.com/docs/compute/functions/environment-variables
- https://neon.com/docs/introduction/plans
- https://neon.com/docs/introduction/usage-calculations

## 3. Bitwarden Secrets Manager Free: possible vault, not approved for production bootstrap

Current plan documentation lists a limited Free tier with machine accounts and secrets, but without the event/audit-log feature. Bitwarden machine-account access tokens are shown once at creation; the documentation says a revoked token prevents new authentication while an already-authenticated session may continue to access/decrypt for up to one hour.

For a high-assurance unattended system, the absence of native event logs and the bootstrap-token lifecycle require a separately reviewed control design. A third-party GitHub Action is not automatically trusted merely because it is published by the vendor; any use would require immutable revision pinning, release/binary integrity validation, and code review.

**Decision:** Do not create a machine account, issue a token, or store any production secret at this gate.

References:
- https://bitwarden.com/pricing/business/
- https://bitwarden.com/help/machine-accounts/
- https://bitwarden.com/help/machine-account-access-tokens/

## 4. Google Secret Manager: not selected under zero-bill constraints

Google documents an Always Free allowance for Secret Manager, but a Google Cloud billing account is required for projects using billable Google Cloud services, including where free-tier allowances are expected to cover usage. Requests beyond the free allowance may incur charges.

**Decision:** Do not create or link a billing account or provision Google Secret Manager under the current zero-upfront/no-bill authorization.

References:
- https://cloud.google.com/secret-manager/pricing
- https://cloud.google.com/billing/docs/how-to/modify-project

## 5. Required evidence before reopening the gate

A provider must answer, with documentation or written support confirmation:

1. Are custom Function environment values encrypted at rest, and how are encryption keys managed?
2. Which customer roles, provider operators, APIs, console surfaces, and deployment interfaces can retrieve or inspect the values?
3. How long are current and superseded deployment snapshots retained, and how can they be permanently removed?
4. Can values enter request logs, traces, crash reports, diagnostics, build output, or deployment metadata?
5. What access audit records are available, and can they be retained/exported on the Free plan?
6. Which subprocessors and network-delivery providers process the traffic, and can the required Cloudflare exclusion be confirmed?
7. What exact free-tier usage remains, how is it measured, and what hard stop prevents paid overage?

Until these are answered, the runtime remains inactive and the secret-provisioning gate remains BLOCKED.

## 6. Actions explicitly not taken

- No private key, API key, machine token, password, or wallet secret was generated or stored.
- No Neon Function or Trigger was created or deployed.
- No GitHub Actions workflow was dispatched.
- No cloud billing account or paid service was provisioned.
- No SQL, schema, role, ACL, Data API, or production runtime state was changed.
