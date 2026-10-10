import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faMinus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { bottleFor } from "../../lib/assets";
import { fmt, resolveItem, totals } from "../../lib/money";
import { useCart } from "../../store/cart";
import paper from "../../assets/images/paper.jpg";
import Roll from "../ui/Roll";
import ShipRuler from "./ShipRuler";

const ease = [0.2, 0.7, 0.2, 1];
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const close = useCart((s) => s.close);
  const { pathname } = useLocation();
  const panel = useRef(null);

  const lines = useMemo(
    () => items
      .map((item) => resolveItem(item))
      .filter(Boolean),
    [items]
  );
  const t = useMemo(() => totals(items), [items]);

  // close on route change
  useEffect(() => { close(); }, [pathname, close]);

  // scroll lock, Esc, focus trap, focus restore
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const els = panel.current.querySelectorAll(FOCUSABLE);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-soil/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col overflow-hidden text-soil shadow-[-30px_0_60px_-30px_rgba(0,0,0,0.6)]"
            style={{
              backgroundColor: "#F2EBDD",
              backgroundImage: `url(${paper})`,
              backgroundBlendMode: "multiply",
              backgroundSize: "420px",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
          >
            {/* header */}
            <header className="hair-b flex items-start justify-between gap-4 px-6 pb-4 pt-5 lg:pb-5 lg:pt-6">
              <div>
                <p className="label opacity-60">Order slip</p>
                <h2 className="display mt-2 text-4xl font-semibold lg:text-5xl">
                  Your order<span className="label ml-3 align-top opacity-60">{String(t.count).padStart(2, "0")}</span>
                </h2>
              </div>
              <button type="button" onClick={close} autoFocus className="label flex items-center gap-2 border border-soil px-3.5 py-2">
                <span>Close</span>
                <FontAwesomeIcon icon={faXmark} className="text-xs" aria-hidden />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-10">
                <p className="display text-5xl font-semibold">
                  Nothing<br />on the slip.
                </p>
                <p className="mt-5 max-w-[34ch] leading-relaxed opacity-80">
                  A bottle looks good on any table. Browse the sauces to start an order.
                </p>
                <Link to="/shop" className="label mt-8 inline-flex items-center gap-2 self-start border-b border-current pb-1">
                  <span>Browse all sauces</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
                </Link>
              </div>
            ) : (
              <>
                <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-4 lg:pb-6 lg:pt-6">
                  <ShipRuler sub={t.sub} />
                  <ul className="mt-4 lg:mt-6">
                    <AnimatePresence initial={false}>
                      {lines.map((line) => {
                        const lineTotal = line.unit * line.qty;
                        const isBundle = line.kind === "bundle";
                        return (
                          <motion.li
                            key={line.key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="hair flex min-w-0 items-center gap-3 py-2.5 lg:py-3"
                          >
                            {isBundle ? (
                              <span
                                className="relative h-12 w-12 shrink-0 overflow-hidden"
                                style={{ background: line.parts[0].color }}
                                aria-hidden
                              >
                                {line.parts.slice(0, 3).map((part, index) => (
                                  <img
                                    key={part.id}
                                    src={bottleFor(part.id)}
                                    alt=""
                                    className="absolute bottom-0 h-12 w-auto max-w-none"
                                    style={{ left: `${index * 10 - 4}px`, zIndex: 3 - index }}
                                  />
                                ))}
                                {line.parts.length > 3 && (
                                  <span className="absolute bottom-1 right-1 z-10 bg-paper px-1 text-xs">
                                    +{line.parts.length - 3}
                                  </span>
                                )}
                              </span>
                            ) : null}
                            <div className="min-w-0 flex-1">
                              <p className="display-s truncate text-lg leading-tight">{line.name}</p>
                              <p className="label mt-1 truncate opacity-60">
                                {isBundle
                                  ? `${line.parts.length} varieties · ${line.sizeObj.ml} ml each`
                                  : `${line.sizeObj.ml} ml · ${line.sizeObj.label}`}{" "}
                                · {fmt(lineTotal)}
                              </p>
                              {isBundle && (
                                <>
                                  <p className="label truncate opacity-60">
                                    {line.parts.map((part) => part.name).join(" · ")}
                                  </p>
                                  {line.message && (
                                    <p className="label truncate italic opacity-70">Card: {line.message}</p>
                                  )}
                                  <p className="label opacity-70">Saves {fmt((line.full - line.unit) * line.qty)}</p>
                                </>
                              )}
                            </div>
                            <div className="label flex shrink-0 items-center border border-current">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${line.name}`}
                                disabled={line.qty <= 1}
                                onClick={() => setQty(line.key, line.qty - 1)}
                                className="flex h-8 w-7 items-center justify-center disabled:opacity-30"
                              >
                                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                              </button>
                              <span className="w-7 text-center tabular-nums" aria-live="polite">
                                {String(line.qty).padStart(2, "0")}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${line.name}`}
                                disabled={line.qty >= 12}
                                onClick={() => setQty(line.key, line.qty + 1)}
                                className="flex h-8 w-7 items-center justify-center disabled:opacity-30"
                              >
                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                              </button>
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove ${line.name}`}
                              onClick={() => remove(line.key)}
                              className="label flex shrink-0 items-center px-1.5 opacity-60 transition-opacity hover:opacity-100"
                            >
                              <FontAwesomeIcon icon={faXmark} className="text-xs" />
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                    <li className="hair" />
                  </ul>
                </div>

                {/* totals */}
                <footer className="hair px-6 pb-4 pt-3 lg:pb-6 lg:pt-5">
                  <dl className="text-sm">
                    <div className="flex justify-between py-1">
                      <dt className="label opacity-60">Subtotal</dt>
                      <dd className="tabular-nums"><Roll value={fmt(t.sub)} /></dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="label opacity-60">Shipping</dt>
                      <dd className="tabular-nums">{t.ship === 0 ? "Free" : fmt(t.ship)}</dd>
                    </div>
                    <div className="hair mt-2 flex items-end justify-between pt-2 lg:pt-3">
                      <dt className="label">Total</dt>
                      <dd className="display text-3xl lg:text-4xl"><Roll value={fmt(t.total)} height="1.2em" /></dd>
                    </div>
                  </dl>

                  <Link
                    to="/checkout"
                    onClick={close}
                    className="label mt-3 flex h-12 items-center justify-between bg-soil px-6 text-paper transition-colors duration-200 hover:bg-chili lg:mt-5 lg:h-14"
                  >
                    <span>Checkout</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
                  </Link>
                  <button type="button" onClick={close} className="label mt-3 border-b border-current pb-0.5 lg:mt-4">
                    Keep browsing
                  </button>
                  <p className="label mt-3 opacity-60 lg:mt-4">
                    Cash on delivery · Card
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}