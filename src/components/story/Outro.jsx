import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import hero from "../../assets/images/hero.jpg";

const stats = [["260", "days, seed to bottle"], ["06", "varieties"], ["01", "field"]];

export default function Outro() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const clip = useTransform(p, [0, 0.55], ["inset(22% 18% 22% 18%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(p, [0, 0.55], [1.25, 1]);
  const copyOpacity = useTransform(p, [0.5, 0.75], [0, 1]);
  const copyY = useTransform(p, [0.5, 0.75], [40, 0]);
  const hint = useTransform(p, [0, 0.25], [1, 0]);

  return (
    <div ref={ref} className="relative h-[220svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-soil">
          <motion.img
            src={hero}
            alt="A spoon of deep red hot sauce over charred flatbread, with chilies, garlic and lime"
            style={{ scale }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-soil/35" />
        </motion.div>

        <motion.p style={{ opacity: hint }} className="label absolute bottom-8 left-5 lg:left-8">
          Chapter 06 / The table ↓
        </motion.p>

        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="absolute inset-x-5 bottom-10 text-paper lg:inset-x-8 lg:bottom-14"
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-12 items-end gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-7">
              <p className="label opacity-70">Chapter 06 / The table</p>
              <h3 className="display mt-4 text-[clamp(3.5rem,10vw,9rem)] font-semibold">
                <span className="block">Then it's</span>
                <span className="block lg:pl-[8vw]">yours.</span>
              </h3>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <p className="max-w-[38ch] leading-relaxed opacity-90">
                Two hundred and sixty days later, it takes about four seconds to
                shake onto your plate. Worth the wait.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-4">
                {stats.map(([n, l]) => (
                  <div key={l} className="hair pt-3">
                    <dt className="display text-3xl">{n}</dt>
                    <dd className="label mt-1 opacity-70">{l}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/shop"
                className="label mt-8 inline-flex items-center gap-3 border border-paper px-6 py-4 transition-colors duration-200 hover:bg-paper hover:text-soil"
              >
                Shop the field <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}