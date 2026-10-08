import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const bands = [
  [0.12, "A warm hello"],
  [0.3, "A pleasant glow"],
  [0.55, "Sweating a little"],
  [0.8, "Properly brave"],
  [1.01, "Sign the waiver"],
];

export default function Dose({ f }) {
  const [drops, setDrops] = useState(3);
  const power = (drops / 10) * (f.heat / 5);
  const lit = Math.round(power * 25);
  const verdict = bands.find(([max]) => power <= max)[1];

  return (
    <section className="mt-12" aria-labelledby="dose-title">
      <p id="dose-title" className="label opacity-70">Dose it · drops per plate</p>

      <div className="mt-4 flex items-end justify-between gap-6">
        <p className="display tabular-nums text-6xl">{String(drops).padStart(2, "0")}</p>
        <div className="relative h-8 overflow-hidden text-right">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={verdict}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="display-s whitespace-nowrap text-2xl italic"
            >
              {verdict}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between" aria-hidden>
        {Array.from({ length: 25 }, (_, i) => (
          <span
            key={i}
            className={`w-[2px] bg-current transition-opacity duration-300 ${i % 5 === 0 ? "h-5" : "h-3"}`}
            style={{ opacity: i < lit ? 1 : 0.2 }}
          />
        ))}
      </div>

      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={drops}
        onChange={(e) => setDrops(Number(e.target.value))}
        aria-label="Drops per plate"
        className="mt-4 h-6 w-full cursor-pointer accent-current"
      />
      <p className="label mt-1 opacity-60">A playful guide, not science. Heat is personal.</p>
    </section>
  );
}