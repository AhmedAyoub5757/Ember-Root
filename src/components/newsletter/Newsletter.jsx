import { useState } from "react";
import { motion } from "framer-motion";
import { BATCH } from "../../data/batch";
import Crock from "./Crock";
import Countdown from "./Countdown";
import BatchForm from "./BatchForm";

const ease = [0.2, 0.7, 0.2, 1];
const DAY = 86400000;

const rise = {
  hidden: { y: "105%" },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: i * 0.12, ease } }),
};

// measured once, so the crock doesn't re-animate every second
function measure() {
  const a = Date.parse(BATCH.sealed);
  const b = Date.parse(BATCH.opens);
  const n = Date.now();
  const total = Math.round((b - a) / DAY);
  return {
    total,
    p: Math.min(1, Math.max(0, (n - a) / (b - a))),
    day: Math.min(total, Math.max(0, Math.floor((n - a) / DAY))),
  };
}

export default function Newsletter() {
  const [m] = useState(measure);

  return (
    <section id="batch" className="bg-chili px-5 pb-24 pt-24 text-paper lg:px-8 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <header className="grid grid-cols-12 gap-x-0 gap-y-8 lg:gap-x-8">
          <div className="col-span-12 min-w-0 lg:col-span-8">
            <h2 className="display mt-5 text-[clamp(3.2rem,9vw,8.5rem)] font-semibold">
              {[`Batch ${BATCH.no} is`, "still asleep."].map((t, i) => (
                <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[10vw]" : ""}`}>
                  <motion.span
                    className="block"
                    variants={rise}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>
          <div className="col-span-12 min-w-0 lg:col-span-4 lg:self-end">
            <p className="max-w-[38ch] leading-relaxed opacity-90">
              Ninety days in the crock, and not one day less. Leave your email
              and we'll write to you the morning it opens, before the shop does.
            </p>
          </div>
        </header>

        <div className="mt-14 grid grid-cols-12 gap-x-0 gap-y-14 lg:mt-24 lg:gap-x-10">
          {/* crock first on mobile, right column on desktop */}
          <div className="order-first col-span-12 min-w-0 lg:order-last lg:col-span-5">
            <div className="mx-auto max-w-[420px] lg:sticky lg:top-[128px] lg:max-w-none">
              <Crock progress={m.p} day={m.day} total={m.total} batchNo={BATCH.no} />
            </div>
          </div>

          <div className="col-span-12 min-w-0 lg:col-span-7">
            <Countdown target={BATCH.opens} />
            <BatchForm />
          </div>
        </div>
      </div>
    </section>
  );
}