import { motion, useMotionValue, useSpring, useReducedMotion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, Play, Activity, GitBranch, Users, TrendingUp, CheckCircle2, ChevronDown } from "lucide-react";
import { Button, CountUp, LiveDot, MonoLabel } from "./ui";
import { PipelineCanvas } from "@/components/backgrounds/PipelineCanvas";
import { VantaHalo } from "@/components/backgrounds/VantaHalo";
import { NexusBoot } from "@/components/hero/NexusBoot";
import { heroStats, liveMatches } from "@/lib/data";
import { cn } from "@/utils/cn";

/* Live streaming log — cycles through automation events so the console
   feels alive even when the user does nothing. */
const LIVE_EVENTS = [
  { t: "00:31", msg: "256 / 256 checked in", tone: "ok" },
  { t: "00:32", msg: "Bracket seeded · double-elim", tone: "ok" },
  { t: "00:33", msg: "Match channels provisioned", tone: "info" },
  { t: "00:34", msg: "Captains notified · 12 regions", tone: "info" },
  { t: "00:35", msg: "Round of 16 · matches live", tone: "live" },
  { t: "00:41", msg: "Score reported · VANTA 2-1", tone: "ok" },
  { t: "00:42", msg: "Anti-smurf scan · 0 flags", tone: "ok" },
  { t: "00:44", msg: "Bracket advanced automatically", tone: "info" },
  { t: "00:47", msg: "Quarterfinal threads opened", tone: "live" },
];

function useLiveLog(count = 5, interval = 2200) {
  const reduce = useReducedMotion();
  const [start, setStart] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStart((s) => (s + 1) % LIVE_EVENTS.length), interval);
    return () => clearInterval(id);
  }, [reduce, interval]);
  return Array.from({ length: count }, (_, i) => LIVE_EVENTS[(start + i) % LIVE_EVENTS.length]);
}

function WordReveal({ text, className, delay = 0, stagger = 0.07 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="overflow-hidden px-[0.1em]">
          <motion.span className="inline-block" initial={{ y: "120%", rotateZ: 4 }} animate={{ y: 0, rotateZ: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 20, delay: delay + i * stagger }}
          >{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

function MiniBracket() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full">
      <g stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none">
        <path d="M96 16H140V44H96" /><path d="M96 116H140V144H96" /><path d="M214 30H246V130H214" />
      </g>
      <g stroke="rgba(34,211,238,0.7)" strokeWidth="1.4" fill="none">
        <path d="M96 44H140V30H214" /><path d="M214 30H246V80H262" />
      </g>
      {[{ y: 4, n: "VANTA", l: false }, { y: 32, n: "HELIX", l: true }, { y: 104, n: "NEXUS", l: false }, { y: 132, n: "ORBIT", l: false }].map((t) => (
        <g key={t.n}><rect x="4" y={t.y} width="92" height="24" rx="6" fill="rgba(10,10,24,0.9)" stroke={t.l ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.06)"} />
          <circle cx="14" cy={t.y + 12} r="2.4" fill={t.l ? "#22d3ee" : "#555"} />
          <text x="24" y={t.y + 16} fontSize="9" fontFamily="JetBrains Mono,monospace" fill={t.l ? "#a5f3fc" : "#888"}>{t.n}</text>
        </g>
      ))}
      {[{ y: 18, n: "HELIX", l: true }, { y: 118, n: "ORBIT", l: false }].map((t) => (
        <g key={t.n}><rect x="150" y={t.y} width="64" height="24" rx="6" fill="rgba(10,10,24,0.9)" stroke={t.l ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.06)"} />
          <text x="158" y={t.y + 16} fontSize="9" fontFamily="JetBrains Mono,monospace" fill={t.l ? "#a5f3fc" : "#888"}>{t.n}</text>
        </g>
      ))}
      <g><rect x="262" y="68" width="34" height="24" rx="6" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.6)" />
        <text x="268" y="84" fontSize="9" fontFamily="JetBrains Mono,monospace" fill="#a5f3fc">WIN</text>
      </g>
    </svg>
  );
}

function HeroConsole() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 100, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 100, damping: 16 });
  const px = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return; const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * 14); rx.set(-ny * 12); px.set(nx * -28); py.set(ny * -20);
  }
  function leave() { rx.set(0); ry.set(0); px.set(0); py.set(0); }

  const tabs = [{ icon: Activity, l: "Live" }, { icon: GitBranch, l: "Bracket" }, { icon: Users, l: "Players" }, { icon: TrendingUp, l: "Stats" }];
  const log = useLiveLog(5);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={leave} className="relative [transform-style:preserve-3d] [perspective:1200px]">
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative will-change-transform">
        <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-b from-cyan-500/30 via-cyan-400/10 to-transparent blur-3xl animate-breathe" />
        <div className="group/console relative overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 elev-3 backdrop-blur-xl">
          {/* holographic scan sweep */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
            <div className="absolute inset-x-0 -top-1/2 h-1/2 bg-gradient-to-b from-transparent via-cyan-400/8 to-transparent animate-scanline" />
          </div>
          <div className="flex items-center justify-between border-b border-white/6 bg-white/[0.02] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/12" /><span className="h-2.5 w-2.5 rounded-full bg-white/12" /><span className="h-2.5 w-2.5 rounded-full bg-cyan-400/70" />
              <span className="ml-3 font-mono text-[11px] tracking-wide text-lo">tournament-os · live</span>
            </div>
            <div className="flex items-center gap-2"><LiveDot /><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">live</span></div>
          </div>
          <div className="grid grid-cols-[auto_1fr]">
            <div className="hidden flex-col gap-1 border-r border-white/6 p-3 sm:flex">
              {tabs.map((t, i) => (
                <div key={t.l} className={cn("flex items-center gap-2 rounded-lg px-2.5 py-2", i === 0 ? "bg-cyan-400/10 text-cyan-300" : "text-lo")}>
                  <t.icon className="h-3.5 w-3.5" /><span className="text-[11px] font-medium">{t.l}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 p-3.5">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-semibold text-white">WinterCup 2026</p><p className="font-mono text-[10px] text-white/40">double-elim · 256 slots</p></div>
                <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 font-mono text-[10px] text-cyan-300">QF · LIVE</span>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3"><MiniBracket /></div>
              <div className="space-y-1.5">
                {liveMatches.map((m) => (
                  <div key={m.a} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-2.5 py-1.5">
                    <div className="flex items-center gap-2"><LiveDot className="scale-75" color="bg-rose-400" /><span className="text-[11px] text-white">{m.a}</span><span className="font-mono text-[10px] text-white/30">vs</span><span className="text-[11px] text-white/60">{m.b}</span></div>
                    <span className="font-mono text-[11px] text-cyan-300">{m.score}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/6 bg-black/30 p-2.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-cyan-400" /><MonoLabel className="text-[9px]">automation log</MonoLabel></div>
                  <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400"><span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />streaming</span>
                </div>
                <div className="relative h-[68px] overflow-hidden font-mono text-[10px] leading-relaxed">
                  <AnimatePresence initial={false} mode="popLayout">
                    {log.map((l) => (
                      <motion.div
                        key={l.t + l.msg}
                        layout
                        initial={{ opacity: 0, x: -8, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 8, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2 py-px"
                      >
                        <span className="text-white/25">{l.t}</span>
                        <span className={l.tone === "live" ? "text-cyan-300" : l.tone === "ok" ? "text-emerald-400/80" : "text-white/55"}>{l.msg}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Chip className="-left-10 top-10 hidden md:flex" mv={{ x: px, y: py }}><span className="font-mono text-[10px] text-lo">verified</span><span className="font-mono text-sm text-cyan-300">256 ✓</span></Chip>
        <Chip className="-right-8 top-24 hidden md:flex" mv={{ x: px, y: py }}><span className="font-mono text-[10px] text-lo">bracket</span><span className="font-mono text-sm text-white">seeded</span></Chip>
        <Chip className="-right-12 bottom-16 hidden lg:flex" mv={{ x: px, y: py }}><span className="font-mono text-[10px] text-lo">disputes</span><span className="font-mono text-sm text-emerald-400">0</span></Chip>
      </motion.div>
    </div>
  );
}

function Chip({ children, className, mv }: { children: ReactNode; className?: string; mv: { x: any; y: any } }) {
  return (
    <motion.div
      style={{ x: mv.x, y: mv.y }}
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.4}
      whileHover={{ scale: 1.08, cursor: "grab", borderColor: "rgba(34,211,238,0.5)" }}
      whileTap={{ scale: 0.96, cursor: "grabbing" }}
      className={cn("absolute flex flex-col items-start gap-0.5 rounded-xl border border-white/10 bg-void-850/95 p-3 backdrop-blur-xl elev-3 select-none transition-colors", className)}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const [bootDone, setBootDone] = useState(false);
  const handleBootDone = useCallback(() => setBootDone(true), []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const consoleY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  return (
    <>
    <NexusBoot onDone={handleBootDone} />
    <section id="top" ref={heroRef} className="relative overflow-hidden pt-32 sm:pt-40">
      {/* Layer 1 — Pipeline canvas: subtle circuit-board atmosphere */}
      <PipelineCanvas variant="hero" className="absolute inset-0 z-0" />
      {/* Layer 2 — VantaHalo ring (WebGL, CDN-loaded; degrades gracefully) */}
      <VantaHalo className="absolute inset-0 z-[1]" />
      {/* Layer 3 — Grid + noise overlays unify everything above.
          NOTE: opacity reduced from 0.50 → 0.20 — at 50% this fully-opaque
          grid pattern was sitting directly on top of VantaHalo (z-2 over
          z-1) and washing out the ring almost completely, on top of the
          separate Halo color/intensity issue. */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-grid opacity-20 mask-fade-b" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-noise" />
      {/* Ambient floating glass blueprints */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden overflow-hidden lg:block" aria-hidden>
        <div className="absolute left-[8%] top-[26%] h-24 w-40 rotate-6 rounded-xl border border-white/6 bg-white/[0.015] backdrop-blur-sm animate-float" />
        <div className="absolute right-[6%] top-[58%] h-20 w-32 -rotate-6 rounded-xl border border-white/6 bg-white/[0.015] backdrop-blur-sm animate-float-x" style={{ animationDelay: "1.2s" }} />
        <div className="absolute left-[14%] bottom-[16%] h-16 w-28 rotate-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.02] backdrop-blur-sm animate-float" style={{ animationDelay: "0.6s" }} />
      </div>

      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="flex justify-center lg:justify-start">
              <span className="group inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 transition-colors hover:border-cyan-400/25">
                <LiveDot />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">v4.2 · all systems operational</span>
                <span className="ml-1 h-3 w-px bg-white/10" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-lo">not a bot</span>
              </span>
            </motion.div>
            <h1 className="mt-7 text-balance text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem]">
              <span className="block"><WordReveal text="The operating system" delay={0.25} /></span>
              <span className="mt-2 block"><WordReveal text="for" delay={0.6} className="text-mid" />{" "}<span className="text-gradient-cyan text-glow-cyan"><WordReveal text="competitive" delay={0.7} /></span>{" "}<WordReveal text="tournaments." delay={0.9} /></span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mid sm:text-lg lg:mx-0">
              Tournament OS automates the entire lifecycle — registration, verification, brackets, scheduling, and live match operations — so your staff can run the event, not the logistics.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.35 }} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button variant="primary" size="lg" href="#cta" iconRight={ArrowRight}>Deploy Tournament OS</Button>
              <Button variant="secondary" size="lg" href="#automation" icon={Play}>Watch it run</Button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-lo">No credit card · Deploys in minutes · SOC 2 ready</motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ y: consoleY }} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <HeroConsole />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/6 md:grid-cols-4">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group/stat relative bg-void-900/50 p-5 backdrop-blur transition-colors duration-500 hover:bg-void-850/70 sm:p-6"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-transform duration-500 group-hover/stat:scale-x-100" />
              <div className="font-display text-3xl font-bold text-hi transition-colors group-hover/stat:text-cyan-200 sm:text-4xl"><CountUp to={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} /></div>
              <p className="mt-1.5 text-xs text-mid sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* cinematic scroll cue */}
      <motion.a
        href="#automation"
        aria-label="Scroll to explore"
        style={{ opacity: heroOpacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-lo transition-colors hover:text-cyan-300 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.28em]">scroll to enter</span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.02]">
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </span>
      </motion.a>
    </section>
    </>
  );
}
