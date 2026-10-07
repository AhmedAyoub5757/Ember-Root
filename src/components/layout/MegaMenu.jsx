import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { flavors } from "../../data/products";
import { bottleFor } from "../../lib/assets";
import HeatRuler from "../ui/HeatRuler";

const range = [
  { label: "All sauces", to: "/shop" },
  { label: "Gift sets", to: "/shop/gifts" },
  { label: "The trio box", to: "/shop/trio" },
  { label: "Heat guide", to: "/heat-guide" },
];

const ease = [0.2, 0.7, 0.2, 1];

export default function MegaMenu({ open, active, setActive, ink, close }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mega-menu"
          initial={{ height: 0 }}
          animate={{ height: 480 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.5, ease }}
          className="hidden overflow-hidden lg:block"
        >
          <div className="hair mx-auto grid h-[480px] max-w-[1400px] grid-cols-12 gap-8 px-8">
            {/* Column A: the range */}
            <div className="col-span-2 flex flex-col pt-8 pb-8">
              <p className="label opacity-60">The Range</p>
              <ul className="mt-5">
                {range.map((r) => (
                  <li key={r.to} className="hair">
                    <Link
                      to={r.to}
                      onClick={close}
                      className="display block py-3 text-xl transition-transform duration-200 hover:translate-x-1"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="label mt-auto opacity-60">Batch 07 / Bottling now</p>
            </div>

            {/* Column B: the index */}
            <div className="col-span-5 pt-8">
              <div className="label flex justify-between opacity-60">
                <span>Index of varieties</span>
                <span>06 entries</span>
              </div>
              <ul className="mt-5">
                {flavors.map((f, i) => {
                  const isActive = active.id === f.id;
                  return (
                    <motion.li
                      key={f.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.04, duration: 0.4, ease }}
                      className="hair"
                    >
                      <Link
                        to={`/flavor/${f.id}`}
                        onClick={close}
                        onMouseEnter={() => setActive(f)}
                        onFocus={() => setActive(f)}
                        className={`grid grid-cols-[3rem_1fr_auto] items-baseline py-3 transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        <span className="label">{f.no}</span>
                        <span
                          className={`display text-3xl transition-transform duration-300 ${
                            isActive ? "translate-x-2" : ""
                          }`}
                        >
                          {f.name}
                        </span>
                        <span className="label">{f.scoville} SHU</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Column C: specimen plate */}
            <div className="relative col-span-5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.no}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 0.14, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="display pointer-events-none absolute -top-2 right-0 select-none text-[17rem]"
                >
                  {active.no}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                <motion.img
                  key={active.id}
                  src={bottleFor(active.id)}
                  alt={`${active.name} bottle`}
                  initial={{ opacity: 0, y: 50, rotate: 4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute -bottom-12 right-0 h-[115%] w-auto object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.28)]"
                />
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex h-full w-[48%] flex-col pt-8 pb-8"
                >
                  <p className="label opacity-70">
                    No. {active.no} / {active.latin}
                  </p>
                  <h3 className="display mt-3 text-4xl">{active.name}</h3>
                  <p className="mt-4 max-w-[26ch] text-sm leading-relaxed opacity-80">
                    {active.notes}
                  </p>

                  <div className="mt-auto">
                    <p className="label mb-2 opacity-70">Heat {active.heat} / 5</p>
                    <HeatRuler level={active.heat} color={ink} />
                    <Link
                      to={`/flavor/${active.id}`}
                      onClick={close}
                      className="label mt-6 inline-flex items-center gap-3 border-b border-current pb-1"
                    >
                      Enter the field <span aria-hidden>→</span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}