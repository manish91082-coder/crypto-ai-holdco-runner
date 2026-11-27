import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/runtime-pilot-ci.yml', import.meta.url), 'utf8');
const verifier = readFileSync(new URL('../scripts/github_actions_oidc_auth.mjs', import.meta.url), 'utf8');
const patcher = readFileSync(new URL('../scripts/patch_neon_function_bundle.py', import.meta.url), 'utf8');

test('OIDC workflow token permission is limited to this workflow job', () => {
  assert.ok(workflow.includes('id-token: write'));
  assert.ok(workflow.includes("audience = 'https://crypto-ai-holdco.invalid/ci-metrics-read'"));
  assert.ok(workflow.includes("response.status !== 200"));
  assert.ok(workflow.includes("process.env.FUNCTION_URL + '/v1/metrics'"));
  assert.ok(workflow.includes("method: 'GET'"));
});

test('live positive OIDC canary is explicitly staged and cannot run on pull requests', () => {
  assert.ok(workflow.includes("if: github.event_name == 'push' && contains(github.event.head_commit.message, 'enable-oidc-live-canary')"));
  assert.ok(workflow.includes("push_event: claims.event_name === 'push'"));
  assert.ok(workflow.includes("hosted_runner: claims.runner_environment === 'github-hosted'"));
});

test('verifier pins immutable repository and workflow identity', () => {
  assert.ok(verifier.includes("GITHUB_OIDC_SUBJECT"));
  assert.ok(verifier.includes("GITHUB_OIDC_WORKFLOW_REF"));
  assert.ok(verifier.includes("String(claims?.repository_id ?? '') === '1468220353'"));
  assert.ok(verifier.includes("String(claims?.repository_owner_id ?? '') === '283637475'"));
  assert.ok(verifier.includes("claims?.event_name === 'push'"));
  assert.ok(verifier.includes("claims?.runner_environment === 'github-hosted'"));
});

test('OIDC is not a general API key and is accepted only for metrics:read', () => {
  assert.ok(patcher.includes("requiredScope === 'metrics:read' && await verifyGithubActionsOidc"));
  assert.ok(patcher.includes("'github-actions:repo:1468220353'"));
  assert.ok(verifier.includes("redirect: 'error'"));
  assert.ok(verifier.includes("return signatureValid ? true : deny('SIGNATURE_INVALID')"));
});

test('token or claim content is never written to logs', () => {
  assert.equal(verifier.includes('console.log'), false);
  assert.equal(verifier.includes('console.error'), false);
  assert.ok(patcher.includes("console.info('GITHUB_OIDC_METRICS_AUTH_DENIED', reason)"));
  assert.ok(patcher.includes("console.info('GITHUB_OIDC_METRICS_AUTH_ACCEPTED', 'repo:1468220353')"));
});

// This controlled push also runs the staged read-only OIDC HTTP canary after verifier deployment.
