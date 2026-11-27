import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import {
  verifyGithubActionsOidc,
  resetGithubOidcJwksCacheForTests
} from '../scripts/github_actions_oidc_auth.mjs';

const NOW = 1800000000;
const AUDIENCE = 'https://crypto-ai-holdco.invalid/ci-metrics-read';
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = {
  ...publicKey.export({ format: 'jwk' }),
  kid: 'holdco-oidc-unit-test',
  alg: 'RS256',
  use: 'sig',
  key_ops: ['verify']
};

function b64url(value) {
  return Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
}

function claims(overrides = {}) {
  return {
    iss: 'https://token.actions.githubusercontent.com',
    aud: AUDIENCE,
    sub: 'repo:manish91082-coder@283637475/crypto-ai-holdco-runner@1468220353:ref:refs/heads/temporary-zero-cost-runtime-pilot',
    repository: 'manish91082-coder/crypto-ai-holdco-runner',
    repository_id: '1468220353',
    repository_owner: 'manish91082-coder',
    repository_owner_id: '283637475',
    workflow: 'Runtime Pilot CI',
    workflow_ref: 'manish91082-coder/crypto-ai-holdco-runner/.github/workflows/runtime-pilot-ci.yml@refs/heads/temporary-zero-cost-runtime-pilot',
    event_name: 'push',
    ref: 'refs/heads/temporary-zero-cost-runtime-pilot',
    runner_environment: 'github-hosted',
    repository_visibility: 'public',
    actor_id: '283637475',
    sha: 'a'.repeat(40),
    jti: 'test-jti-0123456789abcdef0123456789',
    iat: NOW - 10,
    nbf: NOW - 10,
    exp: NOW + 290,
    ...overrides
  };
}

function signedToken(payload = claims(), signingKey = privateKey) {
  const encodedHeader = b64url({ alg: 'RS256', typ: 'JWT', kid: jwk.kid });
  const encodedPayload = b64url(payload);
  const signed = sign('RSA-SHA256', Buffer.from(encodedHeader + '.' + encodedPayload), signingKey);
  return encodedHeader + '.' + encodedPayload + '.' + signed.toString('base64url');
}

function fetchJwks() {
  let calls = 0;
  const fetchImpl = async (url) => {
    calls += 1;
    assert.equal(url, 'https://token.actions.githubusercontent.com/.well-known/jwks');
    return {
      ok: true,
      headers: { get: () => 'public, max-age=300' },
      json: async () => ({ keys: [jwk] })
    };
  };
  return { fetchImpl, calls: () => calls };
}

test('accepts a correctly signed exact-repository CI metrics identity', async () => {
  resetGithubOidcJwksCacheForTests();
  const mock = fetchJwks();
  const ok = await verifyGithubActionsOidc(signedToken(), { fetchImpl: mock.fetchImpl, nowSeconds: NOW });
  assert.equal(ok, true);
  assert.equal(mock.calls(), 1);
});

test('rejects a different repository or immutable subject before JWKS fetch', async () => {
  resetGithubOidcJwksCacheForTests();
  const mock = fetchJwks();
  const ok = await verifyGithubActionsOidc(signedToken(claims({ repository_id: '999999' })), {
    fetchImpl: mock.fetchImpl, nowSeconds: NOW
  });
  assert.equal(ok, false);
  assert.equal(mock.calls(), 0);
});

test('rejects wrong workflow, branch, event or actor before JWKS fetch', async () => {
  for (const patch of [
    { workflow_ref: 'other/.github/workflows/ci.yml@refs/heads/main' },
    { ref: 'refs/heads/main' },
    { event_name: 'pull_request' },
    { actor_id: '999999' }
  ]) {
    resetGithubOidcJwksCacheForTests();
    const mock = fetchJwks();
    const ok = await verifyGithubActionsOidc(signedToken(claims(patch)), {
      fetchImpl: mock.fetchImpl, nowSeconds: NOW
    });
    assert.equal(ok, false);
    assert.equal(mock.calls(), 0);
  }
});

test('rejects wrong audience and expired tokens before JWKS fetch', async () => {
  for (const patch of [
    { aud: 'https://wrong.example' },
    { exp: NOW - 1 },
    { iat: NOW + 120 },
    { exp: NOW + 900, iat: NOW - 10 }
  ]) {
    resetGithubOidcJwksCacheForTests();
    const mock = fetchJwks();
    const ok = await verifyGithubActionsOidc(signedToken(claims(patch)), {
      fetchImpl: mock.fetchImpl, nowSeconds: NOW
    });
    assert.equal(ok, false);
    assert.equal(mock.calls(), 0);
  }
});

test('rejects invalid signature even when all claims match', async () => {
  resetGithubOidcJwksCacheForTests();
  const other = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
  const mock = fetchJwks();
  const ok = await verifyGithubActionsOidc(signedToken(claims(), other), {
    fetchImpl: mock.fetchImpl, nowSeconds: NOW
  });
  assert.equal(ok, false);
});

test('caches the verified GitHub JWKS for repeat requests in the same isolate', async () => {
  resetGithubOidcJwksCacheForTests();
  const mock = fetchJwks();
  const first = await verifyGithubActionsOidc(signedToken(), { fetchImpl: mock.fetchImpl, nowSeconds: NOW });
  const second = await verifyGithubActionsOidc(signedToken(), { fetchImpl: mock.fetchImpl, nowSeconds: NOW + 1 });
  assert.equal(first, true);
  assert.equal(second, true);
  assert.equal(mock.calls(), 1);
});

test('fails closed for malformed tokens and unavailable JWKS', async () => {
  resetGithubOidcJwksCacheForTests();
  assert.equal(await verifyGithubActionsOidc('not-a-jwt', { nowSeconds: NOW }), false);
  resetGithubOidcJwksCacheForTests();
  const unavailable = async () => ({ ok: false, headers: { get: () => null } });
  assert.equal(await verifyGithubActionsOidc(signedToken(), { fetchImpl: unavailable, nowSeconds: NOW }), false);
});
