import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Circle, Clock, Zap, Globe, Terminal } from "lucide-react";
import { PageShell, PageHeader } from "../components/site/PageShell";
import { PageSection, CTABand } from "../components/site/blocks";
import { Button, Stagger, StaggerItem, LiveDot } from "../components/ui";
import { cn } from "@/utils/cn";

/* ---------- Changelog ---------- */
const changelog = [
  { version: "v4.2.0", date: "Jan 2026", tag: "latest", items: ["Real-time bracket recompute engine (sub-second propagation)", "Swiss pairing v2 with Buchholz tiebreakers", "Discord thread auto-archival on match completion", "28th edge region live (São Paulo)"] },
  { version: "v4.1.0", date: "Dec 2025", tag: "", items: ["Anti-smurf detection model 3.0", "Custom registration field types", "Organizer analytics exports (CSV + API)"] },
  { version: "v4.0.0", date: "Nov 2025", tag: "major", items: ["Rebuilt automation engine — event-driven core", "New unified organizer dashboard", "SSO / SAML for enterprise", "Public platform: guild & player directories"] },
];

export function ChangelogPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Changelog" title={<>Shipping <span className="text-gradient-cyan">relentlessly.</span></>} description="Every improvement to the Tournament OS platform, in reverse chronological order." />
      <PageSection>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-cyan-400/50 via-white/10 to-transparent" />
          <Stagger className="space-y-10">
            {changelog.map((c) => (
              <StaggerItem key={c.version}>
                <div className="relative pl-10">
                  <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-cyan-400/50 bg-void-900"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /></span>
                  <div className="flex items-center gap-3"><h3 className="font-display text-xl font-bold text-hi">{c.version}</h3>{c.tag && <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", c.tag === "latest" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : c.tag === "major" ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-white/10 text-mid")}>{c.tag}</span>}<span className="font-mono text-xs text-lo">{c.date}</span></div>
                  <ul className="mt-4 space-y-2 rounded-2xl glass-card p-5">
                    {c.items.map((it) => (<li key={it} className="flex items-start gap-2.5 text-sm text-mid"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{it}</li>))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </PageSection>
      <CTABand />
    </PageShell>
  );
}

/* ---------- Roadmap ---------- */
const roadmap = [
  { phase: "Now", icon: Zap, color: "text-cyan-300", items: ["Mobile companion app (beta)", "AI seeding assistant", "Public API explorer"] },
  { phase: "Next", icon: Clock, color: "text-amber-300", items: ["Plugin marketplace", "White-label portal", "Webhook manager v2", "Theme store"] },
  { phase: "Later", icon: Circle, color: "text-mid", items: ["Enterprise console", "Developer dashboard", "Native OBS integration", "Sponsorship marketplace"] },
];

export function RoadmapPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Roadmap" title={<>Where we're <span className="text-gradient-cyan">headed.</span></>} description="A transparent look at what's shipping now, what's next, and what's on the horizon." />
      <PageSection>
        <div className="grid gap-5 lg:grid-cols-3">
          {roadmap.map((r) => (
            <div key={r.phase} className="rounded-3xl glass-card p-6">
              <div className="flex items-center gap-2"><r.icon className={cn("h-5 w-5", r.color)} /><h3 className="font-display text-lg font-bold text-hi">{r.phase}</h3></div>
              <div className="mt-5 space-y-3">
                {r.items.map((it) => (
                  <div key={it} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-3.5 text-sm text-hi">
                    <span className={cn("h-1.5 w-1.5 rounded-full", r.phase === "Now" ? "bg-cyan-400" : r.phase === "Next" ? "bg-amber-400" : "bg-white/20")} />{it}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
      <CTABand />
    </PageShell>
  );
}

/* ---------- Login (renders inside AuthLayout) ---------- */
export function LoginPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      <div className="conic-border relative overflow-hidden rounded-3xl border border-white/8 bg-void-900/70 p-8 elev-3 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <h1 className="text-center font-display text-2xl font-bold text-hi">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-mid">Sign in to your Tournament OS console.</p>
        <div className="mt-7 space-y-3">
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-hi transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]"><Globe className="h-4 w-4" />Continue with Google</button>
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-hi transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]"><Terminal className="h-4 w-4" />Continue with SSO</button>
        </div>
        <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-white/8" /><span className="font-mono text-[10px] uppercase tracking-wider text-lo">or</span><span className="h-px flex-1 bg-white/8" /></div>
        <div className="space-y-3">
          <input placeholder="you@guild.gg" className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:border-cyan-400/40 focus:outline-none" />
          <input type="password" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:border-cyan-400/40 focus:outline-none" />
          <Button variant="primary" size="lg" href="/app/organizer" iconRight={ArrowRight} className="w-full" magnetic={false}>Sign in</Button>
        </div>
        <p className="mt-6 text-center text-xs text-mid">New here? <Link to="/pricing" className="text-cyan-300 hover:text-cyan-200">Create an account</Link></p>
      </div>
    </motion.div>
  );
}

/* ---------- Generic content page (About, Contact, Docs, Blog, Careers) ---------- */
export function ContentPage({ eyebrow, title, description, body }: { eyebrow: string; title: React.ReactNode; description: string; body?: React.ReactNode }) {
  return (
    <PageShell>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <PageSection>{body ?? <div className="rounded-3xl glass-card p-8 text-sm leading-relaxed text-mid">Content coming soon. This section is part of the full Tournament OS product architecture.</div>}</PageSection>
      <CTABand />
    </PageShell>
  );
}

/* ---------- Status ---------- */
export function StatusPage() {
  const systems = [
    { name: "Automation Engine", status: "Operational" }, { name: "Tournament Engine", status: "Operational" },
    { name: "Discord Integration", status: "Operational" }, { name: "Live Brackets", status: "Operational" },
    { name: "Analytics Pipeline", status: "Operational" }, { name: "Edge Network (28 regions)", status: "Operational" },
    { name: "API", status: "Operational" }, { name: "Dashboard", status: "Operational" },
  ];
  return (
    <PageShell>
      <PageHeader eyebrow="Status" title={<>All systems <span className="text-gradient-cyan">operational.</span></>} description="Real-time status of every Tournament OS service." />
      <PageSection>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-5"><LiveDot color="bg-emerald-400" /><span className="text-sm font-medium text-emerald-300">All systems operational · 99.99% uptime (90d)</span></div>
          <div className="divide-y divide-white/6 overflow-hidden rounded-2xl glass-card">
            {systems.map((s) => (
              <div key={s.name} className="flex items-center justify-between px-5 py-4"><span className="text-sm text-hi">{s.name}</span><span className="flex items-center gap-2 font-mono text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{s.status}</span></div>
            ))}
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}

/* ---------- 404 ---------- */
export function NotFoundPage() {
  return (
    <PageShell>
      <div className="grid min-h-[70vh] place-items-center px-5">
        <div className="text-center">
          <p className="font-display text-[22vw] font-bold leading-none text-gradient-cyan sm:text-[12rem]">404</p>
          <p className="mt-4 text-lg text-mid">This page went off-bracket.</p>
          <div className="mt-8 flex justify-center gap-3"><Button variant="primary" href="/" iconRight={ArrowRight}>Back home</Button><Button variant="secondary" href="/explore">Explore</Button></div>
        </div>
      </div>
    </PageShell>
  );
}
