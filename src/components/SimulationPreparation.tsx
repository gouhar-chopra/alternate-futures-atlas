import { useEffect, useState } from "react";

const STAGES = [
  "Understanding the decision",
  "Establishing the context",
  "Exploring plausible turning points",
  "Building the alternate timeline",
  "Preparing the interactive world",
];

export function SimulationPreparation() {
  const [stage, setStage] = useState(0);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 3500);
    const s = setTimeout(() => setSlow(true), 25000);
    return () => { clearInterval(t); clearTimeout(s); };
  }, []);
  return (
    <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-12 px-5 py-16 md:grid-cols-2" role="status" aria-live="polite">
      <svg viewBox="0 0 300 300" className="branch mx-auto w-full max-w-xs" aria-hidden>
        <g fill="none" strokeWidth="1.5">
          <path d="M150 290 L150 170" stroke="var(--ink)" />
          <path d="M150 170 C150 110 80 100 60 20" stroke="var(--primary)" style={{ animationDelay: ".6s" }} />
          <path d="M150 170 C150 110 220 100 240 20" stroke="var(--teal)" style={{ animationDelay: "1.2s" }} />
          <path d="M150 170 L150 20" stroke="var(--muted-foreground)" strokeDasharray="3 6" style={{ animationDelay: "1.8s" }} />
        </g>
        <circle cx="150" cy="170" r="5" fill="var(--primary)" />
      </svg>
      <div>
        <span className="eyebrow">Live AI generation in progress</span>
        <ol className="mt-6 space-y-4">
          {STAGES.map((s, i) => (
            <li key={s} className={`flex gap-4 transition-opacity duration-500 ${i <= stage ? "opacity-100" : "opacity-30"}`}>
              <span className="font-mono text-sm text-primary">0{i + 1}</span>
              <span className={`font-serif text-xl ${i === stage ? "italic" : ""}`}>{s}{i === stage ? "…" : ""}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted-foreground">
          {slow ? "This is taking a little longer than usual. Thanks for waiting — your input is safe." : "The stages above describe the story being written. No databases or markets are being queried."}
        </p>
      </div>
    </div>
  );
}
