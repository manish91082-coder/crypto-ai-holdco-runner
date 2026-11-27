const integer = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
};

export const config = Object.freeze({
  port: integer(process.env.PORT, 8080, 1, 65535),
  databaseUrl: process.env.DATABASE_URL ?? "",
  apiToken: process.env.APP_API_TOKEN ?? "",
  workerEnabled: (process.env.WORKER_ENABLED ?? "true").toLowerCase() === "true",
  workerPollMs: integer(process.env.WORKER_POLL_MS, 3000, 1000, 30000),
  workerConcurrency: integer(process.env.WORKER_CONCURRENCY, 1, 1, 2),
  modelProvider: (process.env.MODEL_PROVIDER ?? "rules").toLowerCase(),
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  liveSubmissionsEnabled: false,
  walletSigningEnabled: false,
  paymentsEnabled: false
});

export function validateRuntimeConfig() {
  const errors = [];
  if (!config.databaseUrl) errors.push("DATABASE_URL is required");
  if (!config.apiToken || config.apiToken.length < 32) {
    errors.push("APP_API_TOKEN must contain at least 32 characters");
  }
  if (!["rules", "gemini"].includes(config.modelProvider)) {
    errors.push("MODEL_PROVIDER must be rules or gemini");
  }
  if (config.modelProvider === "gemini" && !config.geminiApiKey) {
    errors.push("GEMINI_API_KEY is required when MODEL_PROVIDER=gemini");
  }
  return errors;
}