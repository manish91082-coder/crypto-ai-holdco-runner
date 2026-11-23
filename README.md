# Crypto AI Holdings — Manual Runner Scaffold

This is a **public, non-production scaffold** for a narrowly controlled manual preflight runner.

## Current purpose

- Establish a clean public repository boundary for the Crypto AI Holdings engineering workstream.
- Provide one manual-only GitHub Actions workflow on `ubuntu-24.04`.
- Keep the workflow inert with respect to Neon, databases, secrets, wallets, trading, and financial actions.

## What this repository does not do

- It does not connect to Neon or any other database.
- It does not deploy Functions, provision Data API, run SQL, create branches, or configure triggers.
- It does not generate, store, read, or transmit private keys, tokens, passwords, or wallet material.
- It does not run on pushes, pull requests, schedules, or external dispatch events.
- It does not implement live crypto execution, custody, trading, staking, MEV, or flash-loan execution.

## Manual preflight workflow

`.github/workflows/manual-preflight.yml` is triggered only by `workflow_dispatch`, guarded to the `main` branch, uses one standard GitHub-hosted `ubuntu-24.04` runner and `contents: read`, and runs a harmless static message. It does not check out source or invoke external actions.

The workflow is intentionally not dispatched as part of repository setup.

## Security boundary

This repository is public. Treat every committed byte as public. Never place non-public architecture details, account identifiers, endpoints, branch identifiers, access tokens, API keys, private keys, seed phrases, customer data, or internal evidence in this repository.

See [Security Boundaries](docs/SECURITY_BOUNDARIES.md) and [Change Control](docs/CHANGE_CONTROL.md).

## Status

`SCAFFOLD_ONLY — NO SECRET PROVISIONING — NO NEON DEPLOYMENT — NO PRODUCTION WORKLOADS`

This scaffold is not a certification of platform security, zero-cost availability beyond GitHub's applicable public-runner terms, or production readiness.
