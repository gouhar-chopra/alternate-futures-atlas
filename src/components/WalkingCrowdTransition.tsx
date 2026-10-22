import { useEffect, useRef } from "react";
import crowdB from "@/assets/crowd-b.jpg";
import crowdC from "@/assets/crowd-c.jpg";

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
        <div className="crowd-track absolute bottom-0 left-0 h-full" style={{ animationDirection: "reverse" }}>
          {[0, 1].map((c) => (
            <div key={c} className="relative flex h-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="crowd-frames relative h-full">
                  <img src={crowdB} alt="" className="h-full w-auto mix-blend-multiply" />
                  <img src={crowdC} alt="" className="crowd-frame-alt absolute inset-0 h-full w-auto mix-blend-multiply" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">An illustrated crowd of people walking from the familiar world into an imagined one.</span>
    </section>
  );
}
