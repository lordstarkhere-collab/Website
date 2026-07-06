import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { spring, dur, ease } from "./index";
import { cn } from "@/utils/cn";

/* ============================================================================
   Toast system — premium arrival/exit/stacking motion, priority-aware.
   Usage: const toast = useToast(); toast.success("Saved", "Changes applied.")
   ============================================================================ */
type ToastKind = "success" | "warning" | "critical" | "info";
type Toast = { id: number; kind: ToastKind; title: string; body?: string };

type ToastApi = {
  push: (kind: ToastKind, title: string, body?: string) => void;
  success: (title: string, body?: string) => void;
  warning: (title: string, body?: string) => void;
  critical: (title: string, body?: string) => void;
  info: (title: string, body?: string) => void;
};

const ToastCtx = createContext<ToastApi | null>(null);

const meta: Record<ToastKind, { icon: typeof Info; ring: string; glow: string; text: string }> = {
  success: { icon: CheckCircle2, ring: "border-emerald-400/40", glow: "shadow-[0_0_30px_-10px_rgba(52,211,153,0.5)]", text: "text-emerald-300" },
  warning: { icon: AlertTriangle, ring: "border-amber-400/40", glow: "shadow-[0_0_30px_-10px_rgba(251,191,36,0.5)]", text: "text-amber-300" },
  critical: { icon: XCircle, ring: "border-rose-400/45", glow: "shadow-[0_0_30px_-10px_rgba(244,63,94,0.55)]", text: "text-rose-300" },
  info: { icon: Info, ring: "border-cyan-400/40", glow: "shadow-[0_0_30px_-10px_rgba(34,211,238,0.5)]", text: "text-cyan-300" },
};

let _id = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback((kind: ToastKind, title: string, body?: string) => {
    const id = ++_id;
    setToasts((t) => [...t, { id, kind, title, body }].slice(-4));
    setTimeout(() => remove(id), kind === "critical" ? 7000 : 4500);
  }, [remove]);

  const api: ToastApi = {
    push,
    success: (t, b) => push("success", t, b),
    warning: (t, b) => push("warning", t, b),
    critical: (t, b) => push("critical", t, b),
    info: (t, b) => push("info", t, b),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const m = meta[t.kind];
            const Icon = m.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: spring.soft }}
                exit={{ opacity: 0, x: 40, scale: 0.92, transition: { duration: dur.base, ease: ease.exit } }}
                className={cn("pointer-events-auto flex items-start gap-3 rounded-xl border bg-void-900/90 p-3.5 backdrop-blur-xl", m.ring, m.glow)}
              >
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", m.text)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-hi">{t.title}</p>
                  {t.body && <p className="mt-0.5 text-xs leading-relaxed text-mid">{t.body}</p>}
                </div>
                <button onClick={() => remove(t.id)} className="mo-tap grid h-6 w-6 place-items-center rounded-md text-lo hover:text-hi" aria-label="Dismiss">
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
