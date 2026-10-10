import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPrint } from "@fortawesome/free-solid-svg-icons";
import { countryName, methodName } from "../data/checkout";
import { fmt, fmtUsd } from "../lib/money";
import { zigzag } from "../lib/zigzag";
import { DEMO, useOrder } from "../store/order";
import { api } from "../lib/api";


const ease = [0.2, 0.7, 0.2, 1];
const stages = ["Received", "Packed", "Dispatched", "Delivered"];

const barcode =
  "repeating-linear-gradient(90deg, #1F1A14 0 2px, transparent 2px 4px, #1F1A14 4px 5px, transparent 5px 9px, #1F1A14 9px 12px, transparent 12px 14px)";

const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

const nextStep = {
  cod: (o) => `Keep ${fmt(o.money.total)} in cash ready for the rider.`,
  card: (o) =>
    o.status === "paid"
      ? "Payment received. We'll start packing."
      : "We're waiting for Stripe to confirm your payment. This page updates by itself.",
  paypal: () => "Your PayPal payment is confirmed before we pack.",
  easypaisa: () => "Approve the payment in your Easypaisa app if you haven't already.",
};

function Rule() {
  return <div className="my-3 border-t border-dashed border-soil/40" />;
}

export default function Confirmation() {
  const { no } = useParams();
  const [params] = useSearchParams();
  const token = params.get("t");
  const cached = useOrder((s) => s.last);
  const hasCache = cached?.no === no;
  const [fresh, setFresh] = useState(null);
  const [failed, setFailed] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const o = fresh ?? (hasCache ? cached : null);

  useEffect(() => { document.title = `Order ${no}: Ember & Root`; }, [no]);

  // Load from the server, and keep checking while a card payment is being confirmed
  useEffect(() => {
    if (!token) return;
    let stop = false;
    let timer;
    let tries = 0;
    const load = async () => {
      try {
        const r = await api(`/orders/${no}?t=${encodeURIComponent(token)}`);
        if (stop) return;
        setFresh(r);
        if (r.status === "pending") {
          if (++tries < 20) timer = setTimeout(load, 2000);
          else setGaveUp(true);
        }
      } catch {
        if (!stop) setFailed(true);
      }
    };
    load();
    return () => { stop = true; clearTimeout(timer); };
  }, [no, token]);

  if (!o) {
    if (!token || failed) return <Navigate to="/" replace />;
    return <p className="label px-5 py-24 lg:px-8">Finding your slip…</p>;
  }

  const first = o.contact.name.split(" ")[0];
  const s = o.ship;

  return (
    <div className="px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-0 gap-y-14 lg:gap-x-12">
        {/* left: the message */}
        <div className="no-print col-span-12 min-w-0 lg:col-span-6">
          <p className="label opacity-70">Cart / Checkout / <span className="opacity-100">Confirmation</span></p>

          <h1 className="display mt-4 text-[clamp(3.2rem,8vw,7rem)] font-semibold">
            {["Order", "received."].map((t, i) => (
              <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[6vw]" : ""}`}>
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

          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed">
            Thank you, {first}. A confirmation will go to <strong className="break-all font-semibold">{o.contact.email}</strong>.
          </p>

          {DEMO && o.status === "pending" && (
            <p role="status" className="label mt-6 inline-block border border-current px-3 py-2">
              {gaveUp ? "Still confirming. Refresh in a minute." : "Confirming your payment…"}
            </p>
          )}

          <p className="mt-6 max-w-[44ch] leading-relaxed opacity-85">{nextStep[o.method](o)}</p>

          <p className="label mt-12 opacity-60">Where it is</p>
          <ol className="mt-3 grid min-w-0 grid-cols-4 gap-x-2">
            {stages.map((t, i) => (
              <li key={t} className="relative pt-6">
                <span className="absolute left-0 top-0 h-px w-full bg-current opacity-30" />
                <motion.span
                  aria-hidden
                  className={`absolute left-0 top-[-5px] h-[11px] w-[11px] rotate-45 ${i === 0 ? "bg-chili" : "border border-current bg-paper"}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 400, damping: 18 }}
                />
                <span className={`label ${i === 0 ? "" : "opacity-50"}`}>{t}</span>
              </li>
            ))}
          </ol>
          <p className="label mt-4 opacity-60">Estimated delivery: {o.eta}</p>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/"
              className="label inline-flex items-center gap-3 border border-soil bg-soil px-6 py-4 text-paper transition-colors duration-200 hover:border-chili hover:bg-chili"
            >
              <span>Keep browsing</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="label inline-flex items-center gap-2 border-b border-current pb-1"
            >
              <FontAwesomeIcon icon={faPrint} className="text-xs" aria-hidden />
              <span>Print slip</span>
            </button>
            <Link to="/contact" className="label border-b border-current pb-1">Write to us</Link>
          </div>
        </div>

        {/* right: the slip */}
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <motion.article
            aria-label={`Order slip ${o.no}`}
            initial={{ opacity: 0, y: 60, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: -1.2 }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="relative mx-auto w-full max-w-[460px] min-w-0 overflow-hidden text-soil drop-shadow-[0_24px_22px_rgba(31,26,20,0.28)] print:rotate-0 print:drop-shadow-none"
          >
            <div
              className="min-w-0 overflow-hidden px-4 pb-12 pt-7 font-mono text-[12.5px] leading-[1.6] sm:px-6"
              style={{ background: "#FBF6EA", clipPath: zigzag() }}
            >
              <p className="label text-center">Ember &amp; Root</p>
              <p className="label text-center opacity-60">Order slip · No. {o.no}</p>
              <p className="label text-center opacity-60">{when.format(new Date(o.placedAt))}</p>
              <Rule />

              <ul>
                {o.items.map((it) => (
                  <li key={`${it.kind || "bottle"}-${it.id}-${it.size}-${it.message || ""}`} className="flex min-w-0 items-baseline gap-2 py-0.5">
                    <span className="min-w-0 break-words">
                      {it.qty} × {it.name}
                      {it.kind !== "bundle" && <span className="opacity-60"> {it.ml} ml</span>}
                      {it.kind === "bundle" && it.parts?.length > 0 && (
                        <span className="block opacity-60">{it.parts.join(" · ")}</span>
                      )}
                      {it.kind === "bundle" && it.message && (
                        <span className="block italic opacity-60">Card: “{it.message}”</span>
                      )}
                    </span>
                    <span aria-hidden className="mb-1 min-w-3 flex-1 self-end border-b border-dotted border-soil/40" />
                    <span className="shrink-0 tabular-nums">{fmt(it.unit * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <Rule />

              <div className="flex justify-between"><span className="opacity-60">Subtotal</span><span className="tabular-nums">{fmt(o.money.sub)}</span></div>
              <div className="flex justify-between"><span className="opacity-60">Shipping</span><span className="tabular-nums">{o.money.ship === 0 ? "Free" : fmt(o.money.ship)}</span></div>
              {o.money.fee > 0 && (
                <div className="flex justify-between"><span className="opacity-60">Cash handling</span><span className="tabular-nums">{fmt(o.money.fee)}</span></div>
              )}
              <div className="mt-2 flex items-baseline justify-between border-t border-soil pt-2 text-[15px]">
                <span className="label">Total</span>
                <span className="font-medium tabular-nums">{fmt(o.money.total)}</span>
              </div>
              <Rule />

              <p className="label opacity-60">Ship to</p>
              <p className="mt-1">{o.contact.name}</p>
              <p>{s.address}</p>
              <p>{[s.city, s.province, s.postal].filter(Boolean).join(", ")}</p>
              <p>{countryName[s.country]}</p>
              <p className="opacity-60">{o.contact.phone}</p>
              {o.note && <p className="mt-2 italic">“{o.note}”</p>}
              <Rule />

              <div className="flex justify-between gap-4">
                <span className="opacity-60">Payment</span>
                <span className="text-right">
                  {methodName[o.method]} · {o.status === "paid" ? "Paid" : o.status === "pending" ? "Awaiting" : "On delivery"}
                  {o.charge && <span className="block opacity-60">Charged {fmtUsd(o.charge.amount)} USD (test)</span>}
                </span>
              </div>

              <div className="mt-5 h-9" style={{ backgroundImage: barcode }} />
              <p className="label mt-1 text-center opacity-60">{o.no} · thank you</p>
            </div>

            <motion.span
              initial={{ scale: 2.6, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: 9 }}
              transition={{ type: "spring", stiffness: 520, damping: 17, delay: 0.9 }}
              className="label pointer-events-none absolute right-2 top-20 border-2 border-chili px-2 py-1 text-xs text-chili mix-blend-multiply sm:right-3 sm:top-24 sm:border-[3px] sm:px-4 sm:py-2 sm:text-lg"
            >
              {o.status === "paid" ? "Paid" : o.status === "pending" ? "Pending" : "Received"}
            </motion.span>
          </motion.article>
        </div>
      </div>
    </div>
  );
}