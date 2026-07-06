import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui";
import { ArrowRight } from "lucide-react";

/* Pinned tall section. As user scrolls through 280vh of space,
   a large headline reveals word-by-word, transitioning from dim
   to bright cyan-glow. Creates a cinematic reading experience. */
export function ScrollTextReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const text = "Every tournament. Every match. Every player. One automated system that never sleeps.";
  const words = text.split(" ");

  return (
    <section ref={ref} className="relative" style={{ height: "280vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Ambient background that shifts color with scroll */}
        <motion.div className="pointer-events-none absolute inset-0" style={{
          background: useTransform(scrollYProgress, [0, 0.5, 1], [
            "radial-gradient(ellipse at center, rgba(34,211,238,0.04), transparent 70%)",
            "radial-gradient(ellipse at center, rgba(34,211,238,0.14), transparent 60%)",
            "radial-gradient(ellipse at center, rgba(251,191,36,0.08), transparent 70%)",
          ]),
        }} aria-hidden />

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-ring" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">the promise</span>
          </motion.span>

          <h2 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              const opacity = useTransform(scrollYProgress, [start * 0.85, end * 0.95 + 0.05], [0.15, 1]);
              const scale = useTransform(scrollYProgress, [start * 0.85, end * 0.95 + 0.05], [0.96, 1]);
              const color = useTransform(
                scrollYProgress,
                [start * 0.85, end * 0.95 + 0.05],
                ["rgb(85, 85, 112)", "rgb(34, 211, 238)"],
              );
              return (
                <motion.span key={i} className="inline-block mx-[0.1em] will-change-transform" style={{ opacity, scale, color }}>
                  {word}
                </motion.span>
              );
            })}
          </h2>

          <motion.p className="mx-auto mt-12 max-w-xl text-base text-mid sm:text-lg" style={{
            opacity: useTransform(scrollYProgress, [0.75, 0.95], [0, 1]),
            y: useTransform(scrollYProgress, [0.75, 0.95], [20, 0]),
          }}>
            Tournament OS replaces spreadsheets, manual check-ins, brittle brackets, and DM chaos with one operating system that runs end to end — automatically.
          </motion.p>

          <motion.div className="mt-8 flex justify-center" style={{
            opacity: useTransform(scrollYProgress, [0.82, 0.98], [0, 1]),
            y: useTransform(scrollYProgress, [0.82, 0.98], [20, 0]),
          }}>
            <Button variant="primary" size="lg" href="#cta" iconRight={ArrowRight}>See the system in action</Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{
          opacity: useTransform(scrollYProgress, [0, 0.1, 0.85, 0.95], [0, 1, 1, 0]),
        }}>
          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-void-900/70 px-3 py-1.5 backdrop-blur">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lo">keep scrolling</span>
            <motion.span className="font-mono text-[14px] text-cyan-400" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↓</motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
