import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal, FictionLabel } from "@/components/site-chrome";
import { WalkingCrowdTransition } from "@/components/WalkingCrowdTransition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ELSEWHERE — Explore the Life That Could Have Been" },
      { name: "description", content: "Every choice creates a thousand almost-lives. Explore transparent, fictional alternate timelines of a past decision." },
      { property: "og:title", content: "ELSEWHERE — Explore the Life That Could Have Been" },
      { property: "og:description", content: "Step into the life that could have been. Return with a new perspective." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const EXAMPLES = [
  { q: "What if I had accepted that offer?", label: "Career", text: "What if I had accepted the job offer in another city instead of staying where I was?" },
  { q: "What if I had taken the leap?", label: "Entrepreneurship", text: "What if I had left my job to start my own business five years earlier?" },
  { q: "What if I had chosen a different path?", label: "Education", text: "What if I had chosen design instead of engineering for my degree?" },
];

function BranchArt() {
  return (
    <svg viewBox="0 0 400 420" className="branch h-full w-full" role="img" aria-label="An abstract branching timeline">
      <g fill="none" strokeWidth="1.5" strokeLinecap="round">
        <path d="M200 410 L200 250" stroke="var(--ink)" />
        <path d="M200 250 C200 180 120 170 90 60" stroke="var(--ink)" />
        <path d="M200 250 C200 170 290 160 320 40" stroke="var(--primary)" style={{ animationDelay: ".4s" }} />
        <path d="M200 250 C210 200 210 140 205 20" stroke="var(--teal)" strokeDasharray="4 6" style={{ animationDelay: ".8s" }} />
        <path d="M150 160 C130 140 60 140 30 120" stroke="var(--muted-foreground)" style={{ animationDelay: "1.2s" }} />
        <path d="M268 150 C300 140 350 150 380 130" stroke="var(--teal)" style={{ animationDelay: "1.4s" }} />
      </g>
      <circle cx="200" cy="250" r="6" fill="var(--primary)" />
      {[[90, 60], [320, 40], [205, 20], [30, 120], [380, 130]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--ivory)" stroke="var(--ink)" />
      ))}
      <text x="214" y="262" className="fill-muted-foreground font-mono" fontSize="10" letterSpacing="2">THE DECISION</text>
    </svg>
  );
}

function Landing() {
  return (
    <>
      <section className="paper-dots border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr] md:px-10 md:py-24">
          <div className="fade-up">
            <div className="flex justify-between border-b pb-4">
              <span className="eyebrow">An experiment in alternate lives</span>
              <span className="eyebrow hidden sm:inline">Timeline 00</span>
            </div>
            <h1 className="mt-10 text-5xl font-bold leading-[1.02] md:text-7xl lg:text-8xl">
              What if your life had taken <em className="text-primary">another turn?</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Every decision closes a door and opens another. Explore the possibilities that might have unfolded, and discover what they can teach you about the life you live today.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/explore">Explore a What-If</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/" hash="how">Discover How It Works</Link></Button>
            </div>
            <p className="mt-10 font-serif text-lg italic">“Every choice creates a thousand almost-lives.”</p>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm md:max-w-none"><BranchArt /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <span className="eyebrow">I. The central question</span>
          <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl">The lives we imagine but <em className="text-primary">never lived.</em></h2>
        </Reveal>
        <div className="mt-14 divide-y border-y">
          {EXAMPLES.map((e, i) => (
            <Reveal key={e.q} delay={i * 100}>
              <Link
                to="/explore"
                search={{ example: e.text }}
                className={`group grid items-baseline gap-4 py-8 md:grid-cols-[80px_1fr_160px] ${i === 1 ? "md:pl-24" : i === 2 ? "md:pl-48" : ""}`}
              >
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                <span className="font-serif text-2xl italic transition-colors group-hover:text-primary md:text-4xl">{e.q}</span>
                <span className="eyebrow md:text-right">{e.label} · Use this →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <WalkingCrowdTransition />

      <section id="how" className="scroll-mt-20 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <span className="eyebrow">II. How it works</span>
          <div className="mt-12 grid gap-0 border-t md:grid-cols-3">
            {[
              ["01", "The Decision", "Tell us about the moment you keep wondering about."],
              ["02", "The Possibility", "Explore a plausible alternate timeline built from your context and clearly stated assumptions."],
              ["03", "The Perspective", "Return to the present with a wider view of the possibilities and trade-offs."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 120} className="border-b py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 md:first:pl-0">
                <span className="font-serif text-6xl text-primary">{n}</span>
                <h3 className="mt-6 text-2xl">{t}</h3>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28">
        <Reveal>
          <span className="eyebrow">III. Transparency</span>
          <h2 className="mt-4 text-4xl md:text-5xl">Imagination, with its <em className="text-primary">limits</em> made clear.</h2>
          <p className="mt-6 text-muted-foreground">
            Alternative outcomes are speculative. ELSEWHERE does not know what would actually have happened, and it has no access to a real parallel universe. Every scenario is a story built from what you share and openly stated assumptions.
          </p>
          <div className="mt-6"><FictionLabel /></div>
        </Reveal>
        <Reveal delay={150}>
          <dl className="divide-y border-y">
            {[
              ["Known information", "What you tell us: the decision, the year, the place, what you hoped for."],
              ["Assumptions", "Stated plainly and labelled — whether you supplied them, the model chose them, or they are demo figures."],
              ["Generated narrative", "An AI-written story using conditional language. A possibility, never a forecast."],
            ].map(([t, d]) => (
              <div key={t} className="grid gap-2 py-6 sm:grid-cols-[180px_1fr]">
                <dt className="font-mono text-xs uppercase tracking-widest text-primary">{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="bg-mint">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center md:py-32">
          <span className="eyebrow text-teal">The path not taken</span>
          <h2 className="mt-6 text-4xl md:text-6xl">One decision. <em className="text-teal">Another possible world.</em></h2>
          <Button asChild size="lg" className="mt-10"><Link to="/explore">Explore Your What-If</Link></Button>
        </div>
      </section>
    </>
  );
}
