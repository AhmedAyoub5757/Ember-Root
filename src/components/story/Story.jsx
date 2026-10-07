import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { chapters, TOTAL_DAYS } from "../../data/story";
import Manifesto from "./Manifesto";
import Gauge from "./Gauge";
import Chapter from "./Chapter";
import Outro from "./Outro";

const N = chapters.length;
const W = 0.12; // how quickly colors change at chapter borders (in chapter units)

// Plateau per chapter, quick blend at the borders so text always stays readable
const stops = [], bgs = [], inks = [];
chapters.forEach((c, i) => {
  stops.push(i === 0 ? 0 : (i - 0.5 + W) / (N - 1), i === N - 1 ? 1 : (i + 0.5 - W) / (N - 1));
  bgs.push(c.bg, c.bg);
  inks.push(c.ink, c.ink);
});
const dayStops = chapters.map((_, i) => i / (N - 1));
const dayVals = chapters.map((c) => c.day);

const jump = (i) =>
  document.getElementById(`chapter-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

export default function Story() {
  const journal = useRef(null);
  const { scrollYProgress: progress } = useScroll({ target: journal, offset: ["start start", "end end"] });

  const bg = useTransform(progress, stops, bgs);
  const ink = useTransform(progress, stops, inks);
  const day = useTransform(progress, dayStops, dayVals);
  const dayText = useTransform(day, (v) => String(Math.round(v)).padStart(3, "0"));

  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(N - 1, Math.max(0, Math.round(v * (N - 1)))));
  });

  return (
    <section id="story">
      <Manifesto />

      {/* overflow-x-clip (not hidden) so position: sticky keeps working */}
      <motion.div ref={journal} style={{ backgroundColor: bg, color: ink }} className="overflow-x-clip">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
          {/* mobile: slim sticky readout */}
          <motion.div
            style={{ backgroundColor: bg }}
            className="sticky top-0 z-30 -mx-5 flex items-center justify-between px-5 py-3 lg:hidden"
          >
            <span className="label">
              Day <motion.span>{dayText}</motion.span> / {TOTAL_DAYS}
            </span>
            <span className="label">{chapters[active].no} {chapters[active].name}</span>
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left bg-current"
              style={{ scaleX: progress }}
            />
          </motion.div>

          <div className="grid grid-cols-12 gap-x-8">
            <aside className="hidden lg:col-span-4 lg:block">
              <Gauge progress={progress} dayText={dayText} active={active} onJump={jump} />
            </aside>
            <div className="col-span-12 lg:col-span-8">
              {chapters.map((c, i) => (
                <Chapter key={c.no} c={c} i={i} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <Outro />
    </section>
  );
}