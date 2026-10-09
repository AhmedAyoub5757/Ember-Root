import { motion } from "framer-motion";
import { flavors } from "../../data/products";
import { inkFor } from "../../lib/color";

const ease = [0.2, 0.7, 0.2, 1];

const MIN = 3;     // log10(1,000 SHU)
const SPAN = 3.2;  // axis runs from 1K to ~1.6M
const pct = (shu) => ((Math.log10(shu) - MIN) / SPAN) * 100;
const num = (s) => Number(s.replace(/,/g, ""));

const decades = [[1e3, "1K"], [1e4, "10K"], [1e5, "100K"], [1e6, "1M"]];
const refs = [[40000, "Cayenne ~40K"], [200000, "Habanero ~200K"]];

// staggered stem heights so neighbouring pins never collide
const stem = {
  "kashmiri-red": 40,
  "green-jalapeno-lime": 68,
  "smoked-chipotle": 40,
  "mango-habanero": 68,
  "garlic-serrano": 40,
  "ghost-reserve": 40,
};

const ticks = [];
for (let d = 3; d <= 6; d++) {
  for (let m = 1; m <= 9; m++) {
    const v = m * 10 ** d;
    if (pct(v) <= 100) ticks.push({ v, major: m === 1 });
  }
}

export default function HeatScale({ activeId, setActive }) {
  const active = flavors.find((f) => f.id === activeId);

  return (
    <figure className="mt-24 lg:mt-32">
      <figcaption className="label flex justify-between gap-6 opacity-60">
        <span>Fig. 2 — Relative heat, logarithmic scale</span>
        <span className="hidden sm:inline">Scoville heat units</span>
      </figcaption>

      <div className="no-scrollbar -mx-1 mt-6 overflow-x-auto pb-5">
        <div className="relative mx-4 h-[190px] min-w-[560px]">
          <div className="absolute inset-x-0 bottom-[64px]">
          {/* axis */}
          <motion.div
            className="h-px origin-left bg-current"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
          />

          {/* ticks */}
          {ticks.map((t) => (
            <span
              key={t.v}
              className="absolute top-0 w-px bg-current opacity-50"
              style={{ left: `${pct(t.v)}%`, height: t.major ? 14 : 7 }}
            />
          ))}

          {/* decade labels */}
          {decades.map(([v, l]) => (
            <span
              key={l}
              className="label absolute top-[18px] -translate-x-1/2 opacity-60"
              style={{ left: `${pct(v)}%` }}
            >
              {l}
            </span>
          ))}

          {/* reference marks */}
          {refs.map(([v, l]) => (
            <div key={l} className="absolute top-0" style={{ left: `${pct(v)}%` }}>
              <span className="absolute -left-[4px] -top-[4px] h-2 w-2 rotate-45 border border-current bg-paper" />
              <span className="absolute left-0 top-1 h-[40px] border-l border-dashed border-current opacity-40" />
              <span className="label absolute left-0 top-[46px] -translate-x-1/2 whitespace-nowrap opacity-60">
                {l}
              </span>
              </div>
          ))}

          {/* flavor pins */}
          {flavors.map((f, i) => {
            const isActive = f.id === activeId;
            return (
              <motion.button
                key={f.id}
                type="button"
                aria-label={`${f.name}, ${f.scoville} SHU`}
                onMouseEnter={() => setActive(f.id)}
                onFocus={() => setActive(f.id)}
                onClick={() => setActive(f.id)}
                className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${pct(num(f.scoville))}%` }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease }}
              >
                <span
                  className="label flex h-6 min-w-6 items-center justify-center border px-1 transition-colors duration-300"
                  style={
                    isActive
                      ? { background: f.color, borderColor: f.color, color: inkFor(f.color) }
                      : { borderColor: "currentColor" }
                  }
                >
                  {f.no}
                </span>
                <motion.span
                  className="w-px bg-current"
                  initial={false}
                  animate={{ height: stem[f.id] + (isActive ? 12 : 0) }}
                  transition={{ duration: 0.35, ease }}
                />
              </motion.button>
            );
          })}
        </div>
        </div>
      </div>

      <p className="label mt-3 flex justify-between gap-6">
        <span>Selected — No. {active.no} {active.name}</span>
        <span>{active.scoville} SHU</span>
      </p>
    </figure>
  );
}