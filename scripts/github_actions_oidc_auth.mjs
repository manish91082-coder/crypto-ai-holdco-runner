const GITHUB_OIDC_ISSUER = 'https://token.actions.githubusercontent.com';
const GITHUB_OIDC_JWKS_URL = 'https://token.actions.githubusercontent.com/.well-known/jwks';
const GITHUB_OIDC_AUDIENCE = 'https://crypto-ai-holdco.invalid/ci-metrics-read';
const GITHUB_OIDC_SUBJECT = 'repo:manish91082-coder@283637475/crypto-ai-holdco-runner@1468220353:ref:refs/heads/temporary-zero-cost-runtime-pilot';
const GITHUB_OIDC_REPOSITORY = 'manish91082-coder/crypto-ai-holdco-runner';
const GITHUB_OIDC_WORKFLOW_REF = 'manish91082-coder/crypto-ai-holdco-runner/.github/workflows/runtime-pilot-ci.yml@refs/heads/temporary-zero-cost-runtime-pilot';
let githubOidcJwksCache = { expiresAtMs: 0, keys: [] };

function decodeJwtSegment(segment) {
  if (typeof segment !== 'string' || !/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error('INVALID_JWT_SEGMENT');
  const decoded = Buffer.from(segment, 'base64url').toString('utf8');
  return JSON.parse(decoded);
}

async function loadGithubOidcJwks(fetchImpl, nowMs, forceRefresh = false) {
  if (!forceRefresh && githubOidcJwksCache.expiresAtMs > nowMs && githubOidcJwksCache.keys.length) {
    return githubOidcJwksCache.keys;
  }
  const response = await fetchImpl(GITHUB_OIDC_JWKS_URL, {
    method: 'GET',
    headers: { accept: 'application/json' },
    redirect: 'error'
  });
  if (!response?.ok) throw new Error('OIDC_JWKS_UNAVAILABLE');
  const document = await response.json();
  if (!Array.isArray(document?.keys) || document.keys.length < 1) throw new Error('OIDC_JWKS_INVALID');
  const cacheControl = response.headers?.get?.('cache-control') ?? '';
  const maxAgeMatch = cacheControl.match(/max-age=(\\d+)/i);
  const maxAgeSeconds = Math.max(30, Math.min(3600, Number(maxAgeMatch?.[1] ?? 300)));
  githubOidcJwksCache = { keys: document.keys, expiresAtMs: nowMs + maxAgeSeconds * 1000 };
  return githubOidcJwksCache.keys;
}

export function resetGithubOidcJwksCacheForTests() {
  githubOidcJwksCache = { expiresAtMs: 0, keys: [] };
}

export async function verifyGithubActionsOidc(token, options = {}) {
  try {
    if (typeof token !== 'string' || token.length < 100 || token.length > 8192) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const header = decodeJwtSegment(parts[0]);
    const claims = decodeJwtSegment(parts[1]);
    if (header?.alg !== 'RS256' || header?.typ !== 'JWT' || typeof header?.kid !== 'string') return false;

    const nowSeconds = Number.isFinite(options.nowSeconds) ? options.nowSeconds : Math.floor(Date.now() / 1000);
    const audienceMatches = claims?.aud === GITHUB_OIDC_AUDIENCE;
    const exactClaimsMatch =
      claims?.iss === GITHUB_OIDC_ISSUER
      && audienceMatches
      && claims?.sub === GITHUB_OIDC_SUBJECT
      && claims?.repository === GITHUB_OIDC_REPOSITORY
      && String(claims?.repository_id ?? '') === '1468220353'
      && claims?.repository_owner === 'manish91082-coder'
      && String(claims?.repository_owner_id ?? '') === '283637475'
      && claims?.workflow === 'Runtime Pilot CI'
      && claims?.workflow_ref === GITHUB_OIDC_WORKFLOW_REF
      && claims?.event_name === 'push'
      && claims?.ref === 'refs/heads/temporary-zero-cost-runtime-pilot'
      && claims?.runner_environment === 'github-hosted'
      && claims?.repository_visibility === 'public'
      && String(claims?.actor_id ?? '') === '283637475';
    if (!exactClaimsMatch) return false;

    const exp = Number(claims.exp);
    const iat = Number(claims.iat);
    const nbf = Number(claims.nbf);
    if (!Number.isInteger(exp) || !Number.isInteger(iat) || !Number.isInteger(nbf)) return false;
    if (exp <= nowSeconds || exp - iat > 600 || exp - iat <= 0) return false;
    if (iat > nowSeconds + 60 || nowSeconds - iat > 600 || nbf > nowSeconds + 60 || nbf > exp) return false;
    if (typeof claims.jti !== 'string' || claims.jti.length < 16 || typeof claims.sha !== 'string' || !/^[a-f0-9]{40}$/i.test(claims.sha)) return false;

    const fetchImpl = options.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== 'function') return false;
    const nowMs = nowSeconds * 1000;
    let keys = await loadGithubOidcJwks(fetchImpl, nowMs);
    let jwk = keys.find((key) => key?.kid === header.kid && key?.kty === 'RSA' && (!key.use || key.use === 'sig'));
    if (!jwk) {
      keys = await loadGithubOidcJwks(fetchImpl, nowMs, true);
      jwk = keys.find((key) => key?.kid === header.kid && key?.kty === 'RSA' && (!key.use || key.use === 'sig'));
    }
    if (!jwk) return false;

    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return false;
    const publicKey = await subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const signedBytes = new TextEncoder().encode(parts[0] + '.' + parts[1]);
    const signature = Buffer.from(parts[2], 'base64url');
    return await subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, signedBytes);
  } catch {
    // Authentication must fail closed and must not log token, claims or key material.
    return false;
  }
}
