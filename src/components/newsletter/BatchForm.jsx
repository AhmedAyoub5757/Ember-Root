import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flavors } from "../../data/products";
import { BATCH } from "../../data/batch";
import { api } from "../../lib/api";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function BatchForm() {
  const [email, setEmail] = useState("");
  const [picks, setPicks] = useState([]);
  const [error, setError] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done
  const honey = useRef(null);

  const toggle = (id) =>
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const submit = async (e) => {
    e.preventDefault();
    if (state === "sending") return;

    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError("That doesn't look like an email address. Check it once more?");
      return;
    }
    setError("");

    if (honey.current?.value) { setState("done"); return; } // bots fill the hidden field

    setState("sending");
    try {
      await api("/subscribe", {
        method: "POST",
        body: {
          email: value,
          flavors: picks,
          batch: BATCH.no,
          company: honey.current?.value,
        },
      });
      setEmail(value);
      setState("done");
    } catch (err) {
      setState("idle");
      setError(err.message || "Something went wrong on our side. Please try again.");
    }
  };

  const reset = () => { setState("idle"); setEmail(""); setPicks([]); };
  const names = picks.map((id) => flavors.find((f) => f.id === id).name);

  return (
    <div className="mt-16 lg:mt-20">
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative border border-current p-6 pt-10 lg:p-8 lg:pt-12"
          >
            <motion.span
              initial={{ scale: 2.4, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 8 }}
              transition={{ type: "spring", stiffness: 520, damping: 17, delay: 0.25 }}
              className="label absolute -top-5 right-5 border-2 border-paper bg-chili px-4 py-2 text-base"
            >
              Reserved
            </motion.span>

            <p className="label opacity-70">Batch {BATCH.no} / Reserve list</p>
            <p className="display-s mt-3 text-3xl lg:text-5xl">You're on the list.</p>
            <p className="mt-4 max-w-[46ch] leading-relaxed opacity-90">
              We'll write to <strong className="break-all font-semibold">{email}</strong> the
              morning the crock opens.
              {names.length > 0 && <> You're waiting for: {names.join(", ")}.</>}
            </p>
            <button
              type="button"
              onClick={reset}
              className="label mt-6 border-b border-current pb-1"
            >
              Use a different email
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <label htmlFor="batch-email" className="label opacity-70">
              Reserve a bottle · Your email
            </label>

            <input
              id="batch-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@yourtable.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
              aria-invalid={!!error}
              aria-describedby={error ? "batch-error" : undefined}
              className="display-s mt-3 block w-full border-0 border-b-2 border-current bg-transparent pb-3 text-3xl placeholder:text-paper/40 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-paper lg:text-5xl"
            />

            {/* honeypot */}
            <input
              ref={honey}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {error && (
              <p id="batch-error" role="alert" className="label mt-3">
                ✕ {error}
              </p>
            )}

            <fieldset className="mt-8">
              <legend className="label opacity-70">
                Which jar are you waiting for? (optional)
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {flavors.map((f) => {
                  const on = picks.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(f.id)}
                      className={`label inline-flex items-center gap-2 border px-3 py-2 transition-colors duration-200 ${
                        on
                          ? "border-paper bg-paper text-soil"
                          : "border-paper/40 hover:border-paper"
                      }`}
                    >
                      <span className="h-2.5 w-2.5 border border-current" style={{ background: f.color }} />
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="submit"
                disabled={state === "sending"}
                className="label inline-flex items-center gap-3 border border-soil bg-soil px-6 py-4 text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-soil disabled:opacity-60"
              >
                {state === "sending" ? "Sealing…" : <>Join the list <span aria-hidden>→</span></>}
              </button>
              <p className="label max-w-[34ch] opacity-70">
                One email per batch. No spam. Unsubscribe whenever.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}