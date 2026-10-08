import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { heroSlides } from "../../data/hero";
import { flavorMeta } from "../../data/flavorMeta";
import { bottleFor, botanicalFor } from "../../lib/assets";
import { shapes } from "../hero/shapes";
import paper from "../../assets/images/paper.jpg";

const ease = [0.2, 0.7, 0.2, 1];
const edge = "border border-[color-mix(in_srgb,currentColor_30%,transparent)]";
const views = [["bottle", "Bottle"], ["spec", "Spec"], ["plate", "Plate"]];

const blueprint = {
  backgroundImage:
    "linear-gradient(color-mix(in srgb, currentColor 11%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, currentColor 11%, transparent) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

/* ---------- drifting SVG props (same ones as the hero) ---------- */
function Props({ id }) {
  const slide = heroSlides.find((s) => s.id === id);
  const px = (n) => `${n}px`;
  return (
    <>
      {slide.props.slice(0, 5).map((p, i) => {
        const Shape = shapes[p.shape];
        const s = p.size * 0.72;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2,
              rotate: p.rot, transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease }}
          >
            <div
              className="drift h-full w-full"
              style={{
                transformStyle: "preserve-3d",
                "--dx": px(p.dx), "--dy": px(p.dy), "--dz": px(p.dz),
                "--dr": `${p.dr}deg`, "--drx": `${p.drx}deg`,
                "--dur": `${p.dur}s`, "--delay": `${p.delay}s`,
              }}
            >
              <Shape a={p.colors[0]} b={p.colors[1]} c={p.colors[2]} />
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

/* ---------- view 1: the bottle ---------- */
function BottleView({ f, size }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });
  const rotateY = useTransform(sx, (v) => v * 16);
  const rotateX = useTransform(sy, (v) => v * -8);

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <div className="absolute inset-0" onPointerMove={onMove} onPointerLeave={leave}>
      <AnimatePresence mode="wait">
        <motion.div
          key={f.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <Props id={f.id} />

          <div className="absolute inset-0 flex items-end justify-center pb-[9%]">
            <motion.div
              className="relative h-[74%]"
              style={{ rotateX, rotateY, originY: 1 }}
              animate={{ scale: size.scale }}
              transition={{ duration: 0.7, ease }}
            >
              <motion.div
                className="h-full"
                initial={{ y: 80, opacity: 0, rotate: 4 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
              >
                <img
                  src={bottleFor(f.id)}
                  alt={`${f.name} hot sauce bottle`}
                  draggable={false}
                  className="bottle-float h-full w-auto drop-shadow-[0_28px_26px_rgba(0,0,0,0.30)]"
                />
              </motion.div>
              <span className="pointer-events-none absolute -bottom-[2%] left-1/2 h-[3.5%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-lg" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- view 2: the spec drawing ---------- */
const callouts = [
  [8, "Cap", "Matte black, screw"],
  [56, "Label", "Uncoated cream stock"],
  [90, "Glass", "Clear woozy bottle"],
];

function Dim({ className, style, vertical }) {
  return (
    <motion.span
      aria-hidden
      className={`absolute bg-current ${className}`}
      style={{ ...style, transformOrigin: vertical ? "top" : "left" }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      animate={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease }}
    />
  );
}

function SpecView({ f, size }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={blueprint}>
      <motion.div
        className="relative w-fit"
        initial={false}
        animate={{ height: `${58 * size.scale}%` }}
        transition={{ duration: 0.7, ease }}
      >
        <motion.img
          key={f.id}
          src={bottleFor(f.id)}
          alt={`${f.name} bottle, dimensioned drawing`}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="block h-full w-auto"
        />

        {/* height */}
        <Dim vertical className="-left-10 top-0 h-full w-px" />
        <Dim className="-left-[46px] top-0 h-px w-3" />
        <Dim className="-left-[46px] bottom-0 h-px w-3" />
        <span className="label absolute -left-[68px] top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">
          {size.h} mm
        </span>

        {/* diameter */}
        <Dim className="-bottom-10 left-0 h-px w-full" />
        <Dim vertical className="-bottom-[46px] left-0 h-3 w-px" />
        <Dim vertical className="-bottom-[46px] right-0 h-3 w-px" />
        <span className="label absolute -bottom-[66px] left-1/2 -translate-x-1/2 whitespace-nowrap">
          Ø {size.d} mm
        </span>

        {/* callouts */}
        {callouts.map(([y, title, detail], i) => (
          <motion.div
            key={title}
            className="absolute left-[62%] flex items-center"
            style={{ top: `${y}%` }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 + i * 0.12, ease }}
          >
            <span className="h-px w-12 bg-current opacity-70 lg:w-28" />
            <span className="h-1.5 w-1.5 -translate-x-px rounded-full bg-current" />
            <span className="label ml-2 whitespace-nowrap leading-tight">
              {title}
              <span className="hidden opacity-70 sm:block">
                {title === "Glass" ? `${size.ml} ml, clear` : detail}
              </span>
            </span>
          </motion.div>
        ))}
      </motion.div>

      <p className="label absolute bottom-3 right-4 opacity-60">Not to scale</p>
    </div>
  );
}

/* ---------- view 3: the botanical plate ---------- */
function PlateView({ f }) {
  const meta = flavorMeta[f.id];
  const plate = botanicalFor(meta.botanical);
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <motion.div
        key={f.id}
        initial={{ opacity: 0, y: 30, rotate: meta.rot + 2.5 }}
        animate={{ opacity: 1, y: 0, rotate: meta.rot }}
        transition={{ duration: 0.8, ease }}
        className="relative aspect-[4/5] h-full max-h-full max-w-full border border-soil/15 text-soil shadow-[0_26px_44px_-22px_rgba(0,0,0,0.6)]"
        style={{
          backgroundColor: "#E6DCC6",
          backgroundImage: `url(${paper})`,
          backgroundBlendMode: "multiply",
          backgroundSize: "420px",
        }}
      >
        <div className="pointer-events-none absolute inset-3 border border-soil/25" />
        <p className="label absolute inset-x-6 top-6 flex justify-between opacity-70">
          <span>Plate {f.no} / 06</span>
          <span>{f.latin}</span>
        </p>
        {plate && (
          <img
            src={plate}
            alt={`Botanical illustration for ${f.name}`}
            draggable={false}
            className="absolute inset-x-[8%] top-[13%] h-[66%] w-[84%] object-contain mix-blend-multiply brightness-105 contrast-105"
          />
        )}
        <span
          className="label absolute bottom-6 right-6 rotate-[8deg] border-2 px-3 py-1.5 mix-blend-multiply"
          style={{ color: f.color, borderColor: f.color }}
        >
          Heat {f.heat}/5
        </span>
        <p className="display-s absolute bottom-6 left-6 text-xl italic">{f.name}</p>
      </motion.div>
    </div>
  );
}

/* ---------- the gallery ---------- */
export default function Gallery({ f, size, ink, slide }) {
  const [view, setView] = useState("bottle");

  return (
    <div>
      <div className="flex min-w-0 items-end justify-between gap-4">
        <div role="tablist" aria-label="Bottle views" className="flex gap-1">
          {views.map(([id, label]) => {
            const on = view === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={on}
                onClick={() => setView(id)}
                className={`label border border-b-0 border-current px-4 py-2.5 transition-opacity duration-200 ${on ? "" : "opacity-55 hover:opacity-100"}`}
                style={on ? { background: ink, color: f.color } : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="label min-w-0 shrink truncate text-right opacity-70">{size.ml} ml · Batch 07</p>
      </div>

      <div
        className={`relative h-[62svh] min-h-[440px] overflow-hidden lg:h-[calc(100svh-236px)] lg:min-h-[500px] ${edge}`}
        style={{ perspective: 1100 }}
      >
        {/* vertical name + numeral, behind everything */}
        <p
          aria-hidden
          className="display pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rotate-180 select-none whitespace-nowrap text-[clamp(3rem,9svh,6.5rem)] font-semibold opacity-[0.13] [writing-mode:vertical-rl]"
        >
          {slide.lines[0]}
          <br />
          {slide.lines[1]}
        </p>
        <p aria-hidden className="display pointer-events-none absolute -bottom-6 right-3 select-none text-[clamp(8rem,22svh,15rem)] opacity-[0.1]">
          {f.no}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {view === "bottle" && <BottleView f={f} size={size} />}
            {view === "spec" && <SpecView f={f} size={size} />}
            {view === "plate" && <PlateView f={f} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}