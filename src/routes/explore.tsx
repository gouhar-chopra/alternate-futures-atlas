import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DecisionInputSchema, LIFE_AREAS, STYLES, HORIZONS, type DecisionInput } from "@/lib/scenario";
import { getDraft, saveDraft, saveScenario } from "@/lib/store";
import { simulateScenario, type SimulateResult } from "@/lib/simulate.functions";
import { SimulationPreparation } from "@/components/SimulationPreparation";

export const Route = createFileRoute("/explore")({
  validateSearch: z.object({ example: z.string().max(400).optional() }),
  head: () => ({
    meta: [
      { title: "Revisit a decision — ELSEWHERE" },
      { name: "description", content: "Describe a past decision and step into a clearly fictional alternate timeline." },
      { property: "og:title", content: "Revisit a decision — ELSEWHERE" },
      { property: "og:description", content: "Which moment would you like to revisit?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Explore,
});

const EMPTY: DecisionInput = { decision: "", year: "", location: "", area: "", hoped: "", constraints: "", curious: "", salary: "", style: "balanced", horizon: 3 };
const SUGGESTIONS = [
  "What if I had chosen design instead of engineering?",
  "What if I had started my business earlier?",
  "What if I had moved to another city for college?",
];

function Explore() {
  const { example } = Route.useSearch();
  const navigate = useNavigate();
  const simulate = useServerFn(simulateScenario);
  const [form, setForm] = useState<DecisionInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [failure, setFailure] = useState<Extract<SimulateResult, { ok: false }> | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const d = { ...EMPTY, ...(getDraft() ?? {}) };
    if (example && example !== d.decision) {
      if (!d.decision.trim() || window.confirm("Replace your current draft with this example?")) d.decision = example;
    }
    setForm(d);
    setLoaded(true);
  }, [example]);

  useEffect(() => { if (loaded) saveDraft(form); }, [form, loaded]);

  const set = <K extends keyof DecisionInput>(k: K, v: DecisionInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const pick = (text: string) => {
    if (form.decision.trim() && form.decision !== text && !window.confirm("Replace your current text with this example?")) return;
    set("decision", text);
  };

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    const parsed = DecisionInputSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check your entry."); return; }
    setError(null); setFailure(null); setBusy(true);
    try {
      const res = await simulate({ data: parsed.data });
      if (res.ok) { saveScenario(res.scenario); navigate({ to: "/scenario/$id", params: { id: res.scenario.id } }); return; }
      setFailure(res);
    } catch {
      setFailure({ ok: false, code: "network", message: "We couldn't reach the simulation service. Your decision is saved — please try again." });
    }
    setBusy(false);
  }

  if (busy) return <SimulationPreparation />;

  const field = "bg-ivory rounded-sm";
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <span className="eyebrow">The decision</span>
      <h1 className="mt-4 text-4xl font-bold md:text-6xl">Which moment would you like to <em className="text-primary">revisit?</em></h1>
      <p className="mt-4 text-lg text-muted-foreground">Tell us about a decision, a crossroads, or a path you sometimes wonder about.</p>

      {failure && (
        <div role="alert" className="mt-8 border border-primary/40 bg-ivory p-5">
          <p className="font-medium text-primary">{failure.message}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => submit()}>Try again</Button>
            <Button asChild variant="outline"><Link to="/scenario/$id" params={{ id: "demo" }}>Open the demo scenario</Link></Button>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-10 space-y-10" noValidate>
        <div>
          <Label htmlFor="decision" className="eyebrow">Your what-if *</Label>
          <Textarea
            id="decision"
            value={form.decision}
            onChange={(e) => set("decision", e.target.value.slice(0, 800))}
            placeholder="What if I had accepted that job offer three years ago and moved to Bengaluru?"
            className={`${field} mt-3 min-h-40 p-5 font-serif text-xl md:text-2xl`}
            aria-invalid={!!error}
            aria-describedby="decision-help"
          />
          <div id="decision-help" className="mt-2 flex justify-between text-sm">
            <span className={error ? "text-primary" : "text-muted-foreground"}>{error ?? "Avoid names or identifying details of other people."}</span>
            <span className="font-mono text-muted-foreground">{form.decision.length}/800</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button type="button" key={s} onClick={() => pick(s)} className="border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">{s}</button>
            ))}
          </div>
        </div>

        <fieldset className="border-t pt-8">
          <legend className="eyebrow pr-3">Optional context</legend>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div><Label htmlFor="year">Approximate year</Label><Input id="year" inputMode="numeric" maxLength={10} className={`${field} mt-2`} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2021" /></div>
            <div><Label htmlFor="loc">Relevant location (city or region)</Label><Input id="loc" maxLength={80} className={`${field} mt-2`} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Bengaluru" /></div>
            <div>
              <Label htmlFor="area">Life area</Label>
              <select id="area" className={`${field} mt-2 h-9 w-full border px-3 text-sm`} value={form.area} onChange={(e) => set("area", e.target.value)}>
                <option value="">Choose…</option>
                {LIFE_AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div><Label htmlFor="salary">Hypothetical starting salary (optional)</Label><Input id="salary" maxLength={40} className={`${field} mt-2`} value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="e.g. ₹18 lakh / year" /></div>
            <div className="sm:col-span-2"><Label htmlFor="hoped">What you hoped to achieve</Label><Input id="hoped" maxLength={300} className={`${field} mt-2`} value={form.hoped} onChange={(e) => set("hoped", e.target.value)} /></div>
            <div><Label htmlFor="con">Constraints at the time</Label><Input id="con" maxLength={300} className={`${field} mt-2`} value={form.constraints} onChange={(e) => set("constraints", e.target.value)} /></div>
            <div><Label htmlFor="cur">What you're most curious about now</Label><Input id="cur" maxLength={300} className={`${field} mt-2`} value={form.curious} onChange={(e) => set("curious", e.target.value)} /></div>
          </div>
        </fieldset>

        <fieldset className="border-t pt-8">
          <legend className="eyebrow pr-3">Type of exploration</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-4" role="radiogroup">
            {STYLES.map((s) => (
              <label key={s.value} className={`cursor-pointer border p-4 text-sm transition-colors ${form.style === s.value ? "border-primary bg-primary text-primary-foreground" : "bg-ivory hover:border-primary"}`}>
                <input type="radio" name="style" className="sr-only" checked={form.style === s.value} onChange={() => set("style", s.value)} />
                {s.label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">These are narrative styles, not confidence settings.</p>
          <p className="eyebrow mt-8">How far into the future?</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
            {HORIZONS.map((h) => (
              <label key={h} className={`cursor-pointer border px-4 py-2 text-sm ${form.horizon === h ? "border-teal bg-mint text-teal" : "bg-ivory"}`}>
                <input type="radio" name="horizon" className="sr-only" checked={form.horizon === h} onChange={() => set("horizon", h)} />
                {h} {h === 1 ? "year" : "years"}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-xs text-muted-foreground">Your draft stays in this browser. When you submit, the text is sent to an AI model to write the scenario. <Link to="/privacy" className="underline">Privacy</Link></p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="ghost"><Link to="/scenario/$id" params={{ id: "demo" }}>View demo instead</Link></Button>
            <Button type="submit" size="lg" disabled={busy}>Enter the Alternate Timeline</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
