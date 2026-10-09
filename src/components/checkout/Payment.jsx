import { AnimatePresence, motion } from "framer-motion";
import { PaymentElement } from "@stripe/react-stripe-js";
import { methods } from "../../data/checkout";
import { COD_FEE, PKR_PER_USD, fmt, fmtUsd } from "../../lib/money";

const ease = [0.2, 0.7, 0.2, 1];
const isTest = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test");

export default function Payment({ method, setMethod, country, usd, stripeOn }) {
  const list = methods.filter((m) => !m.pkOnly || country === "PK");

  const onKey = (e) => {
    const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!fwd && !back) return;
    e.preventDefault();
    const i = list.findIndex((m) => m.id === method);
    const next = list[(i + (fwd ? 1 : -1) + list.length) % list.length];
    setMethod(next.id);
    document.getElementById(`pay-${next.id}`)?.focus();
  };

  const panel = {
    card: (
      <div>
        {stripeOn ? (
          <PaymentElement
            options={{
              layout: "tabs",
              // We already collected these in the form, and pass them when confirming.
              fields: { billingDetails: { name: "never", email: "never", phone: "never" } },
            }}
            onLoadError={(event) => {
              console.error("Stripe PaymentElement failed to load:", event.error);
            }}
          />
        ) : (
          <p className="label border border-dashed border-soil/50 p-4 text-chili">
            Card form unavailable. Add VITE_STRIPE_PUBLISHABLE_KEY to .env.local and restart.
          </p>
        )}
        <p className="label mt-5 opacity-70">
          Charged in USD · about {fmtUsd(usd)} at Rs {PKR_PER_USD} / $1 (test rate)
        </p>
        {isTest && (
          <p className="label mt-1 opacity-60">
            Test mode · card 4242 4242 4242 4242, any future date, any CVC
          </p>
        )}
      </div>
    ),
    paypal: (
      <p className="label border border-dashed border-soil/50 p-4">
        PayPal is shown for design only in this build. Choose Card or Cash on delivery to place a test order.
      </p>
    ),
    easypaisa: (
      <p className="label border border-dashed border-soil/50 p-4">
        Easypaisa is shown for design only in this build. Choose Card or Cash on delivery to place a test order.
      </p>
    ),
    cod: (
      <p className="max-w-[46ch] text-sm leading-relaxed">
        Pay in cash when the parcel arrives.
        {COD_FEE > 0 && <> A {fmt(COD_FEE)} handling fee applies.</>} Please keep the exact amount ready.
      </p>
    ),
  };

  return (
    <div>
      <div role="radiogroup" aria-label="Payment method" onKeyDown={onKey}>
        {list.map((m, i) => {
          const on = m.id === method;
          return (
            <button
              key={m.id}
              id={`pay-${m.id}`}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setMethod(m.id)}
              className="hair relative grid w-full min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-2 px-3 py-4 text-left transition-colors duration-300 sm:gap-x-3"
              style={on ? { color: "#F2EBDD" } : undefined}
            >
              {on && (
                <motion.span
                  layoutId="pay-wipe"
                  className="absolute inset-0 bg-soil"
                  transition={{ duration: 0.4, ease }}
                />
              )}
              <span className="label relative">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative">
                <span className="display-s block text-2xl">{m.name}</span>
                <span className="label mt-0.5 block opacity-70">{m.via}</span>
              </span>
              <span className="label relative whitespace-nowrap text-right opacity-70">
                {m.demo ? "Demo" : m.id === "cod" && COD_FEE > 0 ? `+ ${fmt(COD_FEE)}` : "No fee"}
              </span>
            </button>
          );
        })}
        <div className="hair" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={method}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="mt-6"
        >
          {panel[method]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}