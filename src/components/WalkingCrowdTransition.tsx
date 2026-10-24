import { useEffect, useId, useRef } from "react";
import walkers from "@/assets/city-walkers.png.asset.json";
import { CROWD_FIGURES } from "@/lib/crowd-geometry";

const IMG_W = 1920;
const IMG_H = 640;
const STEP = 1.1;

/** One tile of the crowd: each person's two legs are cut from the original art and swing from the hip in turn. */
function CrowdTile({ tile }: { tile: number }) {
  const uid = useId().replace(/:/g, "") + tile;
  return (
    <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} className="h-full w-auto shrink-0 overflow-visible" style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}>
      <defs>
        {CROWD_FIGURES.map((f, i) => (
          <g key={i}>
            <clipPath id={`${uid}s${i}`}><rect x={f.x0} y={0} width={f.x1 - f.x0} height={IMG_H} /></clipPath>
            <mask id={`${uid}b${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={IMG_W} height={IMG_H}>
              <rect x={0} y={0} width={IMG_W} height={IMG_H} fill="white" />
              <polygon points={f.rearHole} fill="black" />
              <polygon points={f.frontHole} fill="black" />
            </mask>
            <clipPath id={`${uid}r${i}`}><polygon points={f.rear} /></clipPath>
            <clipPath id={`${uid}f${i}`}><polygon points={f.front} /></clipPath>
          </g>
        ))}
      </defs>
      {CROWD_FIGURES.map((f, i) => {
        const delay = -((i * 0.37) % 1) * STEP;
        const origin = `${f.c}px ${f.cy}px`;
        const leg = (id: string, d: number) => (
          <g className="walker-leg" style={{ transformOrigin: origin, animationDelay: `${d}s`, ["--lift" as string]: `${-f.lift}px` }}>
            <image href={walkers.url} width={IMG_W} height={IMG_H} clipPath={`url(#${id})`} />
          </g>
        );
        return (
          <g key={i} className="walker-body" style={{ animationDelay: `${delay}s` }}>
            <g clipPath={`url(#${uid}s${i})`}>
              {leg(`${uid}r${i}`, delay - STEP / 2)}
              <image href={walkers.url} width={IMG_W} height={IMG_H} mask={`url(#${uid}b${i})`} />
            </g>
            {leg(`${uid}f${i}`, delay)}
          </g>
        );
      })}
    </svg>
  );
}

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
          {[0, 1, 2, 3].map((c) => <CrowdTile key={c} tile={c} />)}
        </div>
      </div>
      <span className="sr-only">An illustrated crowd of people walking from the familiar world into an imagined one.</span>
    </section>
  );
}
