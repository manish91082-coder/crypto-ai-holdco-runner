# Crypto AI Holdings — Manual Runner Scaffold

This is a **public, non-production scaffold** for a narrowly controlled manual preflight runner.

## Project guardrails

- Follow [Execution Control Protocol](docs/EXECUTION_CONTROL_PROTOCOL.md) for project identity, phase sequencing, cross-chat recovery and no-drift controls.
- Read the [latest continuity checkpoint](docs/CONTINUITY_CHECKPOINT_2026-11-23.md) before any continuation.
- For account evidence, use [OCI Tenancy Read-Only Evidence Checklist v1.1](docs/P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.1.md). It includes Home Region, quotas, existing VCN/IPv6 prefix, gateways, routes and security-rule inspection. No provisioning.
- See [P03.03 Secret-Safe Runtime Assurance v1.3](docs/P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.3.md) for the IPv6-first egress feasibility review.
- See [P03.03 HSM/RS256 baseline v1.2](docs/P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.2.md) for key-protection assurance and signing controls.
- See [Security Boundaries](docs/SECURITY_BOUNDARIES.md) and [Change Control](docs/CHANGE_CONTROL.md).

## Current purpose

- Maintain a clean public source-control boundary for the Crypto AI Holdings engineering workstream.
- Provide one manual-only GitHub Actions workflow on `ubuntu-24.04`.
- Keep the workflow inert with respect to Neon, databases, secrets, wallets, trading and financial actions.

## What this repository does not do

- It does not connect to Neon or any other database.
- It does not deploy Functions, provision Data API, run SQL, create branches or configure triggers.
- It does not generate, store, read or transmit private keys, tokens, passwords or wallet material.
- It does not run on pushes, pull requests, schedules or external dispatch events.
- It does not implement live crypto execution, custody, trading, staking, MEV or flash-loan execution.

## Manual preflight workflow

`.github/workflows/manual-preflight.yml` is triggered only by `workflow_dispatch`, guarded to the `main` branch, uses one standard `ubuntu-24.04` runner and `contents: read`, and runs a harmless static message. It is not dispatched. This repository is approved as public source control only, not as an operational runtime. Cloudflare remains excluded.

## Status

`SCAFFOLD_ONLY — NO SECRET PROVISIONING — NO NEON DEPLOYMENT — NO PRODUCTION WORKLOADS`
