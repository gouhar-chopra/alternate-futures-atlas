/** One articulated, monochrome walking figure. Limbs animate via CSS (see .walker in styles.css). */
export type WalkerLook = { coat: "short" | "long" | "dress"; hat?: boolean; bun?: boolean; bag?: boolean; scale: number; tone: number };

const HIP = { x: 20, y: 62 };
const SHOULDER = { x: 20, y: 27 };

function Leg({ cls }: { cls: string }) {
  return (
    <g className={`w-thigh ${cls}`}>
      <line x1={HIP.x} y1={HIP.y} x2={HIP.x} y2={88} />
      <g className={`w-shin ${cls}`}>
        <line x1={HIP.x} y1={88} x2={HIP.x} y2={113} />
        <path d="M17 112 h10 a3 3 0 0 1 0 5 h-10 z" stroke="none" />
      </g>
    </g>
  );
}
function Arm({ cls, bag }: { cls: string; bag?: boolean }) {
  return (
    <g className={`w-arm ${cls}`}>
      <line x1={SHOULDER.x} y1={SHOULDER.y} x2={SHOULDER.x} y2={46} />
      <g className={`w-fore ${cls}`}>
        <line x1={SHOULDER.x} y1={46} x2={SHOULDER.x + 2} y2={63} />
        {bag && <rect x={16} y={62} width={12} height={10} rx={2} stroke="none" />}
      </g>
    </g>
  );
}

export function Walker({ look, duration, delay }: { look: WalkerLook; duration: number; delay: number }) {
  const w = 40 * look.scale;
  const h = 120 * look.scale;
  return (
    <svg
      viewBox="0 0 40 120"
      width={w}
      height={h}
      className="walker shrink-0 overflow-visible"
      style={{ ["--d" as string]: `${duration}s`, ["--delay" as string]: `${delay}s`, opacity: look.tone }}
      aria-hidden
    >
      <g className="w-body" stroke="currentColor" fill="currentColor" strokeWidth={6} strokeLinecap="round">
        <g opacity={0.72}><Arm cls="back" /><Leg cls="back" /></g>
        {/* torso / clothing */}
        {look.coat === "dress" ? (
          <path d="M14 24 h12 l7 50 h-26 z" stroke="none" />
        ) : (
          <rect x={13} y={23} width={14} height={look.coat === "long" ? 52 : 42} rx={4} stroke="none" />
        )}
        <line x1={20} y1={18} x2={20} y2={24} strokeWidth={5} />
        <circle cx={21} cy={12} r={7} stroke="none" />
        {look.bun && <circle cx={14} cy={8} r={3.5} stroke="none" />}
        {look.hat && <path d="M12 8 h18 v-3 h-4 v-5 h-10 v5 h-4 z" stroke="none" />}
        <Leg cls="front" />
        <Arm cls="front" bag={look.bag} />
      </g>
    </svg>
  );
}

const COATS: WalkerLook["coat"][] = ["short", "long", "dress", "short", "long"];
/** Deterministic crowd so SSR and client render the same figures. */
export function makeCrowd(n: number, seed = 1) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, (_, i) => ({
    look: {
      coat: COATS[Math.floor(rnd() * COATS.length)],
      hat: rnd() > 0.8,
      bun: rnd() > 0.7,
      bag: rnd() > 0.7,
      scale: 0.85 + rnd() * 0.3,
      tone: 0.85 + rnd() * 0.15,
    } satisfies WalkerLook,
    duration: +(0.95 + rnd() * 0.3).toFixed(2),
    delay: -+(rnd() * 1.2).toFixed(2),
    gap: 14 + Math.round(rnd() * 40),
    key: i,
  }));
}
