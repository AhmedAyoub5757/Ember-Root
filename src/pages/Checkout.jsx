import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { flavors } from "../data/products";
import { sizes } from "../data/productExtra";
import { countries, etaFor, provinces } from "../data/checkout";
import { fmt, quote, unitPrice } from "../lib/money";
import { validate } from "../lib/validate";
import { useCart } from "../store/cart";
import { DEMO, useOrder } from "../store/order";
import Field from "../components/checkout/Field";
import Payment from "../components/checkout/Payment";
import Summary from "../components/checkout/Summary";

const ease = [0.2, 0.7, 0.2, 1];
const FIELD_ORDER = ["name", "email", "phone", "country", "address", "city", "province", "postal", "wallet"];
const blank = {
  name: "", email: "", phone: "", country: "PK",
  address: "", city: "", province: "", postal: "", note: "", wallet: "",
};

function Section({ no, title, children }) {
  return (
    <section className="hair pb-10 pt-6">
      <h2 className="flex items-baseline gap-4">
        <span className="label opacity-60">{no}</span>
        <span className="display-s text-3xl">{title}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const place = useOrder((s) => s.place);

  const [v, setV] = useState(blank);
  const [method, setMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const done = useRef(false);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const f = flavors.find((x) => x.id === item.id);
          const size = sizes.find((s) => s.id === item.size);
          return f && size ? { item, f, size, unit: unitPrice(f, item.size) } : null;
        })
        .filter(Boolean),
    [items]
  );
  const q = useMemo(() => quote(items, { country: v.country, method }), [items, v.country, method]);
  const pk = v.country === "PK";

  /* ---------- field plumbing ---------- */
  const set = (k) => (e) => {
    const val = e.target.value;
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };
  const blur = (k) => () => {
    if (!v[k] && !errors[k]) return; // don't nag people who are just tabbing through
    setErrors((s) => ({ ...s, [k]: validate(v, method)[k] }));
  };
  const bind = (k) => ({ name: k, value: v[k], onChange: set(k), onBlur: blur(k), error: errors[k] });

  const setCountry = (e) => {
    const c = e.target.value;
    setV((s) => ({ ...s, country: c, province: "" }));
    setErrors((s) => ({ ...s, province: undefined, postal: undefined, phone: undefined }));
    if (c !== "PK" && (method === "cod" || method === "easypaisa")) setMethod("card");
  };

  /* ---------- submit ---------- */
  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const errs = validate(v, method);
    setErrors(errs);
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }

    setSending(true);
    try {
      // TODO (backend step): POST the cart + details to /api/orders.
      // The server recalculates prices, creates the order, and starts the chosen payment.
      await new Promise((r) => setTimeout(r, 1100));

      const no = String(4000 + Math.floor(Math.random() * 5000)); // placeholder, server assigns later
      place({
        no,
        placedAt: new Date().toISOString(),
        method,
        note: v.note.trim(),
        eta: etaFor(v.country),
        contact: { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() },
        ship: {
          address: v.address.trim(), city: v.city.trim(), province: v.province.trim(),
          postal: v.postal.trim(), country: v.country,
        },
        items: lines.map(({ item, f, size, unit }) => ({
          id: f.id, name: f.name, ml: size.ml, qty: item.qty, unit,
        })),
        money: { sub: q.sub, ship: q.ship, fee: q.fee, total: q.total },
      });

      done.current = true;
      navigate(`/order/${no}`, { replace: true });
      clear();
    } catch {
      setSending(false);
      setErrors({ form: "Something went wrong on our side. Nothing was charged. Please try again." });
    }
  };

  /* ---------- empty cart ---------- */
  if (lines.length === 0 && !done.current) {
    return (
      <div className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p className="label opacity-60">Checkout</p>
          <h1 className="display mt-4 text-[clamp(3.5rem,9vw,8rem)] font-semibold">
            Nothing<br />to settle.
          </h1>
          <p className="mt-6 max-w-[38ch] leading-relaxed opacity-80">
            Your order slip is empty. Pick a bottle first and we'll hold the table.
          </p>
          <Link to="/shop" className="label mt-8 inline-flex items-center gap-3 border border-soil bg-soil px-6 py-4 text-paper transition-colors hover:bg-chili hover:border-chili">
            Browse the sauces <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }
  if (lines.length === 0) return null; // the order was placed; we're navigating away

  const cta =
    method === "cod" ? "Place order"
    : method === "paypal" ? "Continue to PayPal"
    : method === "easypaisa" ? "Pay with Easypaisa"
    : "Pay securely";

  return (
    <div className="px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        {/* header */}
        <div>
          <p className="label flex flex-wrap gap-x-3 opacity-70">
            <button type="button" onClick={() => useCart.getState().open()} className="hover:underline">Cart</button>
            <span aria-hidden>/</span>
            <span aria-current="step" className="opacity-100">Checkout</span>
            <span aria-hidden>/</span>
            <span className="opacity-60">Confirmation</span>
          </p>
          <h1 className="display mt-4 text-[clamp(3.2rem,8vw,7rem)] font-semibold">
            {["Settle", "the slip."].map((t, i) => (
              <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[8vw]" : ""}`}>
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

        <div className="mt-10 grid grid-cols-12 gap-x-0 gap-y-8 lg:mt-14 lg:gap-x-12">
          {/* summary first on mobile, right on desktop */}
          <aside className="order-1 col-span-12 min-w-0 lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-[128px]">
              <Summary lines={lines} q={q} country={v.country} />
            </div>
          </aside>

          <form onSubmit={submit} noValidate className="order-2 col-span-12 min-w-0 lg:order-1 lg:col-span-7">
            <Section no="01" title="Contact">
              <div className="grid min-w-0 gap-x-0 gap-y-7 sm:grid-cols-2 sm:gap-x-8">
                <Field label="Full name" autoComplete="name" className="sm:col-span-2" {...bind("name")} />
                <Field label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@yourtable.com" {...bind("email")} />
                <Field
                  label="Mobile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={pk ? "0300 1234567" : "+44 7700 900123"}
                  {...bind("phone")}
                />
              </div>
            </Section>

            <Section no="02" title="Delivery">
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <Field label="Country" as="select" autoComplete="country" className="sm:col-span-2" {...bind("country")} onChange={setCountry}>
                  {countries.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </Field>

                <Field label="Street address" autoComplete="address-line1" placeholder="House 12, Street 4, Sector F-7" className="sm:col-span-2" {...bind("address")} />
                <Field label="City" autoComplete="address-level2" {...bind("city")} />

                {pk ? (
                  <Field label="Province" as="select" autoComplete="address-level1" {...bind("province")}>
                    <option value="">Choose…</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Field>
                ) : (
                  <Field label="State / region" autoComplete="address-level1" {...bind("province")} />
                )}

                <Field label="Postal code" optional={pk} autoComplete="postal-code" inputMode="text" {...bind("postal")} />
                <Field
                  label="A note on the slip"
                  as="textarea"
                  rows={2}
                  optional
                  placeholder="Gate code, gift message, anything we should know"
                  className="sm:col-span-2"
                  {...bind("note")}
                />
              </div>
            </Section>

            <Section no="03" title="Payment">
              <Payment method={method} setMethod={setMethod} country={v.country} bind={bind} />
            </Section>

            {errors.form && (
              <p role="alert" className="label mb-4 text-chili">✕ {errors.form}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="label flex h-16 w-full items-center justify-between bg-soil px-6 text-paper transition-colors duration-200 hover:bg-chili disabled:opacity-60"
            >
              <span>{sending ? "Sealing the slip…" : cta}</span>
              <span className="flex items-center gap-4">
                {!sending && <span className="display-s text-xl normal-case">{fmt(q.total)}</span>}
                <span aria-hidden>→</span>
              </span>
            </button>

            {DEMO && (
              <p className="label mt-4 opacity-70">Demo mode · no payment is taken and nothing is sent yet</p>
            )}
            <p className="label mt-3 opacity-60">
              By placing your order you agree to our{" "}
              <Link to="/terms" className="border-b border-current">Terms</Link> and{" "}
              <Link to="/privacy" className="border-b border-current">Privacy policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}