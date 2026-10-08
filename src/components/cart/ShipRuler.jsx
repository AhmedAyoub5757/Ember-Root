import { AnimatePresence, motion } from "framer-motion";
import { FREE_SHIP, fmt } from "../../lib/money";

const ease = [0.2, 0.7, 0.2, 1];

export default function ShipRuler({ sub }) {
  const p = Math.min(1, sub / FREE_SHIP);
  const done = sub >= FREE_SHIP;

  return (
    <div>
      <div className="label flex min-w-0 items-center justify-between gap-3">
        <span aria-live="polite" className="min-w-0 truncate">
          {done ? "Free shipping unlocked" : `${fmt(FREE_SHIP - sub)} to free shipping`}
        </span>
        <span className="flex shrink-0 items-center gap-2 opacity-60">
          {fmt(FREE_SHIP)}
          <AnimatePresence>
            {done && (
              <motion.span
                initial={{ scale: 2.2, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 8 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 17 }}
                className="border-2 border-chili px-2 py-0.5 text-chili opacity-100"
              >
                Free
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      <div className="mx-1.5 mt-4 min-w-0">
        <div className="relative h-5" role="img" aria-label={`${Math.round(p * 100)}% of the way to free shipping`}>
          <span className="absolute inset-x-0 top-1/2 h-px bg-current opacity-30" />
          <motion.span
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-current"
            initial={{ width: 0 }}
            animate={{ width: `${p * 100}%` }}
            transition={{ duration: 0.8, ease }}
          />
          {Array.from({ length: 11 }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute top-1/2 w-px -translate-y-1/2 bg-current opacity-50"
              style={{ left: `${i * 10}%`, height: i % 5 === 0 ? 14 : 7 }}
            />
          ))}
          <motion.span
            aria-hidden
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current ring-2 ring-paper"
            initial={{ left: "0%" }}
            animate={{ left: `${p * 100}%` }}
            transition={{ duration: 0.8, ease }}
          />
        </div>
      </div>
    </div>
  );
}