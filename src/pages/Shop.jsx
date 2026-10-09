import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { flavors } from "../data/products";
import { defaultSize, sizes } from "../data/productExtra";
import { heatLevels, sorts } from "../data/shop";
import { useCart } from "../store/cart";
import { HeatFilter, Segmented } from "../components/shop/Controls";
import ShopRow from "../components/shop/ShopRow";

const ease = [0.2, 0.7, 0.2, 1];
const sortOptions = sorts.map(({ id, label }) => ({ id, label }));
const sizeOptions = sizes.map((s) => ({ id: s.id, label: `${s.ml} ml` }));
const counts = Object.fromEntries(
  heatLevels.map(({ n }) => [n, flavors.filter((f) => f.heat === n).length])
);

const parseHeat = (raw) =>
  [...new Set((raw ?? "").split(",").map(Number))]
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5)
    .sort();

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const heatKey = params.get("heat");
  const heat = useMemo(() => parseHeat(heatKey), [heatKey]);
  const sortId = sorts.some((s) => s.id === params.get("sort")) ? params.get("sort") : "index";
  const sizeId = sizes.some((s) => s.id === params.get("size")) ? params.get("size") : defaultSize;
  const size = sizes.find((s) => s.id === sizeId);

  const [added, setAdded] = useState(null);
  const timer = useRef(null);

  useEffect(() => { document.title = "Shop: Ember & Root"; }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  // the address bar is the source of truth, so links and the back button just work
  const update = (patch) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const toggleHeat = (n) => {
    const set = heat.includes(n) ? heat.filter((x) => x !== n) : [...heat, n].sort();
    update({ heat: set.length ? set.join(",") : null });
  };

  const list = useMemo(() => {
    const fn = sorts.find((s) => s.id === sortId).fn;
    return flavors.filter((f) => !heat.length || heat.includes(f.heat)).sort(fn);
  }, [heat, sortId]);

  const add = (id) => {
    useCart.getState().add(id, 1, sizeId);
    setAdded(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(null), 1400);
  };

  return (
    <div className="overflow-hidden px-4 pb-28 pt-8 sm:px-5 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        {/* header */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-7 sm:gap-x-8 sm:gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <p className="label opacity-60">Shop / The catalogue</p>
            <h1 className="display mt-5 text-[clamp(2.9rem,13vw,8.5rem)] font-semibold">
              {["The whole", "field."].map((t, i) => (
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

          <div className="col-span-12 lg:col-span-4 lg:self-end">
            <p className="max-w-[38ch] leading-relaxed opacity-80">
              Six varieties, ordered by number. Filter by how brave you feel,
              and point at a row to meet the bottle.
            </p>
            <p className="label mt-5 opacity-60" aria-live="polite">
              Showing {String(list.length).padStart(2, "0")} of {String(flavors.length).padStart(2, "0")} varieties
            </p>
          </div>
        </header>

        <p className="label mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 opacity-60 lg:mt-10">
          <span>Looking for a set?</span>
          <Link to="/shop/trio" className="border-b border-current pb-0.5 transition-opacity hover:opacity-100">
            The Trio Box
          </Link>
          <span aria-hidden>·</span>
          <Link to="/shop/gifts" className="border-b border-current pb-0.5 transition-opacity hover:opacity-100">
            Gift sets
          </Link>
        </p>

        {/* controls */}
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 sm:gap-x-10 sm:gap-y-9 lg:mt-20">
          <div className="col-span-12 lg:col-span-6">
            <HeatFilter
              active={heat}
              counts={counts}
              toggle={toggleHeat}
              clear={() => update({ heat: null })}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Segmented
              label="Order"
              value={sortId}
              options={sortOptions}
              onChange={(id) => update({ sort: id === "index" ? null : id })}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Segmented
              label="Prices for"
              value={sizeId}
              options={sizeOptions}
              onChange={(id) => update({ size: id === defaultSize ? null : id })}
            />
          </div>
        </div>

        {/* the ledger */}
        <div className="mt-12 lg:mt-20">
          <div className="label hidden grid-cols-[3rem_minmax(0,1.5fr)_minmax(0,1fr)_8rem_9rem] gap-x-6 px-3 pb-3 opacity-60 lg:grid">
            <span>No.</span>
            <span>Variety</span>
            <span>Heat</span>
            <span className="text-right">Price</span>
            <span />
          </div>

          {list.length === 0 ? (
            <div className="hair hair-b py-20">
              <p className="display text-5xl font-semibold lg:text-7xl">
                Nothing<br />at that heat.
              </p>
              <button
                type="button"
                onClick={() => update({ heat: null })}
                className="label mt-8 border-b border-current pb-1"
              >
                Clear the filter
              </button>
            </div>
          ) : (
            <ul className="hair-b relative">
              <AnimatePresence mode="popLayout" initial>
                {list.map((f, i) => (
                  <ShopRow
                    key={f.id}
                    f={f}
                    i={i}
                    size={size}
                    added={added === f.id}
                    onAdd={add}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}

          <p className="label mt-6 flex flex-wrap justify-between gap-x-8 gap-y-2 opacity-60">
            <span>Cash on delivery across Pakistan · Card at checkout</span>
            <span>Free shipping over Rs 5,000 · Batch 07</span>
          </p>
        </div>
      </div>
    </div>
  );
}