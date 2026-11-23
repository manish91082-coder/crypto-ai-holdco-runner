# Roadmap and Gate Status

Last reviewed: 2026-11-23

| Gate | Status | Required evidence |
|---|---|---|
| Dedicated public repository boundary | COMPLETE | Public visibility, default branch `main`, and write permission verified |
| Public-safe repository scaffold | COMPLETE | Seven baseline files plus runtime/secret gate review committed and read back |
| GitHub-hosted Actions execution | HOLD — NOT DISPATCHED | Resolve Cloudflare supplier-path applicability against the project's hard exclusion; do not use this runner pending a written policy decision |
| Neon Functions runtime | CANDIDATE ONLY | Confirm runtime/vendor path, deployment-environment secret protections, retention, privileged access, logs exposure, and quota headroom before any deployment |
| Secret provisioning method | BLOCKED | Written provider-specific assurance plus least-privilege, lifecycle, revocation, and audit evidence; alternatively an independently approved zero-cost vault |
| Exact deployment configuration review | NOT STARTED | Full target configuration review and branch-bound dry-run plan; no deployment authorization implied |
| Disposable branch integration QA | NOT AUTHORIZED | Separate bounded authorization, known cost, and complete cleanup plan |
| Live Data API/JWKS/SQL validation | NOT STARTED | Branch-only test approval, exact schema/role policy, and negative security tests |
| Production/recurring workloads | PAUSED | All runtime, secret, security, quota, cost, and operational gates passed |

## Current read-only baseline

The canonical database branch was checked read-only on 2026-11-23: it was ready, with zero Functions and zero Triggers. No deployment, SQL, schema, role, credential, branch, Data API, or trigger change was made. A separate expiring validation branch was left untouched.

Unknown cost, security semantics, supplier path, account quota, or eligibility must fail closed. A committed workflow is not an authorization to dispatch it.
