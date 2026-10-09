import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ease = [0.2, 0.7, 0.2, 1];

export default function NotFound() {
  useEffect(() => { document.title = "Not found: Ember & Root"; }, []);

  return (
    <div className="px-5 pb-28 pt-10 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="label opacity-60">Error 404 / No such batch</p>
        <h1 className="display mt-5 text-[clamp(3.5rem,11vw,10rem)] font-semibold">
          {["Not on", "the label."].map((t, i) => (
            <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[10vw]" : ""}`}>
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
        <p className="mt-8 max-w-[40ch] leading-relaxed opacity-80">
          That page isn't in the field. It may have moved, or the link may have
          a typo in it.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            to="/"
            className="label inline-flex items-center gap-3 border border-soil bg-soil px-6 py-4 text-paper transition-colors hover:border-chili hover:bg-chili"
          >
            Back to the field <span aria-hidden>→</span>
          </Link>
          <Link to="/shop" className="label border-b border-current pb-1">Browse the sauces</Link>
        </div>
      </div>
    </div>
  );
}