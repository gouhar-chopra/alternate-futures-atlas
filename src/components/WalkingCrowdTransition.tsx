import { useEffect, useRef } from "react";
import walkers from "@/assets/city-walkers.png.asset.json";

const IMG_W = 1920;
const IMG_H = 640;
/** Hip line as a fraction of image height; legs below it sway from this joint. */
const HIP = 0.57;
const STEP = 1.1;
/** Horizontal cut points between the people in the original drawing. */
const CUTS = [0, 165, 313, 464, 620, 783, 930, 1073, 1217, 1355, 1484, 1735, 1920];

/** Cream-to-mint scroll transition with a continuously walking monochrome crowd. */
export function WalkingCrowdTransition() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.4)));
      el.style.setProperty("--split", `${100 - p * 55}%`);
      el.style.setProperty("--text", `${Math.min(1, p * 1.8)}`);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      ref={ref}
      id="experience"
      aria-labelledby="crowd-heading"
      className="relative overflow-hidden border-y"
      style={{ background: "linear-gradient(90deg, var(--paper) 0 var(--split, 100%), var(--mint) var(--split, 100%) 100%)" }}
    >
      <div className="relative mx-auto max-w-7xl px-5 pt-20 md:px-10 md:pt-28">
        <div className="flex justify-between">
          <span className="eyebrow">The life you know</span>
          <span className="eyebrow hidden md:inline">The moment of choice</span>
          <span className="eyebrow text-teal">The path not taken</span>
        </div>
        <div className="mx-auto mt-16 max-w-3xl text-center" style={{ opacity: "var(--text, 1)" }}>
          <div aria-hidden className="mx-auto mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-primary" />
            <span className="h-3 w-3 rotate-45 border border-primary bg-background" />
            <span className="h-px w-16 bg-teal" />
          </div>
          <h2 id="crowd-heading" className="text-4xl leading-tight md:text-6xl">
            Somewhere, another version of this story <em className="text-primary">begins.</em>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">A different choice. A different chain of events. A different possibility.</p>
          <p className="eyebrow mt-3">Not a prediction. Not a replacement. Just another possibility.</p>
        </div>
      </div>
      <div className="relative mt-14 h-[150px] sm:h-[200px] md:h-[260px]" aria-hidden>
        <div className="crowd-track absolute bottom-0 left-0 h-full mix-blend-multiply" style={{ animationDirection: "reverse" }}>
          {[0, 1, 2, 3].map((c) => (
            <div key={c} className="relative h-full" style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}>
              {CUTS.slice(0, -1).map((a, i) => {
                const b = CUTS[i + 1]!;
                const w = b - a;
                const delay = `${-((i * 0.37) % 1) * STEP}s`;
                const img = { left: `${(-a / w) * 100}%`, width: `${(IMG_W / w) * 100}%` };
                return (
                  <div key={i} className="walker-strip absolute top-0 h-full" style={{ left: `${(a / IMG_W) * 100}%`, width: `${(w / IMG_W) * 100}%`, animationDelay: delay }}>
                    <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: `${HIP * 100}%` }}>
                      <img src={walkers.url} alt="" className="absolute top-0 max-w-none" style={{ ...img, height: `${100 / HIP}%` }} />
                    </div>
                    <div className="walker-legs absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: `${HIP * 100}%`, animationDelay: delay }}>
                      <img src={walkers.url} alt="" className="absolute bottom-0 max-w-none" style={{ ...img, height: `${100 / (1 - HIP)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">An illustrated crowd of people walking from the familiar world into an imagined one.</span>
    </section>
  );
}
