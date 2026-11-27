import { config } from "./config.js";

export async function analyzePublicText(prompt) {
  if (config.modelProvider !== "gemini" || !config.geminiApiKey) {
    return {
      provider: "rules",
      model: "deterministic-specialist-agents",
      text: "No external model key configured. Deterministic policy and validation agents used."
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiModel)}:generateContent?key=${encodeURIComponent(config.geminiApiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: String(prompt).slice(0, 12000) }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
    }),
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    // Never include the request URL because it contains the API key.
    throw new Error(`MODEL_PROVIDER_HTTP_${response.status}`);
  }
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? "";
  if (!text) throw new Error("MODEL_PROVIDER_EMPTY_RESPONSE");
  return { provider: "gemini", model: config.geminiModel, text };
}