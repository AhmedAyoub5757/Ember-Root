import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { flavors } from "../data/products";
import { heroSlides } from "../data/hero";
import { flavorMeta } from "../data/flavorMeta";
import { defaultSize, sizes } from "../data/productExtra";
import { inkFor } from "../lib/color";
import { fmt, unitPrice } from "../lib/money";
import { useCart } from "../store/cart";
import HeatRuler from "../components/ui/HeatRuler";
import Gallery from "../components/product/Gallery";
import Buy from "../components/product/Buy";
import Dose from "../components/product/Dose";
import Details from "../components/product/Details";
import { JarLetters, NextBand, OtherVarieties } from "../components/product/Extras";

const N = flavors.length;
const ease = [0.2, 0.7, 0.2, 1];

export default function Product() {
  const { id } = useParams();
  const i = flavors.findIndex((f) => f.id === id);
  if (i < 0) return <Navigate to="/shop" replace />;
  return <View i={i} />;
}

function View({ i }) {
  const f = flavors[i];
  const prev = flavors[(i + N - 1) % N];
  const next = flavors[(i + 1) % N];
  const slide = heroSlides.find((s) => s.id === f.id);
  const ink = inkFor(f.color);

  const [sizeId, setSizeId] = useState(defaultSize);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [barOn, setBarOn] = useState(false);
  const size = sizes.find((s) => s.id === sizeId);
  const buyRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => { document.title = `${f.name} — Ember & Root`; }, [f.name]);

  // sticky add bar (mobile) shows whenever the buy panel is off-screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setBarOn(!e.isIntersecting));
    io.observe(buyRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onAdd = () => {
    useCart.getState().add(f.id, qty, size.id);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  const pairs = flavorMeta[f.id].pairs.split(" · ");

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: f.color, color: ink }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        {/* top strip: breadcrumb + flavor switcher */}
        <div className="hair-b flex items-center justify-between gap-6 py-4">
          <p className="label min-w-0 truncate">
            <Link to="/shop" className="opacity-70 hover:opacity-100">Shop</Link>
            <span className="opacity-50"> / </span>No. {f.no}
          </p>
          <nav aria-label="Switch variety" className="flex items-center gap-3">
            <Link to={`/flavor/${prev.id}`} replace className="label" aria-label={`Previous: ${prev.name}`}>← {prev.no}</Link>
            <ul className="flex gap-1.5">
              {flavors.map((x) => {
                const on = x.id === f.id;
                return (
                  <li key={x.id}>
                    <Link
                      to={`/flavor/${x.id}`}
                      replace
                      aria-label={x.name}
                      aria-current={on ? "page" : undefined}
                      className={`block h-4 w-4 border border-current transition-transform duration-200 hover:-translate-y-0.5 ${on ? "outline-2 outline-offset-2 outline-current" : ""}`}
                      style={{ background: x.color }}
                    />
                  </li>
                );
              })}
            </ul>
            <Link to={`/flavor/${next.id}`} replace className="label" aria-label={`Next: ${next.name}`}>{next.no} →</Link>
          </nav>
        </div>

        <div className="grid grid-cols-12 gap-x-0 gap-y-12 pb-8 pt-8 lg:gap-x-10 lg:pt-10">
          {/* left: gallery, pinned on desktop */}
          <div className="col-span-12 min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-[128px]">
              <Gallery f={f} size={size} ink={ink} slide={slide} />
            </div>
          </div>

          {/* right: the sheet */}
          <div className="col-span-12 min-w-0 lg:col-span-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <p className="label opacity-70">No. {f.no} / {f.latin}</p>
                <h1 aria-label={f.name} className="display mt-4 text-[clamp(3.2rem,6.4vw,6rem)] font-semibold">
                  <span aria-hidden className="block">{slide.lines[0]}</span>
                  <span aria-hidden className="block">{slide.lines[1]}</span>
                </h1>
                <p className="mt-5 max-w-[38ch] text-lg leading-relaxed">{slide.line}</p>

                <div className="mt-7">
                  <p className="label mb-2 opacity-70">Heat {f.heat} / 5 · {f.scoville} SHU</p>
                  <HeatRuler level={f.heat} color="currentColor" />
                </div>
                <p className="mt-6 max-w-[44ch] text-sm leading-relaxed opacity-85">{f.notes}</p>
              </motion.div>
            </AnimatePresence>

            <Buy
              f={f} ink={ink} size={size} setSize={setSizeId}
              qty={qty} setQty={setQty} added={added} onAdd={onAdd}
              innerRef={buyRef}
            />

            <div className="mt-12">
              <p className="label opacity-70">Pairs with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {pairs.map((p) => (
                  <li key={p} className="label border border-current px-3 py-2">{p}</li>
                ))}
              </ul>
            </div>

            <Dose key={f.id} f={f} />
            <Details key={`d-${f.id}`} f={f} />
          </div>
        </div>

        <JarLetters f={f} />
        <OtherVarieties current={f.id} />
      </div>

      <NextBand next={next} />

      {/* mobile sticky add bar */}
      <AnimatePresence>
        {barOn && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 px-5 py-3 lg:hidden"
            style={{ background: ink, color: f.color }}
          >
            <div className="min-w-0">
              <p className="display-s truncate text-lg">{f.name}</p>
              <p className="label opacity-70">{size.ml} ml · {fmt(unitPrice(f, size.id) * qty)}</p>
            </div>
            <button type="button" onClick={onAdd} className="label inline-flex shrink-0 items-center gap-2 border border-current px-5 py-3">
              <span>{added ? "Added" : "Add"}</span>
              <FontAwesomeIcon icon={added ? faCheck : faArrowRight} className="text-xs" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}