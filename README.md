# Crypto AI Holdings — Manual Runner Scaffold

This is a **public, non-production scaffold** for a narrowly controlled manual preflight runner.

## Project guardrails

- Follow [Execution Control Protocol](docs/EXECUTION_CONTROL_PROTOCOL.md) for project identity, phase sequencing, cross-chat recovery and no-drift controls.
- Read the [latest continuity checkpoint](docs/CONTINUITY_CHECKPOINT_2026-11-23.md) before any continuation.
- See [P03.03 Secret-Safe Runtime Assurance v1.1](docs/P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.1.md) for the newest conditional OCI KMS/Instance Principals research.
- See [Runtime and Secret-Storage Gate Review](docs/RUNTIME_AND_SECRET_GATE_REVIEW.md) for prior infrastructure blockers.
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

`.github/workflows/manual-preflight.yml` is triggered only by `workflow_dispatch`, guarded to the `main` branch, uses one standard `ubuntu-24.04` runner and `contents: read`, and runs a harmless static message. It does not check out source or invoke external actions.

The workflow is intentionally not dispatched. This repository is approved as public source control only, not as an operational runtime. Cloudflare remains excluded from all layers.

## Status

`SCAFFOLD_ONLY — NO SECRET PROVISIONING — NO NEON DEPLOYMENT — NO PRODUCTION WORKLOADS`

This scaffold is not a certification of platform security, zero-cost availability beyond applicable provider terms, or production readiness.
