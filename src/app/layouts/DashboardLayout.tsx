import { useState } from "react";
import { Outlet, useLocation, NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Bell, ChevronDown, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LiveDot } from "@/components/ui";
import { CommandSearch, useCommandSearch } from "@/components/site/CommandSearch";
import { useUser, useAuth } from "@/features/auth/AuthContext";
import { GuildSwitcher } from "@/components/site/GuildSwitcher";
import { CopilotTriggerButton } from "@/features/ai";
import { appPageVariants, drawerLeftVariants, overlayVariants, spring } from "@/shared/motion/motion";
import {
  portalNav, portalMeta, portalSwitcher, profileMenu, type PortalRole,
} from "@/shared/config/navigation";
import { PipelineCanvas } from "@/components/backgrounds/PipelineCanvas";
import { cn } from "@/utils/cn";

/* ============================================================================
   DashboardLayout — role-based portal shell (Player / Organizer / Admin).
   Provides: collapsible sidebar with grouped role nav, portal switcher,
   sticky topbar (search + notifications + profile), mobile drawer.
   Route: /app/:role/*  → the child route renders in <Outlet />.
   ============================================================================ */

function detectRole(pathname: string): PortalRole {
  if (pathname.startsWith("/app/admin")) return "admin";
  if (pathname.startsWith("/app/organizer")) return "organizer";
  return "player";
}

function Sidebar({ role }: { role: PortalRole }) {
  const groups = portalNav[role];
  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4 no-scrollbar">
      {groups.map((g) => (
        <div key={g.heading}>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">{g.heading}</p>
          <div className="space-y-0.5">
            {g.links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === portalMeta[role].base}
                className={({ isActive }) =>
                  cn(
                    "group/nav relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:translate-x-0.5",
                    isActive ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:bg-white/[0.03] hover:text-hi",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId={`navdot-${role}`} className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400" transition={spring.snappy} />}
                    {l.icon && <l.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110" />}
                    <span className="truncate">{l.label}</span>
                    {l.badge && <span className="ml-auto rounded-full bg-cyan-400/15 px-1.5 text-[10px] text-cyan-300">{l.badge}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function PortalSwitcher({ role }: { role: PortalRole }) {
  const [open, setOpen] = useState(false);
  const meta = portalMeta[role];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-hi transition-colors hover:border-cyan-400/25"
      >
        <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan-400/15 font-mono text-[10px] font-bold text-cyan-300">{meta.label[0]}</span>
        <span className="flex-1 text-left font-medium">{meta.label}</span>
        <ChevronDown className={cn("h-4 w-4 text-lo transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/8 bg-void-900/95 backdrop-blur-xl elev-3"
          >
            {portalSwitcher.map((p) => (
              <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className="flex items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
                {p.icon && <p.icon className="mt-0.5 h-4 w-4 text-cyan-300" />}
                <span>
                  <span className="block text-sm text-hi">{p.label}</span>
                  {p.desc && <span className="block text-[11px] text-lo">{p.desc}</span>}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const { logout } = useAuth();
  const initials = user?.avatar ?? "PH";
  const name = user?.displayName ?? "Player";
  const email = user?.email ?? "";

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] py-1 pl-1 pr-2.5 transition-colors hover:border-cyan-400/25">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-amber-500/20 text-[11px] font-bold text-hi ring-1 ring-white/10">{initials}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-lo transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/8 bg-void-900/95 backdrop-blur-xl elev-3">
            <div className="border-b border-white/6 px-3 py-3"><p className="text-sm font-medium text-hi">{name}</p><p className="text-[11px] text-lo truncate">{email}</p></div>
            {profileMenu.map((m) => {
              const isLogout = m.label === "Sign out";
              if (isLogout) return (
                <button key="logout" onClick={() => { logout(); setOpen(false); }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-mid transition-colors hover:bg-rose-500/10 hover:text-rose-400">
                  {m.icon && <m.icon className="h-4 w-4" />}{m.label}
                </button>
              );
              return (
                <Link key={m.to} to={m.to} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-mid transition-colors hover:bg-white/[0.04] hover:text-hi">
                  {m.icon && <m.icon className="h-4 w-4" />}{m.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardLayout() {
  const { pathname } = useLocation();
  const role = detectRole(pathname);
  const meta = portalMeta[role];
  const [mobileOpen, setMobileOpen] = useState(false);
  const search = useCommandSearch();
  /* Notification count for the bell icon — populated by mockNotifications in production */
  const unreadNotifs = 3;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.25]" />
      {/* Pipeline — live data / system intelligence atmosphere */}
      <PipelineCanvas variant="dashboard" />
      {/* Portal-specific tint — a warmth shift you feel rather than see */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          background:
            role === "organizer"
              ? "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(251,191,36,0.03) 0%, transparent 70%)"
              : role === "admin"
                ? "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(251,113,133,0.03) 0%, transparent 70%)"
                : "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(34,211,238,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-void-950/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-lg glass text-hi lg:hidden"><Menu className="h-5 w-5" /></button>
          <Link to="/"><Logo /></Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300 sm:flex">
            <LiveDot />{meta.label} portal
          </span>
          <div className="ml-auto flex items-center gap-2">
            <CopilotTriggerButton />
            <GuildSwitcher />
            <button onClick={() => search.setOpen(true)} className="mo-press hidden items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-1.5 text-sm text-lo transition-colors hover:border-cyan-400/25 hover:text-hi md:flex">
              <Search className="h-4 w-4" /> <span className="pr-8">Search…</span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <Link to={role === "organizer" ? "/app/organizer/notifications" : "/app/player/notifications"} className="mo-tap relative grid h-9 w-9 place-items-center rounded-lg border border-white/8 bg-white/[0.02] text-mid transition-colors hover:border-cyan-400/25 hover:text-hi">
              <Bell className="h-4 w-4" />{unreadNotifs > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white mo-pop">{unreadNotifs}</span>}
            </Link>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-white/6 bg-void-950/40 lg:block">
          <div className="p-4"><PortalSwitcher role={role} /></div>
          <Sidebar role={role} />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="fixed inset-0 z-[70] lg:hidden" variants={overlayVariants} initial="initial" animate="enter" exit="exit">
              <div className="absolute inset-0 bg-void-950/90 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
              <motion.div className="absolute left-0 top-0 h-full w-72 border-r border-white/8 bg-void-900" variants={drawerLeftVariants} initial="initial" animate="enter" exit="exit">
                <div className="flex items-center justify-between border-b border-white/6 p-4">
                  <Link to="/"><Logo /></Link>
                  <button onClick={() => setMobileOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg glass text-hi"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-4"><PortalSwitcher role={role} /></div>
                <div onClick={() => setMobileOpen(false)}><Sidebar role={role} /></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <motion.main
          id="main-content"
          key={pathname}
          variants={appPageVariants}
          initial="initial"
          animate="enter"
          className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8"
        >
          <Outlet />
        </motion.main>
      </div>

      <CommandSearch open={search.open} onClose={() => search.setOpen(false)} />
    </div>
  );
}

/* Shared dashboard breadcrumb (context navigation for portal pages) */
export function DashboardCrumb({ trail }: { trail: string[] }) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-lo">
      {trail.map((t, i) => (
        <span key={t} className="flex items-center gap-1.5">
          <span className={i === trail.length - 1 ? "text-cyan-300" : ""}>{t}</span>
          {i < trail.length - 1 && <ChevronRight className="h-3 w-3 text-white/20" />}
        </span>
      ))}
    </nav>
  );
}
