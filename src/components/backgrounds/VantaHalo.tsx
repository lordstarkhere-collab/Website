import { useEffect, useRef } from "react";
import { useVantaLoader } from "@/shared/hooks/useVantaLoader";
import { cn } from "@/utils/cn";

declare global {
  interface Window {
    VANTA: {
      HALO: (config: Record<string, unknown>) => { destroy(): void };
      GLOBE: (config: Record<string, unknown>) => { destroy(): void };
    };
    THREE: unknown;
  }
}

interface VantaHaloProps {
  className?: string;
}

export function VantaHalo({ className }: VantaHaloProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vantaInstance = useRef<{ destroy(): void } | null>(null);
  const { ready } = useVantaLoader("halo");

  useEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;
    if (vantaInstance.current) return; // already initialized

    // Graceful degradation if VANTA didn't load
    if (
      typeof window.VANTA === "undefined" ||
      typeof window.VANTA.HALO === "undefined"
    ) {
      return;
    }

    try {
      vantaInstance.current = window.VANTA.HALO({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: 0x030308, // void-950
        baseColor: 0x22d3ee,       // cyan-400 — bright primary accent (was cyan-600, too dark)
        size: 2.2,                 // was 1.8 — larger, more dominant presence
        amplitudeFactor: 2.0,      // was 1.2 — stronger pulse, clearly visible motion
        xOffset: 0.0,
        yOffset: -0.05,
      });
    } catch {
      // WebGL context unavailable (headless / no GPU) — degrade silently
      return;
    }

    return () => {
      vantaInstance.current?.destroy();
      vantaInstance.current = null;
    };
  }, [ready]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ zIndex: 1 }}
    />
  );
}
