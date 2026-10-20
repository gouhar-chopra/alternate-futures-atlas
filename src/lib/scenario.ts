import { z } from "zod";

export const LIFE_AREAS = [
  "Career",
  "Education",
  "Relationships",
  "Personal growth",
  "Location and lifestyle",
  "Entrepreneurship",
  "Other",
] as const;

export const STYLES = [
  { value: "balanced", label: "Balanced & realistic" },
  { value: "optimistic", label: "Optimistic" },
  { value: "unexpected", label: "Unexpected" },
  { value: "multiple", label: "Multiple outcomes" },
] as const;

export const HORIZONS = [1, 3, 5, 10] as const;

export const DecisionInputSchema = z.object({
  decision: z.string().trim().min(15, "Please describe the decision in a little more detail.").max(800),
  situation: z.string().trim().max(1500, "Please keep the situation under 1500 characters.").optional().default(""),
  year: z.string().trim().max(10).optional().default(""),
  location: z.string().trim().max(80).optional().default(""),
  area: z.string().trim().max(40).optional().default(""),
  hoped: z.string().trim().max(300).optional().default(""),
  constraints: z.string().trim().max(300).optional().default(""),
  curious: z.string().trim().max(300).optional().default(""),
  salary: z.string().trim().max(40).optional().default(""),
  style: z.enum(["balanced", "optimistic", "unexpected", "multiple"]).default("balanced"),
  horizon: z.coerce.number().int().min(1).max(10).default(3),
});
export type DecisionInput = z.infer<typeof DecisionInputSchema>;

const str = (fallback = "") => z.string().catch(fallback);
const num = z.coerce.number().finite().catch(0);

const AssumptionSchema = z.object({
  label: str("Assumption"),
  description: str(),
  source_type: z.enum(["user_provided", "model_assumption", "demo_assumption"]).catch("model_assumption"),
});

const EventSchema = z.object({
  time_label: str("—"),
  title: str("Untitled moment"),
  description: str(),
  possible_benefit: str(),
  possible_tradeoff: str(),
  assumptions: z.array(z.string()).catch([]),
  uncertainty: z.enum(["lower", "moderate", "high"]).catch("moderate"),
  uncertainty_note: str(),
});

const TimelineSchema = z.object({
  id: str("a"),
  title: str("An alternative possibility"),
  theme: str(),
  description: str(),
  events: z.array(EventSchema).min(1).max(12),
  benefits: z.array(z.string()).catch([]),
  tradeoffs: z.array(z.string()).catch([]),
  unknowns: z.array(z.string()).catch([]),
  financial_series: z.array(z.object({ period: str(), value: num })).catch([]),
});

const FinancialSchema = z.object({
  available: z.boolean().catch(false),
  currency: str("USD"),
  basis: z.enum(["user_provided", "demo_assumption"]).catch("demo_assumption"),
  assumptions: z.array(z.object({ label: str(), value: str() })).catch([]),
  metrics: z.array(z.object({ label: str(), value: num, unit: str(), note: str() })).catch([]),
  breakdown: z.array(z.object({ label: str(), value: num })).catch([]),
});

const FeedSchema = z.object({
  id: str(),
  date_label: str(),
  publication: str("Elsewhere Journal"),
  headline: str(),
  summary: str(),
  why_it_appears: str(),
});

const SocialSchema = z.object({
  profile_label: str("You, elsewhere"),
  date_label: str(),
  post: str(),
  fictional_reactions: num,
  why_it_appears: str(),
});

export const ScenarioSchema = z.object({
  id: str(),
  mode: z.enum(["live", "demo"]).catch("live"),
  created_at: str(),
  input: DecisionInputSchema.partial().catch({}),
  title: str("Another possibility"),
  decision_summary: str(),
  opening_narrative: str(),
  highlights: z
    .object({ changed: str(), opportunities: str(), tradeoffs: str() })
    .catch({ changed: "", opportunities: "", tradeoffs: "" }),
  assumptions: z.array(AssumptionSchema).catch([]),
  timelines: z.array(TimelineSchema).min(1).max(3),
  financial: FinancialSchema.catch({
    available: false,
    currency: "USD",
    basis: "demo_assumption",
    assumptions: [],
    metrics: [],
    breakdown: [],
  }),
  feed: z.array(FeedSchema).catch([]),
  social: z.array(SocialSchema).catch([]),
  reflection: z.object({ summary: str(), questions: z.array(z.string()).catch([]) }).catch({ summary: "", questions: [] }),
});
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Timeline = Scenario["timelines"][number];
export type TimelineEvent = Timeline["events"][number];

/** Extracts the first JSON object from model text and validates it. */
export function parseScenarioText(text: string): Scenario | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const raw = JSON.parse(text.slice(start, end + 1));
    const r = ScenarioSchema.safeParse({ id: "", created_at: "", ...raw });
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

export function formatMoney(v: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0, notation: Math.abs(v) >= 1e6 ? "compact" : "standard" }).format(v);
  } catch {
    return `${currency} ${Math.round(v).toLocaleString()}`;
  }
}
