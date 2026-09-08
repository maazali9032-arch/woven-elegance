import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useInView } from "./useInView";

interface Props {
  children?: ReactNode;
  className?: string;
}

const draw = (delay: number, duration = 1.6) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: {
    pathLength: { duration, delay, ease: "easeInOut" as const },
    opacity: { duration: 0.3, delay },
  },
});

/**
 * The hero medallion. Its geometry is drawn stroke by stroke — frame first,
 * then cusped inner field, then the floral repeats knotted into the corners.
 */
export function Medallion({ children, className = "" }: Props) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const on = inView || reduced;

  const petals = Array.from({ length: 8 }).map((_, i) => i);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        viewBox="0 0 300 420"
        className="w-full"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        {/* outer diamond frame */}
        <motion.path
          d="M150 8 L292 210 L150 412 L8 210 Z"
          stroke="var(--zar-gold)"
          strokeWidth={1.4}
          {...(reduced ? {} : draw(0.1))}
          animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M150 24 L276 210 L150 396 L24 210 Z"
          stroke="var(--zar-saffron)"
          strokeWidth={0.8}
          strokeOpacity={0.8}
          {...(reduced ? {} : draw(0.55))}
          animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        />
        {/* cusped inner field */}
        <motion.path
          d="M150 44 C196 100 236 148 258 210 C236 272 196 320 150 376 C104 320 64 272 42 210 C64 148 104 100 150 44 Z"
          stroke="var(--zar-burgundy)"
          strokeWidth={1.6}
          fill="color-mix(in oklab, var(--zar-cream) 90%, transparent)"
          {...(reduced ? {} : draw(0.9, 1.9))}
          animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        />
        {/* knotted floral repeats around the medallion */}
        {petals.map((i) => {
          const angle = (i / petals.length) * Math.PI * 2;
          const cx = 150 + Math.sin(angle) * 118;
          const cy = 210 + Math.cos(angle) * 168;
          return (
            <motion.g
              key={i}
              initial={reduced ? false : { opacity: 0, scale: 0 }}
              animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.4, delay: 1.6 + i * 0.09 }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
            >
              <path
                d={`M ${cx} ${cy - 7} L ${cx + 5} ${cy} L ${cx} ${cy + 7} L ${cx - 5} ${cy} Z`}
                fill={i % 2 ? "var(--zar-teal)" : "var(--zar-burgundy)"}
                fillOpacity={0.9}
              />
              <circle cx={cx} cy={cy} r={1.8} fill="var(--zar-saffron)" />
            </motion.g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center px-8">{children}</div>
    </div>
  );
}
