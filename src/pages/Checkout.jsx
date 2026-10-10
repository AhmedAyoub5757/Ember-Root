import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleExclamation, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { countries, methods, provinces } from "../data/checkout";
import { fmt, quote, resolveItem, toUsdCents } from "../lib/money";
import { validate } from "../lib/validate";
import { api } from "../lib/api";
import { appearance, fonts, stripePromise } from "../lib/stripe";
import { useCart } from "../store/cart";
import { useOrder } from "../store/order";
import { useAuth } from "../store/auth";
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

/* The provider must wrap the form so the card fields can live inside it. */
export default function Checkout() {
  const items = useCart((s) => s.items);

  // Options are set once. The amount is kept current with elements.update() below.
  const [options] = useState(() => ({
    mode: "payment",
    amount: Math.max(50, toUsdCents(quote(items, { country: "PK", method: "card" }).total)),
    currency: "usd",
    appearance,
    fonts,
  }));

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const place = useOrder((s) => s.place);
  const user = useAuth((s) => s.user);

  const [v, setV] = useState(blank);
  const [method, setMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const done = useRef(false);
  const attempt = useRef(null); // the order + clientSecret of the last submit, reused on retry

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const resolved = resolveItem(item);
          return resolved ? { item, ...resolved } : null;
        })
        .filter(Boolean),
    [items]
  );
  const q = useMemo(() => quote(items, { country: v.country, method }), [items, v.country, method]);
  const usd = toUsdCents(q.total);
  const pk = v.country === "PK";

  useEffect(() => {
    if (user) {
      setV((s) => ({ ...s, name: s.name || user.name, email: s.email || user.email }));
    }
  }, [user]);

  // keep Stripe's idea of the amount in step with the cart
  useEffect(() => {
    if (elements && usd >= 50) elements.update({ amount: usd });
  }, [elements, usd]);

  /* ---------- field plumbing ---------- */
  const set = (k) => (e) => {
    const val = e.target.value;
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };
  const blur = (k) => () => {
    if (!v[k] && !errors[k]) return;
    setErrors((s) => ({ ...s, [k]: validate(v, method)[k] }));
  };
  const bind = (k) => ({ name: k, value: v[k], onChange: set(k), onBlur: blur(k), error: errors[k] });

  const changeMethod = (next) => {
    setMethod(next);
    setErrors((s) => ({ ...s, form: undefined }));
  };

  const setCountry = (e) => {
    const c = e.target.value;
    setV((s) => ({ ...s, country: c, province: "" }));
    setErrors((s) => ({ ...s, province: undefined, postal: undefined, phone: undefined, form: undefined }));
    if (c !== "PK" && (method === "cod" || method === "easypaisa")) changeMethod("card");
  };

  /* ---------- submit ---------- */
  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (methods.find((m) => m.id === method)?.demo) {
      setErrors({ form: "That payment method is design-only here. Choose Card or Cash on delivery." });
      return;
    }

    const errs = validate(v, method);
    setErrors(errs);
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }

    setSending(true);
    try {
      // Card: validate the card fields first, before any network call
      if (method === "card") {
        if (!stripe || !elements) throw new Error("The card form is still loading. Try again in a moment.");
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setSending(false);
          setErrors({ form: submitError.message });
          return;
        }
      }

      // Reuse the same order if nothing changed (e.g. retrying after a declined card)
      const sig = JSON.stringify([
        method,
        v,
        items.map(({ kind, id, size, qty, picks, message }) => [kind, id, size, qty, picks, message]),
      ]);
      let att = attempt.current;
      if (!att || att.sig !== sig) {
        const data = await api("/orders", {
          method: "POST",
          body: {
            ...v,
            method,
            items: items.map(({ kind, id, size, picks, message, qty }) => ({
              kind, id, size, picks, message, qty,
            })), // IDs only, never prices
          },
        });
        att = attempt.current = { sig, ...data };
      }

      if (method === "card") {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret: att.clientSecret,
          redirect: "if_required",
          confirmParams: {
            return_url: `${window.location.origin}/order/${att.order.no}?t=${att.token}`,
            payment_method_data: {
              billing_details: { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() },
            },
          },
        });
        if (error) {
          setSending(false);
          setErrors({ form: error.message }); // the order is kept for the retry
          return;
        }
        if (!["succeeded", "processing"].includes(paymentIntent?.status)) {
          setSending(false);
          setErrors({ form: "The payment wasn't completed. Please try again." });
          return;
        }
      }

      place(att.order);
      done.current = true;
      navigate(`/order/${att.order.no}?t=${att.token}`, { replace: true });
      clear();
    } catch (err) {
      setSending(false);
      if (err.fields && Object.keys(err.fields).length) {
        setErrors(err.fields);
        const f = FIELD_ORDER.find((k) => err.fields[k]);
        if (f) document.getElementById(`f-${f}`)?.focus();
      } else {
        setErrors({ form: err.message || "Something went wrong on our side. Nothing was charged." });
      }
    }
  };

  /* ---------- empty cart ---------- */
  if (lines.length === 0 && !done.current) {
    return (
      <div className="px-4 py-20 sm:px-5 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p className="label opacity-60">Checkout</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)] font-semibold">
            Nothing<br />to settle.
          </h1>
          <p className="mt-6 max-w-[38ch] leading-relaxed opacity-80">
            Your order slip is empty. Pick a bottle first and we'll hold the table.
          </p>
          <Link to="/shop" className="label mt-8 inline-flex items-center gap-3 border border-soil bg-soil px-6 py-4 text-paper transition-colors hover:border-chili hover:bg-chili">
            <span>Browse the sauces</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }
  if (lines.length === 0) return null;

  const cta =
    method === "cod" ? "Place order"
    : methods.find((m) => m.id === method)?.demo ? "Coming soon"
    : "Pay securely";

  return (
    <div className="px-4 pb-24 pt-8 sm:px-5 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <div>
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 opacity-70">
            <button type="button" onClick={() => useCart.getState().open()} className="inline-flex items-center gap-1.5 hover:underline">
              <FontAwesomeIcon icon={faBagShopping} className="text-xs" aria-hidden />
              <span>Cart</span>
            </button>
            <span aria-hidden>/</span>
            <span aria-current="step" className="opacity-100">Checkout</span>
            <span aria-hidden>/</span>
            <span className="opacity-60">Confirmation</span>
          </p>
          <h1 className="display mt-4 text-[clamp(2.4rem,7vw,6.5rem)] font-semibold">
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

        <div className="mt-8 grid grid-cols-12 gap-x-12 gap-y-8 sm:mt-10 lg:mt-14">
          {/* On mobile, order summary is on top (collapsible accordion), on desktop on the right */}
          <aside className="order-1 col-span-12 min-w-0 lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-[128px]">
              <Summary lines={lines} q={q} country={v.country} />
            </div>
          </aside>

          <form onSubmit={submit} noValidate className="order-2 col-span-12 min-w-0 lg:order-1 lg:col-span-7">
            <Section no="01" title="Contact">
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-7">
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
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-7">
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
              <Payment
                method={method}
                setMethod={changeMethod}
                country={v.country}
                usd={usd}
                stripeOn={!!stripePromise}
              />
            </Section>

            {errors.form && (
              <p role="alert" className="label mb-4 flex items-center gap-2 text-chili">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-sm shrink-0" aria-hidden />
                <span>{errors.form}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="label flex h-16 w-full items-center justify-between gap-3 bg-soil px-4 text-paper transition-colors duration-200 hover:bg-chili disabled:opacity-60 sm:px-6"
            >
              <span className="truncate">{sending ? "Sealing the slip…" : cta}</span>
              <span className="flex shrink-0 items-center gap-3 sm:gap-4">
                {!sending && <span className="display-s text-lg normal-case sm:text-xl">{fmt(q.total)}</span>}
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
              </span>
            </button>

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