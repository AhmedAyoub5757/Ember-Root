import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { bottleFor, botanicalFor } from "../../lib/assets";
import { flavorMeta } from "../../data/flavorMeta";
import paper from "../../assets/images/paper.jpg";

const ease = [0.2, 0.7, 0.2, 1];
const tape =
  "absolute -top-3 h-7 w-20 border border-soil/10 bg-[#E7D9A8]/75 shadow-sm";

export default function Specimen({ f }) {
  const meta = flavorMeta[f.id];
  const plate = botanicalFor(meta.botanical);
  const shu = Number(f.scoville.replace(/,/g, ""));

  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    const c = animate(count, shu, { duration: 1.2, delay: 0.25, ease });
    return () => c.stop();
  }, [count, shu]);

  return (
    <>
      {/* Layer A: the paper sheet */}
      <motion.div
        initial={{ clipPath: "inset(0 0 100% 0)", rotate: meta.rot + 2.5 }}
        animate={{
          clipPath: "inset(0 0 0% 0)",
          rotate: meta.rot,
          transition: { duration: 0.75, ease },
        }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.45 } }}
        className="absolute inset-0 border border-soil/15 shadow-[0_22px_40px_-20px_rgba(31,26,20,0.5)]"
        style={{
          backgroundColor: "#E6DCC6",
          backgroundImage: `url(${paper})`,
          backgroundBlendMode: "multiply",
          backgroundSize: "420px",
        }}
      >
        <div className="pointer-events-none absolute inset-3 border border-soil/25" />

        <div className="label absolute inset-x-6 top-6 flex justify-between opacity-70">
          <span>Plate {f.no} / 06</span>
          <span>Batch 07</span>
        </div>

        {plate && (
          <motion.img
            src={plate}
            alt={`Botanical illustration for ${f.name}`}
            draggable={false}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.35, duration: 0.9, ease } }}
            className="absolute left-[3%] top-[12%] h-[52%] w-[72%] object-contain mix-blend-multiply brightness-105 contrast-105"
          />
        )}

        {/* rubber stamp */}
        <div
          className="label absolute right-[8%] top-[13%] rotate-[9deg] border-2 px-3 py-1.5 mix-blend-multiply"
          style={{ color: f.color, borderColor: f.color }}
        >
          Heat {f.heat}/5
        </div>

        {/* label block */}
        <div className="absolute inset-x-6 bottom-6 w-[56%]">
          <p className="display text-xl italic lg:text-2xl">{f.latin}</p>
          <p className="mt-2 hidden max-w-[26ch] text-[13px] leading-snug opacity-80 lg:block">
            {f.notes}
          </p>
          <dl className="mt-3 text-[11px]">
            <div className="hair flex justify-between gap-3 py-1.5">
              <dt className="label opacity-60">Pairs</dt>
              <dd className="text-right">{meta.pairs}</dd>
            </div>
            <div className="hair flex justify-between gap-3 py-1.5">
              <dt className="label opacity-60">Scoville</dt>
              <dd className="font-mono">
                <motion.span>{shown}</motion.span> SHU
              </dd>
            </div>
          </dl>
        </div>
      </motion.div>

      {/* Layer B: tape + bottle, free to overflow the sheet */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
      >
        <span className={`${tape} left-[9%] -rotate-[7deg]`} />
        <span className={`${tape} right-[9%] rotate-[6deg]`} />

        <motion.img
          src={bottleFor(f.id)}
          alt={`${f.name} bottle`}
          draggable={false}
          initial={{ y: 70, opacity: 0, rotate: 5 }}
          animate={{ y: 0, opacity: 1, rotate: 0, transition: { delay: 0.2, duration: 0.8, ease } }}
          className="absolute -bottom-[4%] -right-[3%] h-[62%] w-auto drop-shadow-[0_24px_22px_rgba(31,26,20,0.35)]"
        />
      </motion.div>
    </>
  );
}