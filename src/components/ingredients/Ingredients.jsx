import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ingredients } from "../../data/ingredients";
import { flavors } from "../../data/products";
import { useMediaQuery } from "../../lib/useMediaQuery";
import Plate from "./Plate";
import SeasonStrip from "./SeasonStrip";

const ease = [0.2, 0.7, 0.2, 1];
const N = ingredients.length;

const rise = {
  hidden: { y: "105%" },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: i * 0.12, ease } }),
};

const slide = {
  enter: (d) => ({ x: d * 90, opacity: 0, rotate: d * 3 }),
  center: { x: 0, opacity: 1, rotate: 0, transition: { duration: 0.7, ease } },
  exit: (d) => ({ x: d * -90, opacity: 0, rotate: d * -3, transition: { duration: 0.32 } }),
};

const notes = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Ingredients() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [[index, dir], setState] = useState([0, 1]);
  const [pin, setPin] = useState(null);
  const ing = ingredients[index];
  const panelSlide = isDesktop
    ? slide
    : {
        enter: { y: 32, opacity: 0, scale: 0.98 },
        center: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.55, ease } },
        exit: { y: -32, opacity: 0, scale: 0.98, transition: { duration: 0.25 } },
      };

  const go = (next) => {
    const i = (next + N) % N;
    if (i === index) return;
    setPin(null);
    setState([i, next > index ? 1 : -1]);
  };

  const onTabKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };

  const onSwipe = (_, info) => {
    const { x, y } = info.offset;
    if (Math.abs(x) > 70 && Math.abs(x) > Math.abs(y)) go(index + (x < 0 ? 1 : -1));
  };

  return (
    <section id="ingredients" className="bg-soil px-5 pb-28 pt-24 text-paper lg:px-8 lg:pb-36 lg:pt-32">
      <div className="mx-auto max-w-[1400px]">
        {/* header */}
        <header className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="display mt-5 text-[clamp(3.2rem,9vw,8.5rem)] font-semibold">
              {["Five plants,", "pressed & named."].map((t, i) => (
                <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[10vw]" : ""}`}>
                  <motion.span
                    className="block"
                    variants={rise}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:self-end">
            <p className="max-w-[38ch] leading-relaxed opacity-80">
              Everything starts in a drawer. Open one to meet the plant, see where
              it grows and when it's picked, and find which sauces it ends up in.
            </p>
          </div>
        </header>

        {/* drawer tabs */}
        <div
          role="tablist"
          aria-label="Ingredients"
          onKeyDown={onTabKey}
          className="no-scrollbar mt-14 flex gap-2 overflow-x-auto pb-1 lg:mt-20 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible"
        >
          {ingredients.map((x, i) => {
            const on = i === index;
            return (
              <button
                key={x.id}
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={on}
                aria-controls="ingredient-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => go(i)}
                className={`relative min-w-[9.5rem] shrink-0 border px-4 pb-3 pt-4 text-left transition-all duration-300 lg:min-w-0 ${
                  on
                    ? "-translate-y-1 border-paper bg-paper text-soil"
                    : "border-paper/30 hover:border-paper"
                }`}
              >
                <span className="label block opacity-70">{x.no}</span>
                <span className="display-s mt-1 block text-xl lg:text-2xl">{x.name}</span>
                <span className="pointer-events-none absolute inset-[3px] border border-current opacity-20" />
              </button>
            );
          })}
        </div>

        {/* sheet + notes */}
        <div id="ingredient-panel" role="tabpanel" aria-labelledby={`tab-${ing.id}`} className="mt-10 grid min-w-0 grid-cols-12 gap-x-0 gap-y-12 lg:mt-14 lg:gap-x-10">
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-[128px]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={ing.id}
                  custom={dir}
                  variants={panelSlide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full min-w-0"
                  onPanEnd={onSwipe}
                  style={{ touchAction: "pan-y" }}
                >
                  <Plate ing={ing} total={N} pin={pin} setPin={setPin} />
                </motion.div>
              </AnimatePresence>

              <div className="label mt-5 flex items-center justify-between">
                <span>{String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</span>
                <span className="flex gap-6">
                  <button type="button" onClick={() => go(index - 1)} className="border-b border-current pb-1">← Prev</button>
                  <button type="button" onClick={() => go(index + 1)} className="border-b border-current pb-1">Next →</button>
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-12 min-w-0 lg:col-span-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={ing.id} variants={notes} initial="enter" animate="center" exit="exit">
                <p className="label opacity-60">No. {ing.no} / {ing.latin}</p>
                <h3 className="display mt-3 text-5xl font-semibold lg:text-6xl">{ing.name}</h3>
                <p className="label mt-4 inline-block border border-current px-3 py-1.5">
                  Role: {ing.role}
                </p>
                <p className="mt-6 max-w-[44ch] leading-relaxed opacity-85">{ing.text}</p>

                {/* anatomy */}
                <p className="label mt-10 opacity-60">Anatomy</p>
                <ol className="mt-3">
                  {ing.pins.map((p, i) => {
                    const on = pin === i;
                    return (
                      <li key={p.t} className="hair">
                        <button
                          type="button"
                          onMouseEnter={() => setPin(i)}
                          onClick={() => setPin(on ? null : i)}
                          className={`grid w-full grid-cols-[2rem_1fr] gap-x-2 py-3 text-left transition-opacity duration-300 ${
                            pin === null || on ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          <span className="label pt-0.5">{i + 1}</span>
                          <span>
                            <span className="display-s block text-xl">{p.t}</span>
                            <span className="mt-1 block max-w-[40ch] text-sm leading-relaxed opacity-75">{p.d}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  <li className="hair" />
                </ol>

                {/* facts */}
                <dl className="mt-10">
                  {ing.facts.map(([k, v]) => (
                    <div key={k} className="hair flex justify-between gap-6 py-3 text-sm">
                      <dt className="label opacity-60">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
                  <div className="hair" />
                </dl>

                <div className="mt-10">
                  <SeasonStrip months={ing.months} />
                </div>

                {/* used in */}
                <p className="label mt-10 opacity-60">Used in</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ing.used.map((id) => {
                    const f = flavors.find((x) => x.id === id);
                    return (
                      <li key={id}>
                        <Link
                          to={`/flavor/${id}`}
                          className="label inline-flex items-center gap-3 border border-paper/40 px-3 py-2 transition-colors hover:border-paper hover:bg-paper hover:text-soil"
                        >
                          <span className="h-2.5 w-2.5" style={{ background: f.color }} />
                          {f.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <p className="display-s mt-10 max-w-[26ch] -rotate-2 text-xl italic opacity-90 lg:text-2xl">
                  ↳ {ing.note}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}