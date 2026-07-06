import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Hash } from "lucide-react";
import { ParallaxSection, SectionHeading, Reveal, LiveDot } from "./ui";
import { dashboardTabs, liveMatches, chartSeries } from "@/lib/data";
import { cn } from "@/utils/cn";

function LiveView() {
  return (<div className="grid gap-4 sm:grid-cols-[1fr_auto]"><div className="space-y-2.5">{liveMatches.map((m) => (<div key={m.a} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"><div className="flex items-center gap-2.5"><LiveDot color="bg-rose-400" /><span className="text-sm font-medium text-hi">{m.a}</span><span className="font-mono text-[11px] text-lo">vs</span><span className="text-sm text-mid">{m.b}</span></div><div className="flex items-center gap-3"><span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-mid">{m.round}</span><span className="font-mono text-sm font-semibold text-cyan-300">{m.score}</span></div></div>))}</div><div className="flex flex-row gap-3 sm:w-40 sm:flex-col">{[{l:"In progress",v:"3",c:"text-rose-400"},{l:"Awaiting",v:"5",c:"text-mid"},{l:"Completed",v:"60",c:"text-cyan-300"}].map((s)=>(<div key={s.l} className="flex-1 rounded-xl border border-white/6 bg-white/[0.02] p-3"><div className={cn("font-display text-2xl font-semibold",s.c)}>{s.v}</div><p className="mt-0.5 text-[11px] text-lo">{s.l}</p></div>))}</div></div>);
}
function BracketView() {
  return (<div className="overflow-x-auto no-scrollbar"><svg viewBox="0 0 520 240" className="h-auto w-full min-w-[480px]"><g stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"><path d="M120 30H170V90H120"/><path d="M120 150H170V210H120"/><path d="M330 60H390V180H330"/><path d="M280 60H330V180"/></g><g stroke="rgba(34,211,238,0.7)" strokeWidth="1.4" fill="none"><path d="M120 90H170V60H280V120H390V120H470"/></g>{[{x:10,y:18,n:"VANTA Black",w:false},{x:10,y:78,n:"Helix Apex",w:true},{x:10,y:138,n:"Nexus Prime",w:false},{x:10,y:198,n:"Orbit.gg",w:true}].map(t=>(<g key={t.n}><rect x={t.x} y={t.y} width="110" height="24" rx="6" fill="rgba(10,10,24,0.9)" stroke={t.w?"rgba(34,211,238,0.5)":"rgba(255,255,255,0.06)"}/><text x={t.x+12} y={t.y+16} fontSize="10" fontFamily="JetBrains Mono,monospace" fill={t.w?"#a5f3fc":"#888"}>{t.n}</text></g>))}{[{x:170,y:48,n:"Helix Apex"},{x:170,y:168,n:"Orbit.gg"}].map(t=>(<g key={t.n}><rect x={t.x} y={t.y} width="110" height="24" rx="6" fill="rgba(10,10,24,0.9)" stroke="rgba(255,255,255,0.08)"/><text x={t.x+12} y={t.y+16} fontSize="10" fontFamily="JetBrains Mono,monospace" fill="#ccc">{t.n}</text></g>))}<g><rect x="390" y="108" width="80" height="24" rx="6" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.6)"/><text x="404" y="124" fontSize="10" fontFamily="JetBrains Mono,monospace" fill="#a5f3fc">CHAMPION</text></g></svg></div>);
}
function PlayersView() {
  const rows = [{r:1,n:"vanta.black",rg:"EU-W",s:1},{r:2,n:"helix.apex",rg:"NA-E",s:2},{r:3,n:"nexus.prime",rg:"EU-W",s:3},{r:4,n:"orbit.gg",rg:"APAC",s:4},{r:5,n:"pulse.arena",rg:"NA-W",s:5}];
  return (<div className="overflow-hidden rounded-xl border border-white/6"><div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 border-b border-white/6 bg-white/[0.02] px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-lo"><span>#</span><span>Player</span><span className="hidden sm:block">Region</span><span>Seed</span></div>{rows.map(r=>(<div key={r.n} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-white/4 px-4 py-3 last:border-0"><span className="font-mono text-sm text-lo">{r.r}</span><span className="flex items-center gap-2 text-sm text-hi"><span className="grid h-4 w-4 place-items-center rounded-full bg-cyan-400/15"><Check className="h-2.5 w-2.5 text-cyan-300"/></span>{r.n}</span><span className="hidden items-center gap-1 font-mono text-[11px] text-mid sm:flex"><MapPin className="h-3 w-3"/>{r.rg}</span><span className="flex items-center gap-1 font-mono text-[11px] text-cyan-300"><Hash className="h-3 w-3"/>{r.s}</span></div>))}</div>);
}
function AnalyticsView() {
  return (<div><div className="flex h-44 items-end gap-2">{chartSeries.map((v,i)=>(<div key={i} className="flex flex-1 items-end"><motion.div initial={{height:0}} whileInView={{height:`${v}%`}} viewport={{once:true}} transition={{delay:i*0.04,duration:0.7,ease:[0.16,1,0.3,1]}} className="w-full rounded-t bg-gradient-to-t from-cyan-600/80 via-cyan-500/60 to-amber-400"/></div>))}</div><div className="mt-4 grid grid-cols-3 gap-3">{[{l:"Peak concurrency",v:"1,284"},{l:"Avg. match length",v:"27m"},{l:"Viewer-minutes",v:"94K"}].map(s=>(<div key={s.l} className="rounded-xl border border-white/6 bg-white/[0.02] p-3"><div className="font-display text-lg font-semibold text-hi">{s.v}</div><p className="mt-0.5 text-[11px] text-lo">{s.l}</p></div>))}</div></div>);
}

const views: Record<string, () => ReactNode> = { live: LiveView, bracket: BracketView, players: PlayersView, analytics: AnalyticsView };

export function DashboardShowcase() {
  const [active, setActive] = useState("live");
  const V = views[active];
  return (
    <ParallaxSection id="dashboard" className="overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.05),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Command center" title={<>One control surface for the <span className="text-gradient-cyan">whole</span> operation.</>} description="Run hundreds of concurrent events from a single, unified console." />
        <Reveal className="mt-14" rotate={4}>
          <div className="overflow-hidden rounded-3xl border border-white/8 bg-void-900/70 elev-3 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/6 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-white/12"/><span className="h-2.5 w-2.5 rounded-full bg-white/12"/><span className="h-2.5 w-2.5 rounded-full bg-cyan-400/70"/><span className="ml-3 font-mono text-[11px] text-lo">app.tournament-os</span></div>
              <div className="hidden items-center gap-2 sm:flex"><LiveDot/><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">synced</span></div>
            </div>
            <div className="grid lg:grid-cols-[220px_1fr]">
              <div className="flex gap-1.5 overflow-x-auto border-b border-white/6 p-3 no-scrollbar lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
                {dashboardTabs.map((t) => { const a = active === t.id; return (
                  <button key={t.id} type="button" onClick={() => setActive(t.id)} className={cn("relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-colors", a ? "text-hi" : "text-mid hover:text-hi")}>
                    {a && <motion.span layoutId="tabbg" className="absolute inset-0 rounded-xl border border-cyan-400/20 bg-cyan-400/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    <t.icon className="relative h-4 w-4" /><span className="relative"><span className="block text-sm font-medium">{t.label}</span><span className="hidden font-mono text-[10px] text-lo lg:block">{t.sub}</span></span>
                  </button>
                ); })}
              </div>
              <div className="min-h-[320px] p-5 sm:p-7">
                <AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}><V /></motion.div></AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </ParallaxSection>
  );
}
