import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import Field from "../components/checkout/Field";

const ease = [0.2, 0.7, 0.2, 1];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TOPICS = [
  "General",
  "Order inquiry",
  "Batch reservation",
  "Wholesale & Stockists",
  "Press & Collabs",
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const honey = useRef(null);

  useEffect(() => {
    document.title = "Write to us: Ember & Root";
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Please enter your name.";
    }
    if (!email.trim() || !EMAIL.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!message.trim() || message.trim().length < 5) {
      errs.message = "Please write a message (at least 5 characters).";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (honey.current?.value) {
      setSubmitted(true);
      return;
    }

    setBusy(true);
    try {
      await api("/contact", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
          company: honey.current?.value,
        },
      });
      setBusy(false);
      setSubmitted(true);
    } catch (err) {
      setBusy(false);
      setErrors({
        form: err.message || "Something went wrong on our side. Please try again.",
      });
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setTopic("General");
    setMessage("");
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="label opacity-60">Learn / Write to us</p>

        <h1 className="display mt-5 text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold">
          {["Write to the", "kitchen."].map((t, i) => (
            <span
              key={t}
              className={`block overflow-hidden pb-[0.12em] ${
                i ? "lg:pl-[7vw]" : ""
              }`}
            >
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

        <div className="mt-14 grid grid-cols-12 gap-y-16 lg:mt-20 lg:gap-x-16">
          {/* Left: Contact form or submission success */}
          <div className="col-span-12 lg:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="relative border border-soil p-8 pt-12 lg:p-12 lg:pt-14"
                >
                  <motion.span
                    initial={{ scale: 2.2, opacity: 0, rotate: -12 }}
                    animate={{ scale: 1, opacity: 1, rotate: 6 }}
                    transition={{
                      type: "spring",
                      stiffness: 480,
                      damping: 18,
                      delay: 0.2,
                    }}
                    className="label absolute -top-4 right-6 border-2 border-soil bg-chili px-4 py-1.5 text-sm text-paper"
                  >
                    Note Dispatched
                  </motion.span>

                  <p className="label opacity-60">
                    Topic · {topic}
                  </p>
                  <h2 className="display-s mt-3 text-3xl font-medium lg:text-4xl">
                    We've got your note, {name.split(" ")[0]}.
                  </h2>
                  <p className="mt-4 max-w-[48ch] text-lg leading-relaxed opacity-85">
                    A copy and confirmation will be on its way to{" "}
                    <strong className="break-all font-semibold text-soil">
                      {email}
                    </strong>
                    . We respond to every dispatch as soon as the day's batches are stirred and sealed.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="label border-b border-soil pb-1 transition-colors hover:text-chili"
                    >
                      Send another note
                    </button>
                    <Link
                      to="/"
                      className="label inline-flex items-center gap-2 border border-soil bg-soil px-6 py-3 text-paper transition-colors duration-200 hover:bg-chili hover:border-chili"
                    >
                      Back to cellar <span aria-hidden>→</span>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Topic Selector */}
                  <div>
                    <label className="label block opacity-70 mb-3">
                      What is this regarding?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => {
                        const active = topic === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTopic(t)}
                            className={`label inline-flex items-center border px-3.5 py-2 text-sm transition-all duration-200 ${
                              active
                                ? "border-soil bg-soil text-paper"
                                : "border-soil/30 text-soil hover:border-soil"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <Field
                      label="Your name"
                      name="name"
                      placeholder="Maryam Khan"
                      autoComplete="name"
                      value={name}
                      error={errors.name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                    />

                    <Field
                      label="Email address"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="maryam@table.com"
                      value={email}
                      error={errors.email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                    />
                  </div>

                  <Field
                    label="Message"
                    name="message"
                    as="textarea"
                    rows={5}
                    placeholder="Tell us what's on your mind, wholesale inquiries, or bottle questions…"
                    value={message}
                    error={errors.message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                  />

                  {/* Honeypot field for bot suppression */}
                  <input
                    ref={honey}
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  {errors.form && (
                    <p role="alert" className="label text-chili">
                      ✕ {errors.form}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="label flex h-14 w-full items-center justify-between border border-soil bg-soil px-6 text-paper transition-colors duration-200 hover:border-chili hover:bg-chili disabled:opacity-60"
                    >
                      <span>{busy ? "Sealing and sending…" : "Send dispatch note"}</span>
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Direct info & context */}
          <div className="col-span-12 space-y-10 lg:col-span-5 lg:pl-6">
            <div className="border-t border-soil/20 pt-6">
              <p className="label opacity-60">The Fermentation House</p>
              <h3 className="display-s mt-2 text-2xl font-semibold">Direct kitchen inquiries</h3>
              <p className="mt-3 text-base leading-relaxed opacity-80">
                Every batch is crafted in small earthen crocks. If you're a chef, restaurateur, or boutique grocery looking for custom heat profiles or bulk reserve allocations, please select Wholesale above.
              </p>
            </div>

            <div className="space-y-6 border-t border-soil/20 pt-6 text-sm">
              <div>
                <p className="label opacity-60">Direct Dispatch Email</p>
                <a
                  href="mailto:kitchen@emberandroot.com"
                  className="display-s mt-1 block text-lg font-medium hover:underline"
                >
                  kitchen@emberandroot.com
                </a>
              </div>

              <div>
                <p className="label opacity-60">Kitchen & Bottling Hours</p>
                <p className="mt-1 font-mono text-xs opacity-80">
                  Monday – Friday · 09:00 – 18:00 PKT<br />
                  Saturday Tasting · 11:00 – 16:00 PKT
                </p>
              </div>

              <div>
                <p className="label opacity-60">Already have an order in transit?</p>
                <div className="mt-2 flex flex-wrap gap-4">
                  <Link to="/track" className="label border-b border-soil pb-0.5 hover:text-chili">
                    Track your order slip →
                  </Link>
                  <Link to="/faq" className="label border-b border-soil pb-0.5 hover:text-chili">
                    Read the FAQ →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
