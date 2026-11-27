const FUNCTION_URL = 'https://br-lively-flower-a15zb6ar-cryptoaicore.compute.c-1.ap-southeast-1.aws.neon.tech';
const SCHEDULER_HANDLER = 'schedulerTick';

/**
 * Run once as the intended owner to inspect the binding needed by Neon.
 * Only public OAuth audience and SHA-256(sub) are returned. The ID token
 * itself and the raw Google subject are never logged, returned or stored.
 */
function inspectGoogleIdentityBinding() {
  const token = ScriptApp.getIdentityToken();
  if (!token) throw new Error('GOOGLE_ID_TOKEN_UNAVAILABLE');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('GOOGLE_ID_TOKEN_SHAPE');
  const payload = JSON.parse(
    Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[1])).getDataAsString()
  );
  if (typeof payload.iss !== 'string' || typeof payload.aud !== 'string'
      || typeof payload.sub !== 'string' || !Number.isFinite(Number(payload.exp))) {
    throw new Error('GOOGLE_IDENTITY_CLAIMS_INCOMPLETE');
  }
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    payload.sub,
    Utilities.Charset.UTF_8
  );
  const subjectSha256 = bytes.map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
  const result = {
    issuer: payload.iss,
    audience: payload.aud,
    subject_sha256: subjectSha256,
    expires_at_epoch_seconds: Number(payload.exp),
    issued_at_epoch_seconds: Number(payload.iat)
  };
  Logger.log(JSON.stringify(result));
  return result;
}

/**
 * Not installed or invoked automatically. Run only after P03.03 and P03.05
 * gates, live identity allowlisting, project-owner access review and explicit
 * scheduler approval have passed.
 */
function installSchedulerTrigger() {
  const existing = ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === SCHEDULER_HANDLER);
  if (existing.length > 0) return 'ALREADY_INSTALLED';
  ScriptApp.newTrigger(SCHEDULER_HANDLER).timeBased().everyMinutes(30).create();
  return 'INSTALLED_30_MINUTE_TRIGGER';
}

/** Removes only this project's schedulerTick triggers. */
function removeSchedulerTrigger() {
  const existing = ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === SCHEDULER_HANDLER);
  existing.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  return 'REMOVED_' + existing.length;
}

/**
 * Installable trigger runs as its creator. An ID token is minted per run,
 * sent only in the Authorization header, and never persisted or logged.
 */
function schedulerTick() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return 'SKIPPED_OVERLAPPING_TICK';
  try {
    const token = ScriptApp.getIdentityToken();
    if (!token) {
      Logger.log('GOOGLE_ID_TOKEN_UNAVAILABLE');
      return 'IDENTITY_UNAVAILABLE';
    }
    const response = UrlFetchApp.fetch(
      FUNCTION_URL + '/internal/google/scheduler/dispatch',
      {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + token },
        payload: '{}',
        followRedirects: false,
        muteHttpExceptions: true
      }
    );
    const status = response.getResponseCode();
    Logger.log('NEON_SCHEDULER_HTTP_STATUS=' + status);
    if (status === 200) return 'HTTP_200';
    if (status === 401) return 'AUTH_DENIED';
    if (status === 503) return 'SCHEDULER_PAUSED';
    return 'HTTP_' + status;
  } finally {
    lock.releaseLock();
  }
}
