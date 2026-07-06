import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PipelineCanvas } from "@/components/backgrounds/PipelineCanvas";
import { cn } from "@/utils/cn";

// ─── Constants ────────────────────────────────────────────────────────────────
const DURATION = 3800; // ms — total boot duration

const BOOT_LINES = [
  { module: "NEXUS.CORE",        msg: "quantum orchestration engine initializing" },
  { module: "EDGE.NETWORK",      msg: "establishing 28 regional uplinks" },
  { module: "BRACKET.ENGINE",    msg: "loading seeding algorithms v4.2" },
  { module: "AUTH.LAYER",        msg: "verifying cryptographic identity chain" },
  { module: "TOURNAMENT.MATRIX", msg: "syncing 318,402 active event registries" },
  { module: "AUTOMATION.CORE",   msg: "calibrating match orchestration pipeline" },
  { module: "DISCORD.BRIDGE",    msg: "securing guild communication channels" },
  { module: "AI.LAYER",          msg: "neural inference engine online" },
  { module: "COMMAND.CENTER",    msg: "all systems nominal — nexus stable" },
] as const;

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}";

function glitchText(target: string, progress: number): string {
  return target
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      const resolved = i / target.length < progress;
      return resolved ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

function formatClock(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms} UTC`;
}

const TAU = Math.PI * 2;

/**
 * ConvergenceRing — a thin bright arc sweeps a full circle around the
 * viewport center as `progress` (0→1) advances, driven directly by the
 * boot sequence's own timeline so it never drifts out of sync with the
 * log terminal. At progress >= 1 the ring collapses into a brief point
 * flash, echoing the "many systems converge to one" idea without
 * running its own independent clock.
 */
function ConvergenceRing({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      const p = progressRef.current;

      // faint full guide ring, present throughout
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.strokeStyle = "rgba(34,211,238,0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (p < 1) {
        const angle = p * TAU * 2.2; // slightly faster than 1 full rev per full boot, feels alive
        const trail = 0.55;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, angle - trail, angle);
        const grad = ctx.createConicGradient
          ? ctx.createConicGradient(angle - trail, cx, cy)
          : null;
        const headStop = trail / TAU;
        if (grad) {
          grad.addColorStop(0, "rgba(34,211,238,0)");
          grad.addColorStop(headStop, "rgba(103,232,249,0.85)");
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = "rgba(103,232,249,0.7)";
        }
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(34,211,238,0.8)";
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();

        // sweep head dot
        const hx = cx + Math.cos(angle) * R;
        const hy = cy + Math.sin(angle) * R;
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, TAU);
        ctx.fillStyle = "#e0fbff";
        ctx.shadowColor = "rgba(224,251,255,1)";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // at completion: brief core flash at center, fading
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, TAU);
        ctx.fillStyle = "rgba(244,254,255,0.9)";
        ctx.shadowColor = "rgba(224,251,255,1)";
        ctx.shadowBlur = 26;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else rafRef.current = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 1 }}
      aria-hidden
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function NexusBoot({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  // Check on mount — stable refs for skip conditions
  const shouldSkip = useRef(false);
  if (typeof sessionStorage !== "undefined") {
    shouldSkip.current =
      sessionStorage.getItem("tos_nexus_boot_seen") === "1" || !!reduce;
  }

  const [active, setActive] = useState(true);
  const [pct, setPct] = useState(0);
  const [clockStr, setClockStr] = useState(() => formatClock(new Date()));

  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // ── Live clock (every 100ms) ───────────────────────────────────────────────
  useEffect(() => {
    if (shouldSkip.current) return;
    const id = setInterval(() => setClockStr(formatClock(new Date())), 100);
    return () => clearInterval(id);
  }, []);

  // ── Boot animation loop ────────────────────────────────────────────────────
  const finish = useCallback(() => {
    try { sessionStorage.setItem("tos_nexus_boot_seen", "1"); } catch {}
    setActive(false);
    onDoneRef.current();
  }, []);

  useEffect(() => {
    // Skip immediately if return visitor or reduced-motion —
    // must also flip `active` to false, or the fixed full-screen
    // overlay stays mounted (at initial `active: true`) forever,
    // silently blocking the Hero underneath on every repeat visit.
    if (shouldSkip.current) {
      setActive(false);
      onDoneRef.current();
      return;
    }

    let rafId = 0;
    let timeoutId = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (startedAt === 0) startedAt = now;
      const elapsed = now - startedAt;
      const p = Math.min(1, elapsed / DURATION);
      setPct(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        timeoutId = window.setTimeout(finish, 200);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [finish]);

  // Derived values
  const elapsed = pct * DURATION;

  const currentLineIdx = Math.min(
    BOOT_LINES.length - 1,
    Math.max(0, Math.floor((elapsed - 200) / 380))
  );
  const currentModule = elapsed > 200 ? BOOT_LINES[currentLineIdx]?.module ?? "" : "";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-void-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 1, 1] } }}
        >
          {/* Layer 1 — Pipeline canvas animation (now correctly scaled) */}
          <PipelineCanvas variant="boot" />

          {/* Layer 1b — Convergence sweep ring: a bright arc traces the boot
              radius as subsystems lock in, giving the terminal log a visual
              companion rather than sitting on a flat black field */}
          {!reduce && <ConvergenceRing progress={pct} />}

          {/* Layer 2 — Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 bg-grid"
            style={{ opacity: 0.22, zIndex: 1 }}
          />

          {/* Layer 3 — Noise overlay */}
          <div
            className="pointer-events-none absolute inset-0 bg-noise"
            style={{ zIndex: 1 }}
          />

          {/* Layer 4 — Radial cyan glow (breathes) */}
          <div
            className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "60vmin",
              height: "60vmin",
              background:
                "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
              zIndex: 2,
            }}
          />

          {/* Corner branding */}
          <div className="pointer-events-none fixed left-4 top-4" style={{ zIndex: 10 }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/25">
              Tournament OS
            </span>
          </div>
          <div className="pointer-events-none fixed right-4 top-4" style={{ zIndex: 10 }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/25">
              v4.2.0
            </span>
          </div>
          <div className="pointer-events-none fixed bottom-4 right-4" style={{ zIndex: 10 }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/25">
              NEXUS BOOT SEQUENCE
            </span>
          </div>

          {/* ── Log terminal panel ── */}
          <div
            className="fixed inset-0 flex items-center justify-center px-4"
            style={{ zIndex: 10 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full rounded-2xl border border-cyan-400/15 p-6 backdrop-blur-xl"
              style={{
                maxWidth: "min(560px, 90vw)",
                background: "rgba(3, 3, 8, 0.70)",
              }}
            >
              {/* Header row */}
              <div className="mb-3 flex items-center justify-between border-b border-white/6 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
                  ● TOURNAMENT OS — NEXUS BOOT SEQUENCE
                </span>
                <span className="font-mono text-[10px] tabular-nums text-cyan-400/60">
                  {clockStr}
                </span>
              </div>

              {/* Log lines */}
              <div className="space-y-2">
                {BOOT_LINES.map((line, i) => {
                  const lineAppearsAt = 200 + i * 380;
                  if (elapsed < lineAppearsAt) return null;

                  const lineProgress = Math.min(
                    1,
                    (elapsed - lineAppearsAt) / 400
                  );

                  const status =
                    lineProgress < 0.6
                      ? "INIT"
                      : lineProgress < 1.0
                        ? "LOCK"
                        : "OK";

                  const displayMsg =
                    lineProgress >= 1
                      ? line.msg
                      : glitchText(line.msg, lineProgress);

                  return (
                    <motion.div
                      key={line.module}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <span className="w-40 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-300">
                        {line.module}
                      </span>
                      <span className="text-lo">·</span>
                      <span className="flex-1 truncate font-mono text-[11px] text-mid">
                        {displayMsg}
                      </span>
                      <span
                        className={cn(
                          "ml-auto shrink-0 font-mono text-[10px]",
                          status === "INIT" && "text-lo",
                          status === "LOCK" && "text-amber-300",
                          status === "OK" && "text-emerald-400"
                        )}
                      >
                        [ {status} ]
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ── Diamond logo flash at pct >= 0.92 ── */}
          <AnimatePresence>
            {pct >= 0.92 && (
              <div
                className="pointer-events-none fixed inset-0 flex items-center justify-center"
                style={{ zIndex: 15 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0.7, 0], scale: [0.8, 1, 1, 0.95] }}
                  transition={{ duration: 0.6, times: [0, 0.3, 0.7, 1] }}
                  className="h-14 w-14 rotate-45 rounded-[28%] bg-gradient-to-br from-cyan-300 to-cyan-600"
                  style={{
                    boxShadow: "0 0 60px -6px rgba(34,211,238,0.9)",
                  }}
                />
              </div>
            )}
          </AnimatePresence>

          {/* ── Progress bar ── */}
          <div
            className="fixed bottom-12 left-1/2 -translate-x-1/2"
            style={{ width: "min(480px, 80vw)", zIndex: 10 }}
          >
            {/* Track + fill */}
            <div
              className="relative h-px w-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="absolute inset-y-0 left-0 transition-[width] duration-75"
                style={{
                  width: `${pct * 100}%`,
                  background:
                    "linear-gradient(to right, #06b6d4, #22d3ee, #67e8f9)",
                }}
              />
            </div>

            {/* Labels row */}
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lo">
                BOOTING NEXUS CORE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums text-lo">
                {Math.floor(pct * 100)}%
              </span>
            </div>

            {/* Active module cycling */}
            <div className="mt-1 text-center">
              {currentModule && (
                <span className="font-mono text-[10px] text-cyan-400/70">
                  {currentModule}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
