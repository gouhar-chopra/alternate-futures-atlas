import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { listScenarios, deleteScenario, clearAll } from "@/lib/store";
import type { Scenario } from "@/lib/scenario";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved in this browser — ELSEWHERE" },
      { name: "description", content: "Revisit or delete scenarios stored locally on this device." },
      { property: "og:title", content: "Saved in this browser — ELSEWHERE" },
      { property: "og:description", content: "Scenarios stored locally on this device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Saved,
});

function Saved() {
  const [items, setItems] = useState<Scenario[]>([]);
  useEffect(() => setItems(listScenarios()), []);
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <span className="eyebrow">Recent sessions · stored locally</span>
      <h1 className="mt-4 text-5xl font-bold">Saved in this <em className="text-primary">browser.</em></h1>
      <p className="mt-4 text-muted-foreground">These live only on this device. Clearing them removes drafts, scenarios and notes.</p>
      {items.length === 0 ? (
        <div className="mt-12 border bg-ivory p-8">
          <p className="font-serif text-2xl">Nothing saved yet.</p>
          <div className="mt-6 flex gap-3"><Button asChild><Link to="/explore">Explore a What-If</Link></Button><Button asChild variant="outline"><Link to="/scenario/$id" params={{ id: "demo" }}>View the demo</Link></Button></div>
        </div>
      ) : (
        <>
          <ul className="mt-12 divide-y border-y">
            {items.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 py-6">
                <Link to="/scenario/$id" params={{ id: s.id }} className="group">
                  <p className="font-serif text-2xl group-hover:text-primary">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.decision_summary}</p>
                  <p className="eyebrow mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                </Link>
                <button className="text-sm underline" onClick={() => { deleteScenario(s.id); setItems(listScenarios()); }}>Delete</button>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-8" onClick={() => { if (window.confirm("Delete everything stored by ELSEWHERE in this browser?")) { clearAll(); setItems([]); } }}>Clear all local data</Button>
        </>
      )}
    </div>
  );
}
