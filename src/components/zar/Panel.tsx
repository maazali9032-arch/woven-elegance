import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useInView } from "./useInView";
import { WovenBorder } from "./WovenBorder";

/**
 * A woven textile plaque. The parchment field is revealed row by row via a
 * clip that steps down the panel, then the border knots are placed.
 */
export function Panel({
  children,
  className = "",
  tone = "parchment",
}: {
  children: ReactNode;
  className?: string;
  tone?: "parchment" | "dark";
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-sm border border-zar-gold/40 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.85)] ${
        tone === "parchment" ? "zar-parchment" : "bg-zar-burgundy-deep/85 zar-weave-texture"
      } ${className}`}
    >
      <WovenBorder units={18} height={10} />
      <div className={tone === "parchment" ? "px-5 py-6" : "px-5 py-6 text-zar-cream"}>
        {children}
      </div>
      <WovenBorder units={18} height={10} />
      {/* Unwoven curtain: recedes upward as the rows are knotted in. */}
      {!reduced && (
        <motion.div
          aria-hidden
          initial={{ scaleY: 1 }}
          animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 1 }}
          className="pointer-events-none absolute inset-0 bg-zar-burgundy-deep zar-weave-texture"
        />
      )}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="zar-eyebrow text-zar-gold">{children}</h2>
      <div className="zar-gold-rule mx-auto mt-3 h-px w-24" />
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-md px-5 py-14 ${className}`}>
      {children}
    </section>
  );
}
