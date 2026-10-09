import { AnimatePresence, motion } from "framer-motion";
import { sizes } from "../../data/productExtra";
import { fmt, unitPrice } from "../../lib/money";

const ease = [0.2, 0.7, 0.2, 1];

export default function Buy({ f, ink, size, setSize, qty, setQty, added, onAdd, innerRef }) {
  const unit = unitPrice(f, size.id);
  const total = unit * qty;

  return (
    <div ref={innerRef} className="mt-10">
      {/* price */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="label opacity-70">{size.ml} ml · {size.label}</p>
          <div className="relative mt-1 h-[clamp(2.8rem,5vw,4.2rem)] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={total}
                initial={{ y: "70%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-70%", opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="display tabular-nums text-[clamp(2.8rem,5vw,4.2rem)]"
              >
                {fmt(total)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {qty > 1 && <p className="label pb-2 opacity-70">{fmt(unit)} each</p>}
      </div>

      {/* sizes */}
      <div role="radiogroup" aria-label="Bottle size" className="mt-6">
        {sizes.map((s, i) => {
          const on = s.id === size.id;
          const price = unitPrice(f, s.id);
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSize(s.id)}
              className="hair relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 px-3 py-4 text-left transition-colors duration-300"
              style={on ? { color: f.color } : undefined}
            >
              {on && (
                <motion.span
                  layoutId="size-wipe"
                  className="absolute inset-0"
                  style={{ background: ink }}
                  transition={{ duration: 0.4, ease }}
                />
              )}
              <span className="label relative">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative">
                <span className="display-s block text-2xl">
                  {s.ml} ml <span className="label ml-2 opacity-70">{s.label}</span>
                </span>
                <span className="label mt-0.5 block opacity-70">{s.note}</span>
              </span>
              <span className="relative text-right">
                <span className="display-s block text-xl tabular-nums">{fmt(price)}</span>
                <span className="label opacity-70">Rs {(price / s.ml).toFixed(1)} / ml</span>
              </span>
            </button>
          );
        })}
        <div className="hair" />
      </div>

      {/* quantity + add */}
      <div className="mt-5 flex items-stretch gap-3">
        <div className="label flex items-center border border-current">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="h-14 w-12">−</button>
          <span className="w-10 text-center tabular-nums" aria-live="polite">{String(qty).padStart(2, "0")}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(12, qty + 1))} className="h-14 w-12">+</button>
        </div>

        <button
          type="button"
          onClick={onAdd}
          style={{ backgroundColor: ink, color: f.color }}
          className="label flex h-14 flex-1 items-center justify-between px-6 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span>{added ? "Added to cart ✓" : "Add to cart"}</span>
          <span aria-hidden>{added ? "" : "→"}</span>
        </button>
      </div>

      <p className="label mt-4 opacity-70">
        Cash on delivery across Pakistan · Card at checkout
      </p>
    </div>
  );
}