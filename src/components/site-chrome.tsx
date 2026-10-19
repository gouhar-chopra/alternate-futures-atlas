import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Wordmark() {
  return <span className="font-serif text-xl font-bold italic tracking-tight">ELSEWHERE</span>;
}

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const links = (
    <>
      <Link to="/" hash="experience" className="hover:text-primary" onClick={() => setOpen(false)}>The Experience</Link>
      <Link to="/" hash="how" className="hover:text-primary" onClick={() => setOpen(false)}>How It Works</Link>
      <Link to="/about" className="hover:text-primary" activeProps={{ className: "text-primary" }} onClick={() => setOpen(false)}>About the Simulation</Link>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10" aria-label="Main">
        <Link to="/" aria-label="ELSEWHERE home"><Wordmark /></Link>
        <div className="hidden items-center gap-8 text-sm md:flex">{links}</div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/explore">Explore a Possibility</Link></Button>
          <button className="p-2 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="flex flex-col gap-4 border-t px-5 py-5 text-base md:hidden">
          {links}
          <Link to="/explore" className="text-primary" onClick={() => setOpen(false)}>Explore a Possibility →</Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[2fr_1fr_1fr] md:px-10">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-sm text-sm text-muted-foreground">A reflective space for exploring plausible, explicitly fictional alternate timelines of past decisions.</p>
          <p className="eyebrow">All alternate futures shown here are hypothetical.</p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link to="/explore" className="hover:text-primary">Explore</Link></li>
          <li><Link to="/" hash="how" className="hover:text-primary">How It Works</Link></li>
          <li><Link to="/about" className="hover:text-primary">Simulation Methodology</Link></li>
        </ul>
        <ul className="space-y-2 text-sm">
          <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
          <li><Link to="/privacy" hash="terms" className="hover:text-primary">Terms</Link></li>
          <li><Link to="/saved" className="hover:text-primary">Saved in this browser</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function FictionLabel({ children = "Fictional scenario — not a prediction", tone = "primary" }: { children?: ReactNode; tone?: "primary" | "teal" }) {
  return (
    <span className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] ${tone === "teal" ? "border-teal/40 text-teal" : "border-primary/40 text-primary"}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${tone === "teal" ? "bg-teal" : "bg-primary"}`} />
      {children}
    </span>
  );
}
