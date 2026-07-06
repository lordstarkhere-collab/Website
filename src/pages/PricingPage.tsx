import { Check, ArrowRight } from "lucide-react";
import { PageShell, PageHeader } from "../components/site/PageShell";
import { PageSection, CTABand } from "../components/site/blocks";
import { Button, Stagger, StaggerItem } from "../components/ui";
import { pricingTiers, faqs } from "@/lib/data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export function PricingPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell>
      <PageHeader eyebrow="Pricing" title={<>Start free. Scale to a <span className="text-gradient-cyan">global organization.</span></>} description="Transparent plans that grow with you — from your first community bracket to worldwide championship circuits." />

      <PageSection>
        <Stagger className="grid items-stretch gap-5 lg:grid-cols-3">
          {pricingTiers.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <div
                onMouseMove={(e) => { const el = e.currentTarget; const r = el.getBoundingClientRect(); el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`); }}
                className={cn("spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1.5", t.featured ? "conic-border border-cyan-400/35 bg-gradient-to-b from-cyan-400/[0.06] to-transparent elev-3 lg:-mt-4" : "border-white/6 bg-white/[0.02] hover:border-cyan-400/25")}
              >
                {t.featured && <><div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" /><div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-40 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl animate-breathe" /><span className="absolute right-5 top-5 rounded-full border border-cyan-400/35 bg-cyan-400/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Most popular</span></>}
                <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:glow-cyan group-hover:scale-105"><t.icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-lg font-semibold text-hi">{t.name}</h3>
                <p className="mt-1 text-sm text-mid">{t.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1.5"><span className="font-display text-4xl font-bold text-hi group-hover:text-cyan-100">{t.price}</span><span className="text-sm text-lo">/ {t.cadence}</span></div>
                <Button variant={t.featured ? "primary" : "outline"} size="md" href="/login" iconRight={ArrowRight} className="mt-6 w-full" magnetic={false}>{t.cta}</Button>
                <ul className="mt-7 space-y-3 border-t border-white/6 pt-6">{t.features.map((f) => (<li key={f} className="flex items-start gap-2.5 text-sm text-mid"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{f}</li>))}</ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 text-center text-sm text-lo">Every plan includes automated registration, check-ins, brackets &amp; Discord integration.</p>
      </PageSection>

      <PageSection eyebrow="Questions" heading="Pricing FAQ">
        <div className="mx-auto max-w-3xl divide-y divide-white/6 overflow-hidden rounded-2xl glass-card">
          {faqs.map((f, i) => { const o = open === i; return (
            <div key={f.q} className="relative">
              <span className={cn("absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-cyan-400/0 transition-opacity", o ? "opacity-100" : "opacity-0")} />
              <button onClick={() => setOpen(o ? null : i)} className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
                <span className={cn("text-[15px] font-medium sm:text-base", o ? "text-cyan-100" : "text-hi group-hover:text-cyan-100")}>{f.q}</span>
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300", o ? "rotate-45 border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid")}><Plus className="h-4 w-4" /></span>
              </button>
              <AnimatePresence initial={false}>{o && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-mid sm:px-6">{f.a}</p></motion.div>)}</AnimatePresence>
            </div>
          ); })}
        </div>
      </PageSection>

      <CTABand />
    </PageShell>
  );
}
