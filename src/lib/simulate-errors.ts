/** Return safe gateway messages without exposing SDK requests, headers or credentials. */
export function simulationFailure(error: unknown): {
  ok: false;
  code: "not_configured" | "rate_limited" | "credits" | "invalid_output" | "network";
  message: string;
} {
  const e = error as { statusCode?: number; responseBody?: string } | null;
  const status = e?.statusCode;
  let message: string | undefined;
  try {
    const body = JSON.parse(e?.responseBody ?? "") as { message?: unknown; error?: { message?: unknown } };
    const candidate = body.error?.message ?? body.message;
    // Never relay a credential accidentally included in a provider response.
    if (typeof candidate === "string" && candidate.length <= 2000 && !/bearer\s|sk[-_]|authorization|api[-_ ]?key\s*[:=]/i.test(candidate)) message = candidate;
  } catch { /* Network failures may not have a JSON response. */ }
  if (status === 401) return { ok: false, code: "not_configured", message: message ?? "The managed Lovable AI key is missing or invalid. Live generation needs its server configuration repaired." };
  if (status === 429) return { ok: false, code: "rate_limited", message: message ?? "Too many simulations at once. Please wait a moment and try again." };
  if (status === 402 || status === 403) return { ok: false, code: "credits", message: message ?? "Lovable AI access is blocked for this workspace. Check its AI access, credits and spending limits." };
  if (status === 404) return { ok: false, code: "not_configured", message: message ?? "The configured Lovable AI model or endpoint is unavailable. No alternate provider was used." };
  return { ok: false, code: "network", message: message ?? "We couldn't reach the simulation service. Your decision is saved — please try again." };
}