import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { bottleFor } from "../../lib/assets";
import { inkFor } from "../../lib/color";
import { fmt, unitPrice } from "../../lib/money";
import HeatRuler from "../ui/HeatRuler";
import Roll from "../ui/Roll";

const ease = [0.2, 0.7, 0.2, 1];

const ShopRow = forwardRef(function ShopRow({ f, i, size, added, onAdd }, ref) {
  const [on, setOn] = useState(false);
  const ink = inkFor(f.color);
  const price = unitPrice(f, size.id);

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: Math.min(i, 8) * 0.05, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ layout: { duration: 0.5, ease } }}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOn(false);
      }}
      className={`hair relative transition-colors duration-300 ${on ? "z-20" : "z-0"}`}
      style={{ color: on ? ink : undefined }}
    >
      {/* colour wipe */}
      <motion.span
        aria-hidden
        className="absolute inset-0 origin-left"
        style={{ background: f.color }}
        initial={false}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      />

      {/* the bottle breaks out of the row (wide screens only) */}
      <motion.img
        src={bottleFor(f.id)}
        alt=""
        aria-hidden
        draggable={false}
        initial={false}
        animate={{ opacity: on ? 1 : 0, y: on ? 0 : 36, rotate: on ? 4 : 10 }}
        transition={{ duration: 0.55, ease }}
        className="pointer-events-none absolute bottom-0 right-[22rem] z-10 hidden h-[190%] w-auto drop-shadow-[0_22px_20px_rgba(0,0,0,0.3)] xl:block"
      />

      <div className="relative grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-2 py-5 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:px-3 lg:grid-cols-[3rem_minmax(0,1.5fr)_minmax(0,1fr)_8rem_9rem] lg:gap-x-6 lg:py-7">
        {/* number on desktop, colour-block thumbnail on mobile */}
        <span className="label hidden lg:block">{f.no}</span>
        <span
          aria-hidden
          className="relative col-start-1 row-span-3 row-start-1 block h-[6.5rem] w-16 overflow-hidden lg:hidden"
          style={{ background: f.color }}
        >
          <img
            src={bottleFor(f.id)}
            alt=""
            draggable={false}
            className="absolute inset-x-0 -bottom-1 mx-auto h-[112%] w-auto max-w-none object-contain"
          />
        </span>

        {/* name: the whole row is a link through the stretched ::after */}
        <div className="col-span-2 col-start-2 row-start-1 min-w-0 lg:col-span-1 lg:col-start-auto lg:row-start-auto">
          <Link
            to={`/flavor/${f.id}`}
            className="display block break-words text-[clamp(1.65rem,8vw,3.75rem)] leading-[0.95] after:absolute after:inset-0 sm:text-[clamp(2rem,4.2vw,3.75rem)]"
          >
            {f.name}
          </Link>
          <span className="mt-1 grid">
            <span className={`label col-start-1 row-start-1 truncate transition-opacity duration-300 ${on ? "opacity-0" : "opacity-70"}`}>
              {f.latin} · {f.scoville} SHU
            </span>
            <span className={`col-start-1 row-start-1 truncate text-sm transition-opacity duration-300 ${on ? "opacity-90" : "opacity-0"}`}>
              {f.notes}
            </span>
          </span>
        </div>

        {/* heat */}
        <div className="col-span-2 col-start-2 row-start-2 lg:col-span-1 lg:col-start-auto lg:row-start-auto">
          <HeatRuler level={f.heat} color="currentColor" />
          <p className="label mt-2 opacity-70">Heat {f.heat} / 5</p>
        </div>

        {/* price */}
        <div className="col-start-2 row-start-3 lg:col-start-auto lg:row-start-auto lg:text-right">
          <p className="display-s text-2xl">
            <Roll value={fmt(price)} />
          </p>
          <p className="label opacity-70">{size.ml} ml</p>
        </div>

        {/* add (z-10 keeps it above the stretched link) */}
        <button
          type="button"
          onClick={() => onAdd(f.id)}
          aria-label={`Add ${f.name}, ${size.ml} ml, to cart`}
          className="label relative z-10 col-start-3 row-start-3 inline-flex h-11 min-w-0 items-center justify-between gap-2 justify-self-end border border-current px-3 transition-transform duration-200 hover:-translate-y-0.5 sm:min-w-[7rem] sm:px-4 lg:col-start-auto lg:row-start-auto"
        >
          <span aria-live="polite">{added ? "Added ✓" : "Add"}</span>
          <span aria-hidden>{added ? "" : "+"}</span>
        </button>
      </div>
    </motion.li>
  );
});

export default ShopRow;