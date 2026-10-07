import { motion } from "framer-motion";

const ease = [0.2, 0.7, 0.2, 1];
const letters = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const box = "border border-[color-mix(in_srgb,currentColor_35%,transparent)]";

export default function SeasonStrip({ months }) {
  const now = new Date().getMonth();
  const live = months.includes(now);

  return (
    <div>
      <p className="label flex justify-between opacity-70">
        <span>Harvest window</span>
        {live && <span>● In season now</span>}
      </p>

      <div className="mt-4 grid grid-cols-12 gap-[3px]">
        {letters.map((l, m) => (
          <div key={m} className="relative">
            <div className={`relative h-9 overflow-hidden ${box}`}>
              {months.includes(m) && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 origin-bottom bg-current"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + m * 0.04, ease }}
                />
              )}
            </div>
            <span className="label mt-1 block text-center opacity-60">{l}</span>
            {m === now && (
              <span
                aria-label="Current month"
                className="absolute -top-[13px] left-1/2 -translate-x-1/2 text-[8px] leading-none"
              >
                ▼
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}