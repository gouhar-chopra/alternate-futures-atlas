import { createServerFn } from "@tanstack/react-start";
import { DecisionInputSchema, parseScenarioText, type Scenario } from "./scenario";
import { simulationFailure } from "./simulate-errors";

export type SimulateResult =
  | { ok: true; scenario: Scenario }
  | { ok: false; code: "not_configured" | "rate_limited" | "credits" | "invalid_output" | "network"; message: string };

const SYSTEM = `You write explicitly hypothetical, balanced alternate-life scenarios for a reflective app called ELSEWHERE.
Rules: use conditional language (might, could, one possible outcome). Never claim certainty, access to alternate realities, live data, or research. No numeric probabilities. No real people, real news outlets, or quotations from real individuals. Never imply the user chose wrongly. Avoid guilt. Keep it focused on the user's question. Supportive tone if distress appears.
Financial: set financial.available=true only if money is meaningfully relevant. If the user supplied a salary, basis="user_provided"; otherwise use round invented demo figures, basis="demo_assumption", and say so in assumptions. Use the currency most natural for the location (ISO code).
Respond ONLY with one JSON object, no prose, matching:
{"title":str,"decision_summary":str,"opening_narrative":str (2-3 sentences beginning "In this imagined timeline"),
"highlights":{"changed":str,"opportunities":str,"tradeoffs":str},
"assumptions":[{"label":str,"description":str,"source_type":"user_provided"|"model_assumption"|"demo_assumption"}] (3-5),
"timelines":[{"id":"a"|"b"|"c","title":str (scenario-specific),"theme":str,"description":str,
  "events":[{"time_label":"Year 0".."Year N","title":str,"description":str,"possible_benefit":str,"possible_tradeoff":str,"assumptions":[str],"uncertainty":"lower"|"moderate"|"high","uncertainty_note":str}],
  "benefits":[str],"tradeoffs":[str],"unknowns":[str],"financial_series":[{"period":"Y0".."YN","value":number cumulative illustrative savings}]}],
"financial":{"available":bool,"currency":str,"basis":"user_provided"|"demo_assumption","assumptions":[{"label":str,"value":str}],"metrics":[{"label":str,"value":number,"unit":str,"note":str}],"breakdown":[{"label":str,"value":number}]},
"feed":[{"id":str,"date_label":str,"publication":"Elsewhere Journal"|"The Alternate Ledger"|"Parallel Weekly","headline":str,"summary":str,"why_it_appears":str}] (3-4),
"social":[{"profile_label":"You, elsewhere","date_label":str,"post":str,"fictional_reactions":number,"why_it_appears":str}] (2),
"reflection":{"summary":str,"questions":[str] (3)}}`;

export const simulateScenario = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DecisionInputSchema.parse(d))
  .handler(async ({ data }): Promise<SimulateResult> => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) return { ok: false, code: "not_configured", message: "LOVABLE_API_KEY is not available in this server environment. Lovable manages it in the hosted project; a local server does not automatically inherit it. You can still explore the demo scenario." };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");

    let runId: string | undefined;
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
        const res = await fetch(input, { ...init, headers });
        runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
        return res;
      },
    });

    const timelineCount = data.style === "multiple" ? 3 : 2;
    const user = [
      `What-if (the counterfactual decision to explore): ${data.decision}`,
      data.situation && `Situation at the time (background, options, motivations, constraints — use this to ground the narrative, events, trade-offs and reflection): ${data.situation}`,
      data.year && `Approximate year: ${data.year}`,
      data.location && `Location: ${data.location}`,
      data.area && `Life area: ${data.area}`,
      data.hoped && `What they hoped for: ${data.hoped}`,
      data.constraints && `Constraints then: ${data.constraints}`,
      data.curious && `Most curious about: ${data.curious}`,
      data.salary && `User-supplied hypothetical starting salary: ${data.salary}`,
      `Narrative style: ${data.style}`,
      `Horizon: ${data.horizon} years — events Year 0 to Year ${data.horizon} (max 6 events, group years if needed).`,
      `Produce ${timelineCount} distinct timelines.`,
    ].filter(Boolean).join("\n");

  
try {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: user,
    config: {
      systemInstruction: SYSTEM,
      responseMimeType: "application/json",
      maxOutputTokens: 12000,
    },
  });

  const text = result.text;
  const parsed = text ? parseScenarioText(text) : null;

  if (!parsed) {
    return {
      ok: false,
      code: "invalid_output",
      message: "The simulation came back in an unexpected shape. Please try again.",
    };
  }

  return {
    ok: true,
    scenario: {
      ...parsed,
      id: crypto.randomUUID().slice(0, 8),
      mode: "live",
      created_at: new Date().toISOString(),
      input: data,
    },
  };
} catch (e) {
  const error = e as { status?: number; statusCode?: number };
  const status = error.status ?? error.statusCode;

  console.error("Gemini simulation failed", status ?? "network");

  if (status === 429) {
    return {
      ok: false,
      code: "rate_limited",
      message: "Gemini's request limit has been reached. Please wait and try again.",
    };
  }

  if (status === 401 || status === 403) {
    return {
      ok: false,
      code: "not_configured",
      message: "Gemini authentication failed. Check your API key and project access.",
    };
  }
  if (status === 503) {
  return {
    ok: false,
    code: "network",
    message:
      "Gemini is temporarily unavailable or overloaded. Please wait a little and try again.",
  };
}

  return simulationFailure(e);
}

  });
