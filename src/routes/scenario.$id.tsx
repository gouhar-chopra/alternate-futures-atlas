import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FictionLabel, Reveal } from "@/components/site-chrome";
import { TimelineExplorer, FinancialDashboard, FictionalNewsFeed, TradeoffsAnalysis, ScenarioComparison } from "@/components/scenario-sections";
import { getScenario, getNote, saveNote, deleteScenario } from "@/lib/store";
import type { Scenario } from "@/lib/scenario";

export const Route = createFileRoute("/scenario/$id")({
  head: () => ({
    meta: [
      { title: "Your alternate timeline — ELSEWHERE" },
      { name: "description", content: "An explicitly fictional alternate timeline, with assumptions, trade-offs and a closing reflection." },
      { property: "og:title", content: "Your alternate timeline — ELSEWHERE" },
      { property: "og:description", content: "In another version of your story…" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ScenarioPage,
});

function ScenarioPage() {
  const { id } = Route.useParams();
  const [scenario, setScenario] = useState<Scenario | null | undefined>(undefined);
  useEffect(() => setScenario(getScenario(id)), [id]);

  if (scenario === undefined) return <div className="min-h-[60vh]" />;
  if (!scenario) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <span className="eyebrow">Timeline not found</span>
        <h1 className="mt-4 text-4xl">This possibility isn't stored in this browser.</h1>
        <p className="mt-4 text-muted-foreground">Scenarios are saved only on the device where they were created, and may have been cleared.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild><Link to="/explore">Explore a What-If</Link></Button>
          <Button asChild variant="outline"><Link to="/scenario/$id" params={{ id: "demo" }}>See the demo</Link></Button>
        </div>
      </div>
    );
  }
  return <ScenarioView scenario={scenario} />;
}

function ScenarioView({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(scenario.timelines[0].id);
  const [note, setNote] = useState("");
  const [closed, setClosed] = useState(false);
  useEffect(() => setNote(getNote(scenario.id)), [scenario.id]);
  const timeline = scenario.timelines.find((t) => t.id === activeId) ?? scenario.timelines[0];
  const idx = scenario.timelines.indexOf(timeline);
  const isDemo = scenario.mode === "demo";

  if (closed) {
    return (
      <div className="fade-up mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <span className="eyebrow">Back in the present</span>
        <h1 className="mt-6 text-4xl md:text-6xl">The present remains <em className="text-primary">yours.</em></h1>
        <p className="mt-6 text-muted-foreground">Take a breath. Whatever you noticed is yours to keep.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild><Link to="/">Return home</Link></Button>
          <Button variant="outline" onClick={() => setClosed(false)}>Review this timeline</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isDemo && (
        <div className="sticky top-[65px] z-30 bg-ink py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">
          Demo scenario · fixed example data · no live AI call
        </div>
      )}

      {/* Reveal */}
      <section className="fade-up bg-mint">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal/30 pb-4">
            <span className="eyebrow text-teal">Timeline 0{idx + 1} — An alternative possibility</span>
            <FictionLabel />
          </div>
          <p className="eyebrow mt-10">The decision · {scenario.decision_summary}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">In another version of <em className="text-teal">your story…</em></h1>
          <p className="mt-8 max-w-3xl font-serif text-xl leading-relaxed md:text-2xl">{scenario.opening_narrative}</p>
          <div className="mt-12 grid gap-px border border-teal/30 bg-teal/30 md:grid-cols-3">
            {[["What might have changed", scenario.highlights.changed], ["New opportunities", scenario.highlights.opportunities], ["Trade-offs that might emerge", scenario.highlights.tradeoffs]].map(([t, d]) => (
              <div key={t} className="bg-mint p-6"><p className="eyebrow text-teal">{t}</p><p className="mt-2">{d}</p></div>
            ))}
          </div>
          <details className="mt-8 border-t border-teal/30 pt-4">
            <summary className="cursor-pointer text-sm text-teal">Assumptions used to build this scenario ({scenario.assumptions.length})</summary>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {scenario.assumptions.map((a) => (
                <li key={a.label} className="text-sm"><span className="font-medium">{a.label}</span> <span className="eyebrow">· {a.source_type.replace("_", " ")}</span><br />{a.description}</li>
              ))}
            </ul>
          </details>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="#timeline">Explore This Timeline</a></Button>
            {scenario.timelines.length > 1 && <Button asChild size="lg" variant="outline"><a href="#compare">Compare Other Possibilities</a></Button>}
            <Button asChild size="lg" variant="ghost"><Link to="/explore">Return to My Decision</Link></Button>
          </div>
        </div>
      </section>

      {scenario.timelines.length > 1 && (
        <section id="compare" className="mx-auto max-w-7xl scroll-mt-28 px-5 pt-20 md:px-10">
          <span className="eyebrow">Multiple possibilities · no timeline “wins”</span>
          <h2 className="mt-3 text-3xl md:text-4xl">Three directions from the same moment.</h2>
          <div className="mt-8"><ScenarioComparison scenario={scenario} activeId={activeId} onSelect={setActiveId} /></div>
        </section>
      )}

      <section id="timeline" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 md:px-10">
        <Reveal>
          <span className="eyebrow">Step by step · {timeline.title}</span>
          <h2 className="mt-3 text-4xl md:text-5xl">How it <em className="text-primary">might</em> have unfolded.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Use the markers or your arrow keys. Nothing here was predetermined.</p>
        </Reveal>
        <div className="mt-12"><TimelineExplorer key={timeline.id} timeline={timeline} /></div>
      </section>

      <section className="paper-dots border-y">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <span className="eyebrow">Financial snapshot</span>
          <h2 className="mt-3 text-4xl md:text-5xl">A financial snapshot from another <em className="text-primary">possible</em> life.</h2>
          <p className="mb-8 mt-3 text-muted-foreground">What might your finances look like under the assumptions of this imagined timeline?</p>
          <FinancialDashboard scenario={scenario} activeId={activeId} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <span className="eyebrow">The Elsewhere Journal</span>
        <h2 className="mt-3 text-4xl md:text-5xl">Headlines from a life that <em className="text-primary">might</em> have been.</h2>
        <p className="mb-8 mt-3 text-muted-foreground">In this imagined timeline, ordinary days could have brought different opportunities, setbacks, and surprises.</p>
        <FictionalNewsFeed scenario={scenario} />
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <h2 className="mb-12 max-w-3xl text-4xl md:text-5xl">Every path gives something. Every path <em className="text-primary">asks something in return.</em></h2>
          <TradeoffsAnalysis timeline={timeline} />
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-24 md:py-32">
          <span className="eyebrow">Reflection</span>
          <h2 className="mt-4 text-4xl leading-tight md:text-6xl">Your life is not a failed version of <em className="text-primary">another possibility.</em></h2>
          <div className="mt-8 space-y-4 font-serif text-xl leading-relaxed">
            <p>The path you did not take remains unknowable. It may have held opportunities you would have loved, difficulties you could not have predicted, and moments that would have changed you in ways you cannot fully imagine.</p>
            <p className="text-muted-foreground">{scenario.reflection.summary}</p>
            <p>Every path contains uncertainty, and every present moment contains choices that are still available.</p>
          </div>
          <ol className="mt-12 space-y-4 border-t pt-8">
            {scenario.reflection.questions.map((q, i) => <li key={q} className="flex gap-4"><span className="font-mono text-primary">0{i + 1}</span><span className="font-serif text-lg italic">{q}</span></li>)}
          </ol>
          <label htmlFor="note" className="eyebrow mt-10 block">An optional takeaway · saved only in this browser</label>
          <Textarea id="note" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} onBlur={() => { saveNote(scenario.id, note); }} className="mt-3 min-h-28 bg-ivory" placeholder="One thing I noticed…" />
          <p className="mt-16 text-center font-serif text-2xl italic md:text-3xl">The alternative remains a possibility. <span className="text-primary">The present remains yours.</span></p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => { saveNote(scenario.id, note); setClosed(true); window.scrollTo({ top: 0 }); }}>Return to the Present</Button>
            <Button asChild size="lg" variant="outline"><Link to="/explore">Explore Another What-If</Link></Button>
            <Button size="lg" variant="ghost" onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}>Review This Timeline</Button>
          </div>
          {!isDemo && (
            <p className="mt-8 text-center text-xs text-muted-foreground">
              This scenario is stored in your browser only.{" "}
              <button className="underline" onClick={() => { deleteScenario(scenario.id); toast("Scenario deleted from this browser."); navigate({ to: "/saved" }); }}>Delete it</button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
