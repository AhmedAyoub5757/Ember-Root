import { useState } from "react";
import { etaFor } from "../../data/checkout";
import { bottleFor } from "../../lib/assets";
import { fmt } from "../../lib/money";
import { useCart } from "../../store/cart";
import paper from "../../assets/images/paper.jpg";
import Roll from "../ui/Roll";

export default function Summary({ lines, q, country }) {
  const [open, setOpen] = useState(false);
  const domestic = country === "PK";

  return (
    <section
      aria-label="Order summary"
      className="border border-soil/20 shadow-[0_22px_40px_-24px_rgba(31,26,20,0.45)]"
      style={{
        backgroundColor: "#E6DCC6",
        backgroundImage: `url(${paper})`,
        backgroundBlendMode: "multiply",
        backgroundSize: "420px",
      }}
    >
      {/* mobile toggle */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="label flex w-full items-center justify-between gap-4 px-5 py-4 lg:hidden"
      >
        <span>{open ? "Hide" : "Show"} order summary ({q.count})</span>
        <span className="display-s text-xl normal-case">{fmt(q.total)}</span>
      </button>

      <div className={`${open ? "block" : "hidden"} px-5 pb-6 pt-2 lg:block lg:p-7`}>
        <div className="hidden items-baseline justify-between lg:flex">
          <p className="label opacity-60">Order slip · {String(q.count).padStart(2, "0")} items</p>
          <button
            type="button"
            onClick={() => useCart.getState().open()}
            className="label border-b border-current pb-0.5"
          >
            Edit
          </button>
        </div>

        <ul className="lg:mt-5">
          {lines.map(({ item, f, unit, full, name, sizeObj, parts, key }) => (
            <li key={key} className="hair grid min-w-0 grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 py-4 sm:gap-x-4">
              <span className="relative block h-[4.25rem] w-[3.25rem] overflow-hidden" style={{ background: f?.color || parts[0]?.color || "#7A3B22" }}>
                {f ? (
                  <img src={bottleFor(f.id)} alt="" draggable={false} className="absolute inset-x-0 -bottom-1 mx-auto h-[112%] w-auto max-w-none object-contain" />
                ) : (
                  <>
                    {parts.slice(0, 3).map((part, index) => (
                      <img
                        key={part.id}
                        src={bottleFor(part.id)}
                        alt=""
                        className="absolute bottom-0 h-[4.5rem] w-auto max-w-none"
                        style={{ left: `${index * 10 - 5}px`, zIndex: 3 - index }}
                      />
                    ))}
                    {parts.length > 3 && <span className="absolute bottom-1 right-1 z-10 bg-paper px-1 text-xs">+{parts.length - 3}</span>}
                  </>
                )}
              </span>
              <div className="min-w-0">
                <div className="flex min-w-0 items-baseline gap-2">
                  <p className="display-s min-w-0 truncate text-lg leading-tight">{name}</p>
                  <span aria-hidden className="mb-1 min-w-4 flex-1 self-end border-b border-dotted border-current opacity-40" />
                  <p className="display-s shrink-0 text-lg tabular-nums">{fmt(unit * item.qty)}</p>
                </div>
                <p className="label mt-1 opacity-60">
                  {f ? `${sizeObj.ml} ml · × ${item.qty}` : `${parts.length} varieties · ${sizeObj.ml} ml each · × ${item.qty}`}
                </p>
                {!f && (
                  <>
                    <p className="label truncate opacity-60">{parts.map((part) => part.name).join(" · ")}</p>
                    {item.message && <p className="label truncate italic opacity-70">Card: {item.message}</p>}
                    <p className="label opacity-70">Saves {fmt((full - unit) * item.qty)}</p>
                  </>
                )}
              </div>
            </li>
          ))}
          <li className="hair" />
        </ul>

        <dl className="mt-4 text-sm">
          <div className="flex justify-between py-1">
            <dt className="label opacity-60">Subtotal</dt>
            <dd className="tabular-nums">{fmt(q.sub)}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="label opacity-60">{domestic ? "Shipping" : "International shipping"}</dt>
            <dd className="tabular-nums">{q.ship === 0 ? "Free" : fmt(q.ship)}</dd>
          </div>
          {q.fee > 0 && (
            <div className="flex justify-between py-1">
              <dt className="label opacity-60">Cash handling</dt>
              <dd className="tabular-nums">{fmt(q.fee)}</dd>
            </div>
          )}
          <div className="hair mt-2 flex items-end justify-between pt-3">
            <dt className="label">Total</dt>
            <dd className="display text-4xl">
              <Roll value={fmt(q.total)} height="1.2em" />
            </dd>
          </div>
        </dl>

        {domestic && q.left > 0 && q.sub > 0 && (
          <p className="label mt-4 opacity-70">Add {fmt(q.left)} more for free shipping</p>
        )}
        <p className="label mt-3 opacity-60">Estimated delivery: {etaFor(country)}</p>
      </div>
    </section>
  );
}