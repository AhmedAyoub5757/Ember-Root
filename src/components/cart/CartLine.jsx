import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { bottleFor } from "../../lib/assets";
import { fmt, resolveItem } from "../../lib/money";
import { useCart } from "../../store/cart";
import Roll from "../ui/Roll";

const ease = [0.2, 0.7, 0.2, 1];

function BundleThumb({ parts, className }) {
  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ background: parts[0].color }} aria-hidden>
      {parts.slice(0, 3).map((part, index) => (
        <img
          key={part.id}
          src={bottleFor(part.id)}
          alt=""
          className="absolute bottom-0 h-[112%] w-auto max-w-none"
          style={{ left: `${index * 13 - 7}px`, zIndex: 3 - index }}
        />
      ))}
      {parts.length > 3 && (
        <span className="absolute bottom-1 right-1 z-10 bg-paper px-1 text-xs">
          +{parts.length - 3}
        </span>
      )}
    </span>
  );
}

export default function CartLine({ item, f, n, onNavigate }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const line = resolveItem(item);
  if (!line) return null;

  const isBundle = line.kind === "bundle";
  const bottle = f || line.f;
  const size = line.sizeObj;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.3 } }}
      className="hair grid grid-cols-[1.75rem_4.25rem_1fr] gap-x-3 py-5"
    >
      <span className="label pt-1 opacity-60">{String(n).padStart(2, "0")}</span>

      {isBundle ? (
        <BundleThumb parts={line.parts} className="h-[5.5rem] w-[4.25rem]" />
      ) : (
        <Link
          to={`/flavor/${bottle.id}`}
          onClick={onNavigate}
          aria-label={`View ${bottle.name}`}
          className="relative block h-[5.5rem] w-[4.25rem] overflow-hidden"
          style={{ background: bottle.color }}
        >
          <img
            src={bottleFor(bottle.id)}
            alt=""
            draggable={false}
            className="absolute inset-x-0 -bottom-1 mx-auto h-[112%] w-auto max-w-none object-contain"
          />
        </Link>
      )}

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          {isBundle ? (
            <p className="display-s truncate text-xl leading-tight">{line.name}</p>
          ) : (
            <Link to={`/flavor/${bottle.id}`} onClick={onNavigate} className="display-s truncate text-xl leading-tight">
              {bottle.name}
            </Link>
          )}
          <span aria-hidden className="mb-1 min-w-4 flex-1 self-end border-b border-dotted border-current opacity-40" />
          <span className="display-s shrink-0 text-lg">
            <Roll value={fmt(line.unit * line.qty)} />
          </span>
        </div>

        {isBundle ? (
          <>
            <p className="label mt-1 opacity-60">{line.parts.length} varieties · {size.ml} ml each</p>
            <p className="label truncate opacity-60">{line.parts.map((part) => part.name).join(" · ")}</p>
            {line.message && <p className="label truncate italic opacity-70">Card: {line.message}</p>}
            <p className="label opacity-70">Saves {fmt((line.full - line.unit) * line.qty)}</p>
          </>
        ) : (
          <p className="label mt-1 opacity-60">
            {size.ml} ml · {size.label}
            {line.qty > 1 && ` · ${fmt(line.unit)} each`}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="label flex items-center border border-current">
            <button
              type="button"
              aria-label={`Decrease quantity of ${line.name}`}
              disabled={line.qty <= 1}
              onClick={() => setQty(line.key, line.qty - 1)}
              className="h-9 w-9 disabled:opacity-30"
            >
              −
            </button>
            <span className="w-8 text-center tabular-nums" aria-live="polite">
              {String(line.qty).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${line.name}`}
              disabled={line.qty >= 12}
              onClick={() => setQty(line.key, line.qty + 1)}
              className="h-9 w-9 disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(line.key)}
            className="label border-b border-current pb-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}
