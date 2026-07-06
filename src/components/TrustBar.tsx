import { Marquee, Reveal } from "./ui";
import { trustLogos } from "@/lib/data";
export function TrustBar() {
  return (
    <section className="relative border-y border-white/5 bg-void-900/40 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-lo">Powering competitive operations worldwide</p></Reveal>
        <div className="mt-8"><Marquee>{trustLogos.map((l) => (<div key={l} className="group mx-8 flex items-center gap-2.5 text-mid/40 transition-all duration-500 hover:scale-105 hover:text-hi"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" /><span className="font-display text-lg font-semibold tracking-tight">{l}</span></div>))}</Marquee></div>
      </div>
    </section>
  );
}
