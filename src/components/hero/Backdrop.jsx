import { motion, useTransform } from "framer-motion";
import { heroSlides } from "../../data/hero";
import { clamp01, offset } from "./math";

function TitleLine({ text, d, gain, px, className }) {
  const y = useTransform(d, (v) => `${v * 105 * gain}%`);
  return (
    <motion.span style={{ x: px }} className={`block ${className}`}>
      <span className="block overflow-hidden px-[0.05em] py-[0.06em]">
        <motion.span style={{ y }} className="block whitespace-nowrap">
          {text}
        </motion.span>
      </span>
    </motion.span>
  );
}

function Title({ slide, k, pos, smx }) {
  const d = useTransform(pos, (p) => offset(k, p));
  // 0.2 = how strongly the name shows through. Raise it for more contrast.
  const opacity = useTransform(d, (v) => clamp01(1 - Math.abs(v) * 1.1) * 0.2);
  const px1 = useTransform(smx, (v) => v * -18);
  const px2 = useTransform(smx, (v) => v * -34);

  return (
    <motion.div
      style={{ opacity }}
      className="display absolute inset-0 flex flex-col justify-center pb-[26%] font-semibold [font-size:var(--title-size)] lg:pb-0"
    >
      <TitleLine text={slide.lines[0]} d={d} gain={1} px={px1} className="self-start pl-[3vw]" />
      <TitleLine text={slide.lines[1]} d={d} gain={1.35} px={px2} className="self-end pr-[6vw]" />
    </motion.div>
  );
}

export default function Backdrop({ pos, smx }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {heroSlides.map((s, k) => (
        <Title key={s.id} slide={s} k={k} pos={pos} smx={smx} />
      ))}
    </div>
  );
}