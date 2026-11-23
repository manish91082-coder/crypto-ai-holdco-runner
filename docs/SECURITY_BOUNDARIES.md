# Security Boundaries

## Repository classification

This repository is public. Its contents, commit history, issues, workflow definitions, and GitHub Actions logs must be treated as public or potentially public.

## Prohibited material

Never commit or expose:

- Private keys, signing keys, seed phrases, wallet recovery material, or keystore files.
- Passwords, bearer tokens, API keys, OAuth tokens, session cookies, or secret environment values.
- Internal Neon project IDs, branch IDs, database hostnames, connection strings, private schema details, or environment-specific endpoints.
- Customer, sponsor, counterparty, or personal data.
- Private audit evidence or non-public operational documents.

Do not put secrets in command-line arguments, workflow inputs, outputs, artifacts, caches, logs, summaries, source files, SQL, or repository history.

## Workflow constraints

The only workflow currently present is a manual, harmless preflight. It must not be expanded to perform provisioning, database access, deployments, key generation, wallet actions, or financial operations without a separate reviewed change and explicit authorization.

## Reporting

If a secret is accidentally committed or logged, treat it as compromised. Stop the workflow, revoke/rotate the exposed credential through the provider's supported process, preserve incident evidence privately, and do not attempt to hide the incident by rewriting repository history alone.
