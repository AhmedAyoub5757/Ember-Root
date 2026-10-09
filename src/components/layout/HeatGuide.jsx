import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { flavors } from "../../data/products";
import { heatLevels } from "../../data/shop";
import { bottleFor } from "../../lib/assets";
import { inkFor } from "../../lib/color";
import HeatRuler from "../ui/HeatRuler";
import Roll from "../ui/Roll";
import HeatScale from "../sections/HeatScale";

const ease = [0.2, 0.7, 0.2, 1];

const meaning = {
  1: "A warm hum rather than a burn. Nothing in the range sits here yet.",
  2: "A gentle glow that fades within a minute. Good for everyday cooking, and for people who say they don't like spicy.",
  3: "Properly warm. You'll notice it, you'll reach for a drink, and you'll go back for more.",
  4: "Fierce. Sweating, hiccups, and a new respect for the amount you used.",
  5: "Reckless. Use drops, not spoons, and keep milk nearby.",
};

const helps = [
  "Milk or yogurt. Capsaicin dissolves in fat, and dairy carries it away.",
  "A spoon of sugar or honey.",
  "Bread, rice or other starch to soak it up.",
  "Time. The burn peaks and fades, usually within a few minutes.",
];
const hurts = [
  "Water. Capsaicin doesn't dissolve in it, so it mostly spreads the burn around.",
  "Rubbing your eyes. Wash your hands first, always.",
  "Doubling the dose to prove a point.",
];

function Brave() {
  const [level, setLevel] = useState(3);
  const word = heatLevels.find((h) => h.n === level).word;

  const pick = useMemo(
    () =>
      [...flavors].sort(
        (a, b) => Math.abs(a.heat - level) - Math.abs(b.heat - level) || a.no.localeCompare(b.no)
      )[0],
    [level]
  );
  const ink = inkFor(pick.color);

  return (
    <section className="mt-28 lg:mt-40" aria-labelledby="brave-title">
      <p className="label opacity-60">Fig. 3 — A quick fitting</p>
      <h2 id="brave-title" className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold">
        How brave are you?
      </h2>

      <div className="mt-10 grid grid-cols-1 items-end gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-6">
          <p className="label opacity-60">Today I'm feeling</p>
          <p className="display mt-3 text-[clamp(3.5rem,9vw,7rem)] font-semibold">
            <Roll value={word} height="1.1em" />
          </p>

          <div className="mt-8 flex items-end justify-between" aria-hidden>
            {Array.from({ length: 25 }, (_, i) => (
              <span
                key={i}
                className={`w-[2px] bg-current transition-opacity duration-300 ${i % 5 === 0 ? "h-5" : "h-3"}`}
                style={{ opacity: i < level * 5 ? 1 : 0.2 }}
              />
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            aria-label="How much heat do you want, from 1 to 5"
            aria-valuetext={word}
            className="mt-4 h-6 w-full cursor-pointer accent-current"
          />
          <p className="label mt-2 flex justify-between opacity-60">
            <span>Gentle</span>
            <span>Reckless</span>
          </p>
          <p className="mt-6 max-w-[42ch] leading-relaxed opacity-85">{meaning[level]}</p>
        </div>

        <div className="col-span-1 lg:col-span-6">
          <motion.div
            animate={{ backgroundColor: pick.color, color: ink }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative h-[min(58svh,500px)] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pick.id}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <p className="label absolute left-5 top-5">
                  No. {pick.no} / {pick.heat === level ? "A match" : "Closest we make"}
                </p>
                <img
                  src={bottleFor(pick.id)}
                  alt={`${pick.name} bottle`}
                  draggable={false}
                  className="absolute bottom-0 right-[6%] h-[90%] w-auto drop-shadow-[0_24px_22px_rgba(0,0,0,0.3)]"
                />
                <div className="absolute bottom-5 left-5 max-w-[46%]">
                  <p className="display-s text-3xl lg:text-4xl">{pick.name}</p>
                  <div className="mt-3">
                    <HeatRuler level={pick.heat} color="currentColor" />
                  </div>
                  <Link to={`/flavor/${pick.id}`} className="label mt-5 inline-block border-b border-current pb-1">
                    See the bottle →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HeatGuide() {
  const [activeId, setActiveId] = useState(flavors[0].id);

  useEffect(() => { document.title = "Heat guide: Ember & Root"; }, []);

  return (
    <div className="px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <header className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-8">
            <p className="label opacity-60">Learn / Heat guide</p>
            <h1 className="display mt-5 text-[clamp(3.2rem,9vw,8.5rem)] font-semibold">
              {["Heat,", "measured."].map((t, i) => (
                <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[10vw]" : ""}`}>
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: i * 0.12, ease }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>
          <div className="col-span-1 lg:col-span-4 lg:self-end">
            <p className="max-w-[40ch] leading-relaxed opacity-80">
              Pepper heat is counted in Scoville heat units, a scale devised
              by Wilbur Scoville in 1912. Today it's usually measured in a lab and
              converted to SHU. Each step up the scale is a big jump, so we draw
              it on a log scale.
            </p>
          </div>
        </header>

        <HeatScale activeId={activeId} setActive={setActiveId} />

        {/* five steps */}
        <section className="mt-28 lg:mt-40" aria-labelledby="steps-title">
          <p className="label opacity-60">Five steps</p>
          <h2 id="steps-title" className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold">
            What the numbers mean.
          </h2>

          <ol className="hair-b mt-10">
            {heatLevels.map(({ n, word }) => {
              const here = flavors.filter((f) => f.heat === n);
              return (
                <li key={n} className="hair grid grid-cols-1 items-start gap-x-8 gap-y-4 py-7 lg:grid-cols-12">
                  <span className="label col-span-1 pt-2 lg:col-span-1">{String(n).padStart(2, "0")}</span>
                  <div className="col-span-1 lg:col-span-3">
                    <p className="display text-4xl font-semibold lg:text-5xl">{word}</p>
                    <div className="mt-3"><HeatRuler level={n} color="currentColor" /></div>
                  </div>
                  <p className="col-span-1 max-w-[44ch] leading-relaxed opacity-85 lg:col-span-4">{meaning[n]}</p>
                  <ul className="col-span-1 flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
                    {here.length === 0 && <li className="label opacity-50">None in the range yet</li>}
                    {here.map((f) => (
                      <li key={f.id}>
                        <Link
                          to={`/flavor/${f.id}`}
                          className="label inline-flex items-center gap-2 border border-current px-3 py-2 transition-colors hover:bg-soil hover:text-paper"
                        >
                          <span className="h-2.5 w-2.5" style={{ background: f.color }} aria-hidden />
                          {f.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </section>

        <Brave />

        {/* put out the fire */}
        <section className="mt-28 lg:mt-40" aria-labelledby="fire-title">
          <p className="label opacity-60">Fig. 4 — First aid</p>
          <h2 id="fire-title" className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold">
            Putting out the fire.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
            {[["What helps", helps], ["What doesn't", hurts]].map(([title, items]) => (
              <div key={title} className="col-span-1 lg:col-span-6">
                <p className="label opacity-60">{title}</p>
                <ul className="mt-4">
                  {items.map((t) => (
                    <li key={t} className="hair flex gap-4 py-4">
                      <span aria-hidden className="label opacity-60">{title === "What helps" ? "+" : "×"}</span>
                      <span className="max-w-[46ch] leading-relaxed">{t}</span>
                    </li>
                  ))}
                  <li className="hair" />
                </ul>
              </div>
            ))}
          </div>

          <p className="label mt-8 max-w-[70ch] opacity-70">
            If you've eaten far too much and feel unwell, with trouble breathing
            or vomiting that won't stop, get medical help.
          </p>
        </section>
      </div>
    </div>
  );
}