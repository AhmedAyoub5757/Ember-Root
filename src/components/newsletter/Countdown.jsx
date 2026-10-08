import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const pad = (n) => String(n).padStart(2, "0");

function Cell({ label, value }) {
  return (
    <div className="hair min-w-0 pt-3">
      <div className="relative h-[clamp(2.8rem,7vw,6rem)] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "70%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-70%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="display absolute left-0 top-0 block tabular-nums text-[clamp(2.8rem,7vw,6rem)]"
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="label mt-2 opacity-70">{label}</p>
    </div>
  );
}

export default function Countdown({ target }) {
  const end = useMemo(() => new Date(target).getTime(), [target]);
  const [left, setLeft] = useState(() => end - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(end - Date.now()), 1000);
    return () => clearInterval(id);
  }, [end]);

  if (left <= 0) {
    return <p className="display text-6xl font-semibold lg:text-8xl">Open now.</p>;
  }

  const s = Math.floor(left / 1000);
  const parts = [
    ["Days", Math.floor(s / 86400)],
    ["Hours", Math.floor((s % 86400) / 3600)],
    ["Min", Math.floor((s % 3600) / 60)],
    ["Sec", s % 60],
  ];

  return (
    <div role="timer" aria-label="Time until the crock opens">
      <p className="label mb-4 opacity-70">The crock opens in</p>
      <div className="grid min-w-0 grid-cols-4 gap-x-4 lg:gap-x-6">
        {parts.map(([l, v]) => (
          <Cell key={l} label={l} value={v} />
        ))}
      </div>
    </div>
  );
}