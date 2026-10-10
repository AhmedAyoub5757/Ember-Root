import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import Field from "../components/checkout/Field";

const ease = [0.2, 0.7, 0.2, 1];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Track() {
  const navigate = useNavigate();
  const [no, setNo] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Track an order: Ember & Root"; }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const n = no.replace(/\D/g, "");
    if (!n) return setError("Enter the order number from your slip.");
    if (!EMAIL.test(email.trim())) return setError("Enter the email you ordered with.");

    setError("");
    setBusy(true);
    try {
      const { token } = await api("/orders/lookup", { method: "POST", body: { no: n, email: email.trim() } });
      navigate(`/order/${n}?t=${token}`);
    } catch (err) {
      setBusy(false);
      setError(
        err.status === 404
          ? "We couldn't find an order with those details."
          : "Something went wrong on our side. Please try again."
      );
    }
  };

  return (
    <div className="px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="label opacity-60">Help / Track an order</p>
        <h1 className="display mt-5 text-[clamp(3.2rem,9vw,8rem)] font-semibold">
          {["Where's my", "bottle?"].map((t, i) => (
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

        <form onSubmit={submit} noValidate className="mt-14 max-w-[560px] lg:mt-20">
          <div className="grid gap-y-7">
            <Field
              label="Order number"
              name="no"
              inputMode="numeric"
              autoComplete="off"
              placeholder="4472"
              value={no}
              onChange={(e) => { setNo(e.target.value); setError(""); }}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@yourtable.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
          </div>

          {error && (
            <p role="alert" className="label mt-6 flex items-center gap-1.5 text-chili">
              <FontAwesomeIcon icon={faCircleExclamation} className="text-xs" aria-hidden />
              <span>{error}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="label mt-8 flex h-14 w-full items-center justify-between bg-soil px-6 text-paper transition-colors duration-200 hover:bg-chili disabled:opacity-60"
          >
            <span>{busy ? "Looking…" : "Open my order slip"}</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
          </button>
          <p className="label mt-4 opacity-60">The order number is printed on your slip, top right.</p>
        </form>
      </div>
    </div>
  );
}