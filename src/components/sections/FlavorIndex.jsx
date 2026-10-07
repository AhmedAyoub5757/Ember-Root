import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { flavors } from "../../data/products";
import { inkFor } from "../../lib/color";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { useCart } from "../../store/cart";
import HeatRuler from "../ui/HeatRuler";
import Button from "../ui/Button";
import Specimen from "./Specimen";

const ease = [0.2, 0.7, 0.2, 1];

const rise = {
  hidden: { y: "105%" },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: i * 0.12, ease } }),
};

function Row({ f, i, isActive, isDesktop, setActive }) {
  const Tag = isDesktop ? Link : "button";
  const tagProps = isDesktop
    ? { to: `/flavor/${f.id}`, onFocus: () => setActive(f.id) }
    : { type: "button", onClick: () => setActive(f.id), "aria-expanded": isActive };
  const ink = inkFor(f.color);

  return (
    <motion.li
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: i * 0.06, ease }}
      onMouseEnter={() => isDesktop && setActive(f.id)}
      className="hair relative"
    >
      {/* colour wipe */}
      <motion.span
        aria-hidden
        className="absolute inset-0 origin-left"
        style={{ background: f.color }}
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      />

      <Tag
        {...tagProps}
        style={{ color: isActive ? ink : undefined }}
        className="relative grid w-full grid-cols-[2.75rem_1fr_auto] items-center gap-x-3 px-3 py-5 text-left transition-colors duration-300 lg:grid-cols-[4rem_1fr_auto] lg:py-6"
      >
        <span className="label">{f.no}</span>
        <span>
          <span className="display block text-4xl lg:text-5xl xl:text-6xl">{f.name}</span>
          <span className="label mt-1 block opacity-70">
            {f.latin} · {f.scoville} SHU
          </span>
        </span>
        <span className="flex items-center gap-5">
          <span className="hidden xl:block">
            <HeatRuler level={f.heat} color="currentColor" />
          </span>
          <span className="label" aria-hidden>
            {isDesktop ? "→" : isActive ? "–" : "+"}
          </span>
        </span>
      </Tag>

      {/* mobile: the specimen opens inside the row */}
      <AnimatePresence initial={false}>
        {isActive && !isDesktop && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden"
            style={{ color: ink }}
          >
            <div className="px-3 pb-8 pt-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] text-soil">
                <Specimen f={f} />
              </div>
              <Link
                to={`/flavor/${f.id}`}
                className="label mt-6 inline-block border-b border-current pb-1"
              >
                Open the plate →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function FlavorIndex() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeId, setActiveId] = useState(flavors[0].id);
  const active = flavors.find((f) => f.id === activeId);
  const add = useCart((s) => s.add);

  return (
    <section id="index" className="relative px-5 pb-28 pt-24 lg:px-8 lg:pb-36 lg:pt-32">
      <div className="mx-auto max-w-[1400px]">
        {/* header */}
        <header className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <p className="label opacity-60">02 / Index of varieties</p>
            <h2 className="display mt-5 text-[clamp(3.2rem,9vw,8.5rem)] font-semibold">
              {["Six varieties,", "one field."].map((t, i) => (
                <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[12vw]" : ""}`}>
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
              Every bottle starts as a single plant. Roasted, fermented or smoked
              slowly, and bottled in small batches. Pick a variety to see what
              went into it.
            </p>
            <p className="label mt-5 opacity-60">
              {isDesktop ? "Hover a row to pull the specimen" : "Tap a row to open the specimen"}
            </p>
          </div>
        </header>

        {/* index + specimen */}
        <div className="mt-16 grid grid-cols-12 gap-x-8 lg:mt-24">
          <ol className="hair-b col-span-12 lg:col-span-7">
            {flavors.map((f, i) => (
              <Row
                key={f.id}
                f={f}
                i={i}
                isActive={f.id === activeId}
                isDesktop={isDesktop}
                setActive={setActiveId}
              />
            ))}
          </ol>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[128px]">
              <div className="relative ml-auto aspect-[4/5] h-[min(calc(100svh-260px),640px)]">
                <AnimatePresence>
                  <Specimen key={active.id} f={active} />
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="label">Rs {active.price.toLocaleString()} · 150 ml</span>
                <Button onClick={() => add(active.id)}>Add to cart</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}