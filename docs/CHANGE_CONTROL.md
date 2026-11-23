# Change Control

Every change to this repository must be reviewed against the following gates:

1. Public-disclosure review: confirm the complete diff contains no non-public identifiers or secrets.
2. Scope review: confirm no prohibited live financial, wallet, custody, trading, staking, MEV, or flash-loan-execution capability is introduced.
3. Cost review: confirm the proposed runner, storage, network, compute, and provider usage remains within verified zero-cost limits. Unknown cost means no execution.
4. Security review: confirm permissions are least-privilege, actions are pinned to immutable commit SHAs where used, and no untrusted event can reach a privileged job.
5. Explicit authorization: infrastructure provisioning, secret creation, branch creation, SQL changes, Data API configuration, or deployments require a separately bounded approval.

A passing static test does not authorize deployment. A successful deployment does not establish production readiness.
