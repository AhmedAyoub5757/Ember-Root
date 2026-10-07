import { AnimatePresence, motion, useTransform } from "framer-motion";
import { chapters, TOTAL_DAYS } from "../../data/story";

const last = chapters.length - 1;
const minors = last * 4;

export default function Gauge({ progress, dayText, active, onJump }) {
  const head = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="sticky top-[128px] flex h-[calc(100svh-168px)] max-h-[720px] gap-8">
      {/* ruler */}
      <nav aria-label="Chapters" className="relative w-14 shrink-0">
        <span className="absolute left-[30px] top-0 h-full w-px bg-current opacity-25" />
        <motion.span
          className="absolute left-[29px] top-0 h-full w-[3px] origin-top bg-current"
          style={{ scaleY: progress }}
        />

        {Array.from({ length: minors + 1 }, (_, t) => (
          <span
            key={t}
            aria-hidden
            className="absolute left-[30px] h-px bg-current opacity-50"
            style={{ top: `${(t / minors) * 100}%`, width: t % 4 === 0 ? 14 : 7 }}
          />
        ))}

        {chapters.map((c, i) => (
          <button
            key={c.no}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Go to chapter ${c.no}, ${c.name}`}
            className="label absolute left-0 -translate-y-1/2 transition-opacity duration-300 hover:opacity-100"
            style={{ top: `${(i / last) * 100}%`, opacity: active === i ? 1 : 0.45 }}
          >
            {c.no}
          </button>
        ))}

        <motion.span
          aria-hidden
          className="absolute left-[25px] h-[11px] w-[11px] -translate-y-1/2 rotate-45 bg-current"
          style={{ top: head }}
        />
      </nav>

      {/* counter */}
      <div className="flex min-w-0 flex-col justify-between">
        <p className="label opacity-60">Elapsed since sowing</p>

        <div>
          <p className="label opacity-60">Day</p>
          <motion.p className="display tabular-nums text-[clamp(5rem,8.5vw,8.5rem)]">{dayText}</motion.p>
          <p className="label opacity-60">of {TOTAL_DAYS}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="display-s text-3xl">{chapters[active].name}</p>
            <p className="label mt-1 opacity-60">{chapters[active].season}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}