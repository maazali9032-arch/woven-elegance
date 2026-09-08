import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const WARP_COUNT = 24;
const WEFT_ROWS = 26;

/**
 * The loom itself: vertical warp threads are strung first, then weft rows are
 * woven across them as the visitor scrolls. This is the structural substrate
 * of the whole invitation — everything else is woven on top of it.
 */
export function WarpField() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const wovenRaw = useTransform(scrollYProgress, [0, 0.92], [0, WEFT_ROWS]);
  const [woven, setWoven] = useState(reduced ? WEFT_ROWS : 2);

  useEffect(() => {
    if (reduced) return;
    const unsub = wovenRaw.on("change", (v) => setWoven(Math.max(2, Math.round(v))));
    return () => unsub();
  }, [wovenRaw, reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--zar-burgundy)_55%,transparent),transparent_65%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
      >
        {/* warp threads */}
        {Array.from({ length: WARP_COUNT }).map((_, i) => {
          const x = (i + 0.5) * (100 / WARP_COUNT);
          return (
            <motion.line
              key={`warp-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={200}
              stroke="var(--zar-gold)"
              strokeWidth={0.12}
              strokeOpacity={0.28}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.1 + i * 0.035, ease: "easeInOut" }}
            />
          );
        })}
        {/* weft rows woven across as the story progresses */}
        {Array.from({ length: WEFT_ROWS }).map((_, r) => {
          if (r > woven) return null;
          const y = (r + 0.5) * (200 / WEFT_ROWS);
          const tone =
            r % 3 === 0
              ? "var(--zar-teal)"
              : r % 3 === 1
                ? "var(--zar-saffron)"
                : "var(--zar-burgundy)";
          return (
            <motion.line
              key={`weft-${r}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              stroke={tone}
              strokeWidth={0.55}
              strokeOpacity={0.16}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
