import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionTitle } from "./Panel";

type Choice = "yes" | "no" | null;

/** Animation only. Nothing is stored, counted or transmitted. */
export function Rsvp() {
  const [choice, setChoice] = useState<Choice>(null);
  const reduced = useReducedMotion();

  return (
    <div className="text-center">
      <SectionTitle>Will you join us?</SectionTitle>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <RsvpButton
          active={choice === "yes"}
          dimmed={choice === "no"}
          tone="teal"
          label={"Will Be\nThere"}
          onClick={() => setChoice("yes")}
        />
        <RsvpButton
          active={choice === "no"}
          dimmed={choice === "yes"}
          tone="burgundy"
          label={"Regretfully\nDecline"}
          onClick={() => setChoice("no")}
        />
      </div>

      <div className="mt-6 min-h-14">
        <AnimatePresence mode="wait">
          {choice && (
            <motion.p
              key={choice}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-display text-lg italic text-zar-cream/85"
            >
              {choice === "yes"
                ? "A thread has been woven for you."
                : "You will be missed — thank you for letting us know."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="zar-eyebrow text-zar-cream/45">Your response means a lot to us</p>
    </div>
  );
}

function RsvpButton({
  label,
  tone,
  active,
  dimmed,
  onClick,
}: {
  label: string;
  tone: "teal" | "burgundy";
  active: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: reduced ? 1 : 0.97 }}
      animate={{ opacity: dimmed ? 0.4 : 1 }}
      className={`relative overflow-hidden rounded-sm border px-4 py-6 font-display text-lg leading-tight whitespace-pre-line transition-colors ${
        tone === "teal"
          ? "border-zar-gold/40 bg-zar-teal/70 text-zar-cream"
          : "border-zar-gold/40 bg-zar-burgundy/80 text-zar-cream"
      }`}
      aria-pressed={active}
    >
      {/* woven fill: threads run across the button when chosen */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.line
            key={i}
            x1={0}
            x2={100}
            y1={3 + i * 6}
            y2={3 + i * 6}
            stroke="var(--zar-saffron)"
            strokeWidth={1.2}
            strokeOpacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: 0.5, delay: active ? i * 0.05 : 0 }}
          />
        ))}
      </svg>
      <span className="relative">{label}</span>
      <motion.span
        className="relative mt-3 block text-xl"
        animate={active && !reduced ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {tone === "teal" ? "♥" : "❦"}
      </motion.span>
    </motion.button>
  );
}
