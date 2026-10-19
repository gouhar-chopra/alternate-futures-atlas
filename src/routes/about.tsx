import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Simulation — ELSEWHERE" },
      { name: "description", content: "How ELSEWHERE builds fictional alternate timelines, and what it can and cannot know." },
      { property: "og:title", content: "About the Simulation — ELSEWHERE" },
      { property: "og:description", content: "Imagination, with its limits made clear." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const ITEMS = [
  ["What it is", "An AI language model writes a story from your description, using conditional language and labelled assumptions. The result is checked against a strict structure before it is shown."],
  ["What it is not", "Not a prediction, a calculation of probabilities, or a view into a real parallel world. No economic databases, markets or news sources are queried."],
  ["Financial figures", "Shown only when money is relevant. If you supply a hypothetical salary we extend it with stated assumed rates; otherwise figures are invented round demo numbers, labelled as such."],
  ["Headlines and posts", "Entirely fictional, attributed to invented publications such as the Elsewhere Journal. They never quote real people."],
  ["Uncertainty", "Each event carries a plain-language uncertainty note (lower, moderate, high). These are qualitative, scenario-based labels — not statistics."],
  ["Demo mode", "The demo uses a fixed, deterministic example. It never calls the AI service and is marked “Demo scenario” throughout."],
  ["Wellbeing", "ELSEWHERE is a reflective tool, not therapy, and does not diagnose or treat anything. If thinking about the past feels heavy, consider talking to someone you trust."],
];

function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <span className="eyebrow">Simulation methodology</span>
      <h1 className="mt-4 text-5xl font-bold md:text-6xl">About the <em className="text-primary">simulation.</em></h1>
      <dl className="mt-14 divide-y border-y">
        {ITEMS.map(([t, d]) => (
          <div key={t} className="grid gap-3 py-8 md:grid-cols-[220px_1fr]">
            <dt className="font-serif text-2xl">{t}</dt>
            <dd className="text-lg text-muted-foreground">{d}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-12 flex gap-3">
        <Button asChild><Link to="/explore">Explore a What-If</Link></Button>
        <Button asChild variant="outline"><Link to="/scenario/$id" params={{ id: "demo" }}>View the demo</Link></Button>
      </div>
    </div>
  );
}
