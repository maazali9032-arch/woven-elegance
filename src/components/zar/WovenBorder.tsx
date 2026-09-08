import { motion, useReducedMotion } from "motion/react";
import { useInView } from "./useInView";

const TONES = ["var(--zar-burgundy)", "var(--zar-teal)", "var(--zar-saffron)", "var(--zar-navy)"];

interface Props {
  units?: number;
  height?: number;
  className?: string;
  delay?: number;
}

/**
 * A carpet border built knot by knot: each unit is placed left-to-right,
 * exactly as a weaver fills one row of a border band.
 */
export function WovenBorder({ units = 26, height = 18, className = "", delay = 0 }: Props) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className={`w-full ${className}`} aria-hidden>
      <svg
        viewBox={`0 0 ${units * 10} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        {Array.from({ length: units }).map((_, i) => {
          const tone = TONES[i % TONES.length] ?? TONES[0];
          const x = i * 10;
          return (
            <motion.g
              key={i}
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.2 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              style={{ originX: `${x + 5}px`, originY: `${height / 2}px` }}
              transition={{ duration: 0.3, delay: delay + i * 0.035, ease: "easeOut" }}
            >
              <path
                d={`M ${x + 5} 1 L ${x + 9.4} ${height / 2} L ${x + 5} ${height - 1} L ${x + 0.6} ${height / 2} Z`}
                fill={tone}
                fillOpacity={0.85}
              />
              <circle
                cx={x + 5}
                cy={height / 2}
                r={1.5}
                fill="var(--zar-cream)"
                fillOpacity={0.7}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
