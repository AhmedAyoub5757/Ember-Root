import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ease = [0.2, 0.7, 0.2, 1];
const MotionLink = motion(Link);

const links = [
  { label: "Shop", to: "/shop" },
  { label: "The story", to: "/story" },
  { label: "Ingredients", to: "/ingredients" },
  { label: "Contact", to: "/contact" },
];

export default function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <footer className="overflow-hidden bg-soil text-paper">
      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-24 lg:px-8 lg:pt-32">
        <div className="grid grid-cols-12 gap-x-8 gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <p className="label opacity-60">06 / The next batch</p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease }}
              className="display mt-5 text-[clamp(3.2rem,8vw,7.5rem)] font-semibold"
            >
              <span className="block">Be first</span>
              <span className="block lg:pl-[5vw]">to taste.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 0.75, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="mt-7 max-w-[36ch] leading-relaxed"
            >
              A quiet note when a new batch leaves the field. No weekly noise,
              just harvests, releases and the occasional good idea for lunch.
            </motion.p>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:pt-16">
            <div className="border border-paper/30 p-5 sm:p-8">
              <div className="label flex items-center justify-between gap-6 opacity-60">
                <span>Batch release register</span>
                <span>01 / 01</span>
              </div>

              <form onSubmit={submit} className="mt-10">
                <label htmlFor="batch-email" className="display-s block text-2xl sm:text-3xl">
                  Your email, not your inbox.
                </label>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="batch-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSent(false);
                    }}
                    placeholder="you@example.com"
                    required
                    disabled={sent}
                    className="label min-w-0 flex-1 border border-paper/40 bg-transparent px-4 py-4 text-paper outline-none placeholder:text-paper/45 focus:border-paper disabled:opacity-60"
                  />
                  <motion.button
                    type="submit"
                    disabled={sent}
                    whileHover={sent ? undefined : { backgroundColor: "#B8321F", borderColor: "#B8321F", color: "#F2EBDD" }}
                    whileTap={sent ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="label inline-flex items-center justify-center gap-3 border border-paper bg-paper px-6 py-4 text-soil disabled:cursor-default disabled:opacity-70"
                  >
                    {sent ? "Registered" : "Join the batch"} <span aria-hidden>→</span>
                  </motion.button>
                </div>
                <p role="status" className="label mt-4 min-h-4 opacity-60">
                  {sent ? "You are on the list. Watch for the next pour." : "One note per release · unsubscribe whenever."}
                </p>
              </form>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-paper/25 pt-4 sm:grid-cols-4">
              {[
                ["260", "days to bottle"],
                ["06", "sauce varieties"],
                ["01", "single field"],
                ["150", "ml per bottle"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="display text-3xl">{value}</p>
                  <p className="label mt-1 opacity-55">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
          className="mt-24 min-w-0 border-y border-paper/25 py-5 lg:mt-32"
        >
          <motion.p
            initial={{ letterSpacing: "0.02em" }}
            whileInView={{ letterSpacing: "-0.07em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.15, ease }}
            className="display flex min-w-0 items-center justify-center whitespace-nowrap text-[clamp(2.35rem,9.4vw,9rem)] font-semibold leading-[0.78]"
          >
            <span>EMBER</span>
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 320, damping: 15 }}
              className="mx-[0.06em] inline-block origin-center text-chili"
            >
              &amp;
            </motion.span>
            <span>ROOT</span>
          </motion.p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label opacity-60">Small batch / Single estate chilies</p>
            <p className="label mt-2 opacity-40">© 2026 Ember &amp; Root</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3">
            {links.map((link) => (
              <MotionLink key={link.to} to={link.to} whileHover={{ opacity: 1, x: 2 }} transition={{ duration: 0.2 }} className="label opacity-65">
                {link.label}
              </MotionLink>
            ))}
            <motion.a href="#top" whileHover={{ opacity: 1, x: 2 }} transition={{ duration: 0.2 }} className="label opacity-65">Back to top ↑</motion.a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
