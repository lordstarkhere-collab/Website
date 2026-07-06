/* ============================================================================
   TOURNAMENT OS — ROUTE REGISTRY & PATH BUILDERS
   ----------------------------------------------------------------------------
   Central, type-safe path builders so no component hardcodes URL strings.
   This is the canonical sitemap for the whole platform.
   ============================================================================ */

export const paths = {
  home: "/",

  /* Marketing */
  platform: "/platform",
  platformItem: (slug: string) => `/platform/${slug}`,
  featureItem: (slug: string) => `/features/${slug}`,
  solutionItem: (slug: string) => `/solutions/${slug}`,
  pricing: "/pricing",

  /* Resources / company */
  changelog: "/changelog",
  roadmap: "/roadmap",
  status: "/status",
  docs: "/docs",
  apiDocs: "/docs/api",
  blog: "/blog",
  about: "/about",
  careers: "/careers",
  contact: "/contact",

  /* Auth */
  login: "/login",
  signup: "/signup",

  /* Public platform */
  explore: "/explore",
  tournaments: "/explore/tournaments",
  tournament: (slug: string) => `/explore/tournaments/${slug}`,
  guilds: "/explore/guilds",
  guild: (slug: string) => `/explore/guilds/${slug}`,
  teams: "/explore/teams",
  team: (slug: string) => `/explore/teams/${slug}`,
  players: "/explore/players",
  player: (slug: string) => `/explore/players/${slug}`,

  /* Portals */
  playerApp: "/app/player",
  organizerApp: "/app/organizer",
  adminApp: "/app/admin",
} as const;

/* Domain segments — used by layouts to detect which domain a path belongs to */
export const domainOf = (pathname: string): "marketing" | "public" | "portal" | "auth" => {
  if (pathname.startsWith("/app")) return "portal";
  if (pathname.startsWith("/explore")) return "public";
  if (pathname === "/login" || pathname === "/signup") return "auth";
  return "marketing";
};

/* Human-readable labels for breadcrumb auto-generation */
export const segmentLabels: Record<string, string> = {
  platform: "Platform",
  features: "Features",
  solutions: "Solutions",
  explore: "Explore",
  tournaments: "Tournaments",
  guilds: "Guilds",
  teams: "Teams",
  players: "Players",
  app: "App",
  player: "Player",
  organizer: "Organizer",
  admin: "Admin",
  docs: "Documentation",
  api: "API Reference",
  pricing: "Pricing",
  changelog: "Changelog",
  roadmap: "Roadmap",
  status: "Status",
  about: "About",
  careers: "Careers",
  contact: "Contact",
  blog: "Blog",
};
