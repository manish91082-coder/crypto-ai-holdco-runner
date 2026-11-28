import { createHash as googleSha256, timingSafeEqual as googleSafeEqual } from 'node:crypto';

const GOOGLE_OIDC_ISSUERS = new Set([
  'https://accounts.google.com',
  'accounts.google.com'
]);
const GOOGLE_OIDC_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
let googleOidcJwksCache = { expiresAtMs: 0, keys: [] };

function decodeGoogleJwtSegment(segment) {
  if (typeof segment !== 'string' || !/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error('JWT_SEGMENT');
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

async function loadGoogleOidcJwks(fetchImpl, nowMs, forceRefresh = false) {
  if (!forceRefresh && googleOidcJwksCache.expiresAtMs > nowMs && googleOidcJwksCache.keys.length) {
    return googleOidcJwksCache.keys;
  }
  const response = await fetchImpl(GOOGLE_OIDC_JWKS_URL, {
    method: 'GET',
    headers: { accept: 'application/json' },
    redirect: 'error'
  });
  if (!response?.ok) throw new Error('GOOGLE_JWKS_UNAVAILABLE');
  const document = await response.json();
  if (!Array.isArray(document?.keys) || document.keys.length < 1) throw new Error('GOOGLE_JWKS_INVALID');
  const cacheControl = response.headers?.get?.('cache-control') ?? '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSeconds = Math.max(30, Math.min(3600, Number(maxAgeMatch?.[1] ?? 300)));
  googleOidcJwksCache = { keys: document.keys, expiresAtMs: nowMs + maxAgeSeconds * 1000 };
  return googleOidcJwksCache.keys;
}

export function resetGoogleOidcJwksCacheForTests() {
  googleOidcJwksCache = { expiresAtMs: 0, keys: [] };
}

export async function verifyGoogleAppsScriptOidc(token, options = {}) {
  const deny = (code) => {
    try { options.onFailure?.(code); } catch {}
    return false;
  };
  try {
    const audience = options.audience;
    const subjectSha256 = options.subjectSha256;
    if (typeof audience !== 'string' || audience.length < 10 || audience.length > 512) return deny('CONFIG_AUDIENCE');
    if (typeof subjectSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(subjectSha256)) return deny('CONFIG_SUBJECT_HASH');
    if (typeof token !== 'string' || token.length < 100 || token.length > 8192) return deny('TOKEN_SHAPE');

    const parts = token.split('.');
    if (parts.length !== 3) return deny('JWT_SEGMENTS');
    const header = decodeGoogleJwtSegment(parts[0]);
    const claims = decodeGoogleJwtSegment(parts[1]);
    if (header?.alg !== 'RS256' || (header?.typ && header.typ !== 'JWT') || typeof header?.kid !== 'string') {
      return deny('JWT_HEADER');
    }

    if (!GOOGLE_OIDC_ISSUERS.has(claims?.iss)) return deny('CLAIM_ISSUER');
    // Apps Script preflight requires a scalar OAuth client audience. Reject
    // multi-audience tokens rather than accepting array membership without azp binding.
    if (claims?.aud !== audience) return deny('CLAIM_AUDIENCE');
    if (typeof claims?.sub !== 'string' || claims.sub.length < 1 || claims.sub.length > 255 || !/^[\x20-\x7E]+$/.test(claims.sub)) {
      return deny('CLAIM_SUBJECT');
    }
    const suppliedSubjectHash = googleSha256('sha256').update(claims.sub, 'utf8').digest();
    const expectedSubjectHash = Buffer.from(subjectSha256, 'hex');
    if (expectedSubjectHash.length !== suppliedSubjectHash.length
      || !googleSafeEqual(suppliedSubjectHash, expectedSubjectHash)) {
      return deny('CLAIM_SUBJECT_BINDING');
    }

    const nowSeconds = Number.isFinite(options.nowSeconds) ? options.nowSeconds : Math.floor(Date.now() / 1000);
    const exp = Number(claims.exp);
    const iat = Number(claims.iat);
    const nbf = claims.nbf === undefined ? null : Number(claims.nbf);
    if (!Number.isInteger(exp) || !Number.isInteger(iat)) return deny('TIME_CLAIMS');
    if (exp <= nowSeconds || exp - iat <= 0 || exp - iat > 3600) return deny('EXPIRY_WINDOW');
    if (iat > nowSeconds + 60 || nowSeconds - iat > 3600) return deny('TIME_WINDOW');
    if (nbf !== null && (!Number.isInteger(nbf) || nbf > nowSeconds + 60 || nbf > exp)) return deny('NOT_BEFORE');

    const fetchImpl = options.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== 'function') return deny('FETCH_UNAVAILABLE');
    const nowMs = nowSeconds * 1000;
    let keys = await loadGoogleOidcJwks(fetchImpl, nowMs);
    let jwk = keys.find((key) => key?.kid === header.kid && key?.kty === 'RSA' && (!key.use || key.use === 'sig'));
    if (!jwk) {
      keys = await loadGoogleOidcJwks(fetchImpl, nowMs, true);
      jwk = keys.find((key) => key?.kid === header.kid && key?.kty === 'RSA' && (!key.use || key.use === 'sig'));
    }
    if (!jwk) return deny('JWKS_KID_NOT_FOUND');

    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return deny('CRYPTO_SUBTLE_UNAVAILABLE');
    const publicKey = await subtle.importKey(
      'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
    );
    const signature = Buffer.from(parts[2], 'base64url');
    const signatureValid = await subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signature,
      new TextEncoder().encode(parts[0] + '.' + parts[1])
    );
    return signatureValid ? true : deny('SIGNATURE_INVALID');
  } catch (error) {
    const code = error?.message === 'GOOGLE_JWKS_UNAVAILABLE' ? 'JWKS_UNAVAILABLE'
      : error?.message === 'GOOGLE_JWKS_INVALID' ? 'JWKS_INVALID'
      : error?.name === 'TypeError' ? 'NETWORK_OR_TYPE_ERROR'
      : error?.name === 'OperationError' ? 'CRYPTO_OPERATION_ERROR'
      : error?.name === 'DataError' ? 'JWK_IMPORT_ERROR'
      : 'VERIFIER_EXCEPTION';
    return deny(code);
  }
}
