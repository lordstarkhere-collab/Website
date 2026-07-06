import { ParallaxSection, SectionHeading, Stagger, StaggerItem } from "./ui";
import { testimonials } from "@/lib/data";
function initials(n: string) { return n.split(" ").map(p => p[0]).slice(0, 2).join(""); }
export function Testimonials() {
  return (
    <ParallaxSection id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Trusted by operators" title={<>Built for the people who <span className="text-gradient-cyan">run the show.</span></>} />
        <Stagger className="mt-14 grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (<StaggerItem key={t.name} className="h-full"><figure
            onMouseMove={(e) => { const el = e.currentTarget; const r = el.getBoundingClientRect(); el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`); }}
            className="spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card p-6 transition-transform duration-500 hover:-translate-y-1.5 sm:p-7"><span className="font-display text-6xl leading-none text-cyan-400/20 transition-colors duration-500 group-hover:text-cyan-400/40">&ldquo;</span><blockquote className="-mt-4 text-[15px] leading-relaxed text-hi/90">{t.quote}</blockquote><figcaption className="mt-6 flex items-center gap-3 border-t border-white/6 pt-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-xs font-semibold text-hi ring-1 ring-white/10">{initials(t.name)}</span><div><p className="text-sm font-semibold text-hi">{t.name}</p><p className="text-xs text-mid">{t.role} · {t.org}</p></div></figcaption></figure></StaggerItem>))}
        </Stagger>
      </div>
    </ParallaxSection>
  );
}
