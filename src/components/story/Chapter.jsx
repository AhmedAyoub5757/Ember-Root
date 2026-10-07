import { motion } from "framer-motion";
import Art from "./Art";

const ease = [0.2, 0.7, 0.2, 1];
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12%" },
  transition: { duration: 0.8, delay, ease },
});

export default function Chapter({ c, i }) {
  return (
    <article id={`chapter-${i}`} className="relative flex min-h-[100svh] flex-col justify-center py-24">
      <p className="label opacity-70">
        Chapter {c.no} / {c.season} / {c.days}
      </p>

      <h3 className="display mt-4 text-[clamp(4.5rem,13vw,12rem)] font-semibold">
        <span className="block overflow-hidden pb-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease }}
          >
            {c.name}
          </motion.span>
        </span>
      </h3>

      <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-12">
        <div className="col-span-12 md:col-span-7">
          <motion.p {...fade(0.1)} className="max-w-[46ch] text-lg leading-relaxed">
            {c.text}
          </motion.p>

          <dl className="mt-8 max-w-[46ch]">
            {c.data.map(([k, v], n) => (
              <motion.div
                key={k}
                {...fade(0.2 + n * 0.08)}
                className="hair flex justify-between gap-6 py-3 text-sm"
              >
                <dt className="label opacity-60">{k}</dt>
                <dd className="text-right">{v}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Art name={c.art} className="w-[min(62vw,250px)] md:ml-auto" />
          <motion.p
            {...fade(0.5)}
            className="display-s mt-8 max-w-[24ch] -rotate-2 text-xl italic opacity-90 md:ml-auto md:text-2xl"
          >
            ↳ {c.note}
          </motion.p>
        </div>
      </div>
    </article>
  );
}