import { useState, type KeyboardEvent } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { Scenario, Timeline } from "@/lib/scenario";
import { formatMoney } from "@/lib/scenario";
import { FictionLabel, Reveal } from "@/components/site-chrome";

const UNCERTAINTY = { lower: "Lower uncertainty", moderate: "Moderate uncertainty", high: "High uncertainty" } as const;
const TL_COLORS = ["var(--primary)", "var(--teal)", "var(--dusk)"];

export function TimelineExplorer({ timeline }: { timeline: Timeline }) {
  const [active, setActive] = useState(0);
  const ev = timeline.events[Math.min(active, timeline.events.length - 1)];
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); setActive((a) => Math.min(a + 1, timeline.events.length - 1)); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
  };
  const pct = timeline.events.length > 1 ? (active / (timeline.events.length - 1)) * 100 : 0;
  return (
    <div className="grid gap-10 md:grid-cols-[220px_1fr]">
      <div role="tablist" aria-label="Timeline events" aria-orientation="vertical" onKeyDown={onKey} className="relative flex gap-4 overflow-x-auto pb-2 md:flex-col md:gap-0 md:overflow-visible">
        <span aria-hidden className="absolute left-[5px] top-2 hidden w-px bg-border md:block" style={{ height: "calc(100% - 16px)" }} />
        <span aria-hidden className="absolute left-[5px] top-2 hidden w-px bg-primary transition-all duration-500 md:block" style={{ height: `calc(${pct}% - ${pct / 100 * 16}px)` }} />
        {timeline.events.map((e, i) => (
          <button
            key={i} role="tab" aria-selected={i === active} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`relative flex shrink-0 items-center gap-3 py-3 text-left text-sm ${i === active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className={`relative z-10 h-[11px] w-[11px] rounded-full border ${i <= active ? "border-primary bg-primary" : "border-border bg-ivory"}`} />
            <span className="font-mono">{e.time_label}</span>
          </button>
        ))}
      </div>
      <div key={active} className="fade-up grid gap-8 lg:grid-cols-[1fr_1.1fr]" role="tabpanel">
        <div>
          <p className="font-serif text-7xl text-primary md:text-8xl">{ev.time_label.replace(/[^0-9]/g, "") || ev.time_label}</p>
          <h3 className="mt-2 text-3xl">{ev.title}</h3>
          <span className="eyebrow mt-4 block">{UNCERTAINTY[ev.uncertainty]}</span>
          <p className="mt-1 text-sm text-muted-foreground">{ev.uncertainty_note}</p>
        </div>
        <div className="space-y-6">
          <span className="block h-0.5 w-20 bg-primary" />
          <p className="text-lg leading-relaxed">{ev.description}</p>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="border-l-2 border-teal pl-4"><dt className="eyebrow text-teal">Possible benefit</dt><dd className="mt-1">{ev.possible_benefit}</dd></div>
            <div className="border-l-2 border-primary pl-4"><dt className="eyebrow text-primary">Possible trade-off</dt><dd className="mt-1">{ev.possible_tradeoff}</dd></div>
          </dl>
          {ev.assumptions.length > 0 && <p className="text-sm text-muted-foreground"><span className="eyebrow">Assumes · </span>{ev.assumptions.join(" · ")}</p>}
          <div className="flex gap-3 text-sm">
            <button className="underline disabled:opacity-30" disabled={active === 0} onClick={() => setActive(active - 1)}>← Previous</button>
            <button className="underline disabled:opacity-30" disabled={active === timeline.events.length - 1} onClick={() => setActive(active + 1)}>Next →</button>
            <button className="ml-auto underline" onClick={() => setActive(0)}>Back to overview</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tooltipStyle = { background: "var(--ivory)", border: "1px solid var(--border)", borderRadius: 2, fontSize: 12 };

export function FinancialDashboard({ scenario, activeId }: { scenario: Scenario; activeId: string }) {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const f = scenario.financial;
  if (!f.available) {
    return (
      <div className="border bg-ivory p-8">
        <p className="font-serif text-2xl">A financial snapshot isn't meaningful for this scenario.</p>
        <p className="mt-2 text-muted-foreground">Rather than invent numbers, we've left this out. Add a hypothetical salary on the input page if you'd like an illustration.</p>
      </div>
    );
  }
  const periods = scenario.timelines[0]?.financial_series.map((p) => p.period) ?? [];
  const series = periods.map((period, i) => {
    const row: Record<string, string | number> = { period };
    scenario.timelines.forEach((t) => { row[t.id] = t.financial_series[i]?.value ?? 0; });
    return row;
  });
  const active = scenario.timelines.find((t) => t.id === activeId) ?? scenario.timelines[0];
  const fmt = (v: number) => formatMoney(v, f.currency);
  const pieColors = ["var(--primary-deep)", "var(--primary)", "var(--border)", "var(--teal)"];
  const total = f.breakdown.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FictionLabel>Illustrative estimate — not actual financial data</FictionLabel>
        <button onClick={() => setShowAssumptions(!showAssumptions)} aria-expanded={showAssumptions} className="border bg-ivory px-3 py-1.5 text-sm hover:border-primary">
          {showAssumptions ? "Hide" : "Show"} assumptions
        </button>
      </div>
      {showAssumptions && (
        <dl className="fade-up grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {f.assumptions.map((a) => (
            <div key={a.label} className="bg-ivory p-4"><dt className="eyebrow">{a.label}</dt><dd className="mt-1 text-sm">{a.value}</dd></div>
          ))}
          <div className="bg-ivory p-4 sm:col-span-2 lg:col-span-4 text-sm text-muted-foreground">
            Basis: {f.basis === "user_provided" ? "a hypothetical figure you supplied, extended with assumed rates" : "invented demo figures — not facts about you"}.
          </div>
        </dl>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="border bg-ivory p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Illustrative cumulative savings · {active.title}</p>
          </div>
          <p className="mt-2 font-serif text-4xl text-primary">{fmt(active.financial_series.at(-1)?.value ?? 0)}</p>
          <div className="mt-4 h-64" role="img" aria-label={`Line chart of illustrative savings: ${active.financial_series.map((p) => `${p.period} ${fmt(p.value)}`).join(", ")}`}>
            <ResponsiveContainer>
              <AreaChart data={active.financial_series} margin={{ left: 10, right: 10, top: 10 }}>
                <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity={0.25} /><stop offset="1" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={(v) => fmt(Number(v))} tick={{ fontSize: 11 }} width={90} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmt(Number(v))} />
                <Area type="monotone" dataKey="value" name="Illustrative savings" stroke="var(--primary)" strokeWidth={2} fill="url(#g)" dot={{ r: 4, fill: "var(--primary)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid gap-4">
          {f.metrics.slice(0, 3).map((m) => (
            <div key={m.label} className="border bg-ivory p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-1 font-serif text-2xl">{m.unit.length === 3 ? formatMoney(m.value, m.unit) : `${m.value.toLocaleString()} ${m.unit}`}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.note}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {f.breakdown.length > 0 && (
          <div className="border bg-ivory p-6">
            <p className="text-sm text-muted-foreground">Illustrative annual breakdown</p>
            <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
              <div className="h-44 w-44">
                <ResponsiveContainer>
                  <PieChart><Pie data={f.breakdown} dataKey="value" nameKey="label" innerRadius={0} outerRadius={80} stroke="var(--ivory)">
                    {f.breakdown.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie><Tooltip contentStyle={tooltipStyle} formatter={(v) => fmt(Number(v))} /></PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 space-y-2 text-sm">
                {f.breakdown.map((b, i) => (
                  <li key={b.label} className="flex items-center gap-2">
                    <span className="h-3 w-3" style={{ background: pieColors[i % pieColors.length] }} />
                    <span className="flex-1">{b.label}</span><span className="font-mono">{fmt(b.value)}</span>
                    <span className="w-10 text-right text-muted-foreground">{Math.round((b.value / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {scenario.timelines.length > 1 && (
          <div className="border bg-ivory p-6">
            <p className="text-sm text-muted-foreground">Comparing hypothetical timelines (same assumptions basis)</p>
            <div className="mt-4 h-52">
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tickFormatter={(v) => fmt(Number(v))} tick={{ fontSize: 11 }} width={90} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmt(Number(v))} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {scenario.timelines.map((t, i) => <Line key={t.id} dataKey={t.id} name={t.title} stroke={TL_COLORS[i]} strokeWidth={t.id === activeId ? 2.5 : 1.5} dot={false} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FictionalNewsFeed({ scenario }: { scenario: Scenario }) {
  const [why, setWhy] = useState<string | null>(null);
  return (
    <div>
      <div className="sticky top-16 z-10 mb-6 inline-block bg-background py-1"><FictionLabel tone="teal">Fictional feed — generated for this scenario</FictionLabel></div>
      <div className="grid gap-6 md:grid-cols-3">
        {scenario.feed.map((n, i) => (
          <Reveal key={n.id || i} delay={i * 80} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
            <article className="h-full border-t-2 border-ink pt-4">
              <p className="eyebrow">{n.publication} · {n.date_label} · fictional</p>
              <h3 className={`mt-3 ${i === 0 ? "text-3xl md:text-5xl" : "text-xl"}`}>{n.headline}</h3>
              <p className="mt-3 text-muted-foreground">{n.summary}</p>
              <button className="mt-3 text-sm text-primary underline" aria-expanded={why === n.id} onClick={() => setWhy(why === n.id ? null : n.id)}>Why am I seeing this?</button>
              {why === n.id && <p className="fade-up mt-2 border-l-2 border-teal pl-3 text-sm">{n.why_it_appears}</p>}
            </article>
          </Reveal>
        ))}
      </div>
      {scenario.social.length > 0 && (
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {scenario.social.map((s, i) => (
            <div key={i} className="border bg-ivory p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-mint font-serif italic text-teal">e</span>
                <div><p className="text-sm font-medium">{s.profile_label}</p><p className="eyebrow">{s.date_label} · simulated post</p></div>
              </div>
              <p className="mt-4 font-serif text-lg">{s.post}</p>
              <p className="mt-3 text-xs text-muted-foreground">{s.fictional_reactions} fictional reactions · {s.why_it_appears}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TradeoffsAnalysis({ timeline }: { timeline: Timeline }) {
  const cols = [
    { t: "What might have improved?", items: timeline.benefits, c: "border-teal text-teal" },
    { t: "What might have become harder?", items: timeline.tradeoffs, c: "border-primary text-primary" },
    { t: "What could not have been known?", items: timeline.unknowns, c: "border-dusk text-dusk" },
  ];
  return (
    <div className="grid gap-10 md:grid-cols-3">
      {cols.map((col, i) => (
        <Reveal key={col.t} delay={i * 100}>
          <h3 className={`border-t-2 pt-4 text-2xl ${col.c}`}>{col.t}</h3>
          <ul className="mt-4 space-y-3">{col.items.map((it) => <li key={it} className="border-b pb-3">{it}</li>)}</ul>
        </Reveal>
      ))}
    </div>
  );
}

export function ScenarioComparison({ scenario, activeId, onSelect }: { scenario: Scenario; activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-px border bg-border md:grid-cols-3">
      {scenario.timelines.map((t, i) => (
        <button key={t.id} onClick={() => onSelect(t.id)} aria-pressed={t.id === activeId} className={`p-6 text-left transition-colors ${t.id === activeId ? "bg-mint" : "bg-ivory hover:bg-muted"}`}>
          <p className="eyebrow">Timeline {String.fromCharCode(65 + i)}</p>
          <p className="mt-2 font-serif text-2xl">{t.title}</p>
          <p className="mt-1 text-sm text-teal">{t.theme}</p>
          <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
          <p className="mt-4 text-xs"><span className="text-teal">Gives:</span> {t.benefits.slice(0, 2).join(", ")}</p>
          <p className="text-xs"><span className="text-primary">Asks:</span> {t.tradeoffs.slice(0, 2).join(", ")}</p>
        </button>
      ))}
    </div>
  );
}
