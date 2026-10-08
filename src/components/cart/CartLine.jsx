import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { sizes } from "../../data/productExtra";
import { bottleFor } from "../../lib/assets";
import { fmt, unitPrice } from "../../lib/money";
import { useCart } from "../../store/cart";
import Roll from "../ui/Roll";

const ease = [0.2, 0.7, 0.2, 1];

export default function CartLine({ item, f, n, onNavigate }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const size = sizes.find((s) => s.id === item.size);
  const unit = unitPrice(f, item.size);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.3 } }}
      className="hair grid grid-cols-[1.75rem_4.25rem_1fr] gap-x-3 py-5"
    >
      <span className="label pt-1 opacity-60">{String(n).padStart(2, "0")}</span>

      <Link
        to={`/flavor/${f.id}`}
        onClick={onNavigate}
        aria-label={`View ${f.name}`}
        className="relative block h-[5.5rem] w-[4.25rem] overflow-hidden"
        style={{ background: f.color }}
      >
        <img
          src={bottleFor(f.id)}
          alt=""
          draggable={false}
          className="absolute inset-x-0 -bottom-1 mx-auto h-[112%] w-auto max-w-none object-contain"
        />
      </Link>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <Link to={`/flavor/${f.id}`} onClick={onNavigate} className="display-s truncate text-xl leading-tight">
            {f.name}
          </Link>
          <span aria-hidden className="mb-1 min-w-4 flex-1 self-end border-b border-dotted border-current opacity-40" />
          <span className="display-s shrink-0 text-lg">
            <Roll value={fmt(unit * item.qty)} />
          </span>
        </div>

        <p className="label mt-1 opacity-60">
          {size.ml} ml · {size.label}
          {item.qty > 1 && ` · ${fmt(unit)} each`}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="label flex items-center border border-current">
            <button
              type="button"
              aria-label={`Decrease quantity of ${f.name}`}
              disabled={item.qty <= 1}
              onClick={() => setQty(item.id, item.size, item.qty - 1)}
              className="h-9 w-9 disabled:opacity-30"
            >
              −
            </button>
            <span className="w-8 text-center tabular-nums" aria-live="polite">
              {String(item.qty).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${f.name}`}
              disabled={item.qty >= 12}
              onClick={() => setQty(item.id, item.size, item.qty + 1)}
              className="h-9 w-9 disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(item.id, item.size)}
            className="label border-b border-current pb-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}