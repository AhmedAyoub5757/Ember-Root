import { motion, useAnimationControls, useTransform } from "framer-motion";
import { heroSlides } from "../../data/hero";
import { bottleFor } from "../../lib/assets";
import { clamp01, offset } from "./math";
import { shapes } from "./shapes";

const STEP = 0.62; // radians of arc travelled per slide

function Bottle({ slide, k, pos, onBottle }) {
  const d = useTransform(pos, (p) => offset(k, p));
  const x = useTransform(d, (v) => `${(Math.cos(v * STEP) - 1) * 55}%`);   // the D bulge
  const y = useTransform(d, (v) => `${Math.sin(v * STEP) * 52}%`);
  const z = useTransform(d, (v) => -Math.abs(v) * 220);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 1.5) * 0.3);
  const rotate = useTransform(d, (v) => v * -16);
  const rotateY = useTransform(d, (v) => v * 40);
  const opacity = useTransform(d, (v) => clamp01(1 - Math.abs(v) * 1.2));
  const filter = useTransform(d, (v) => `blur(${Math.min(Math.abs(v) * 12, 12).toFixed(1)}px)`);
  const visibility = useTransform(d, (v) => (Math.abs(v) > 0.9 ? "hidden" : "visible"));
  const shake = useAnimationControls();

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pb-[26%] lg:pb-0"
      style={{ x, y, z, scale, rotate, rotateY, opacity, filter, visibility }}
    >
      <motion.div animate={shake} style={{ originY: 1 }} className="relative h-[58%] lg:h-[78%]">
        <img
          src={bottleFor(slide.id)}
          alt={`${slide.name} hot sauce bottle`}
          draggable={false}
          onClick={(e) => {
            if (!onBottle(e)) return;
            shake.start({ rotate: [0, -5, 4, -3, 2, 0], transition: { duration: 0.6 } });
          }}
          className="bottle-float pointer-events-auto h-full w-auto cursor-pointer drop-shadow-[0_28px_26px_rgba(0,0,0,0.30)]"
        />
        <span className="pointer-events-none absolute -bottom-[2%] left-1/2 h-[3.5%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-lg" />
      </motion.div>
    </motion.div>
  );
}

function Prop({ p, k, pos }) {
  const Shape = shapes[p.shape];
  const d = useTransform(pos, (v) => offset(k, v));
  const th = useTransform(d, (v) => v * STEP * p.gain);
  const x = useTransform(th, (t) => `${((Math.cos(t) - 1) * 34).toFixed(2)}vw`);
  const y = useTransform(th, (t) => `${(Math.sin(t) * 50).toFixed(2)}vh`);
  const z = useTransform(d, (v) => p.z - Math.abs(v) * 260);
  const rotateZ = useTransform(d, (v) => p.rot + v * p.spin);
  const rotateY = useTransform(d, (v) => v * 80);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 1) * 0.35);
  const opacity = useTransform(d, (v) => clamp01(1 - Math.abs(v) * p.fade));
  const filter = useTransform(d, (v) => `blur(${(p.blur + Math.min(Math.abs(v), 1) * 5).toFixed(1)}px)`);
  const visibility = useTransform(d, (v) => (Math.abs(v) > 0.95 ? "hidden" : "visible"));

  const u = (n) => `calc(var(--u) * ${n})`;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: u(p.size),
        height: u(p.size),
        marginLeft: u(-p.size / 2),
        marginTop: u(-p.size / 2),
        x, y, z, rotateZ, rotateY, scale,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="drift h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          "--dx": u(p.dx),
          "--dy": u(p.dy),
          "--dz": u(p.dz),
          "--dr": `${p.dr}deg`,
          "--drx": `${p.drx}deg`,
          "--dur": `${p.dur}s`,
          "--delay": `${p.delay}s`,
        }}
      >
        {/* opacity/filter live on the leaf so they don't flatten the 3D chain */}
        <motion.div className="h-full w-full" style={{ opacity, filter, visibility }}>
          <Shape a={p.colors[0]} b={p.colors[1]} c={p.colors[2]} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Stage({ pos, smx, smy, onBottle }) {
  const rotateY = useTransform(smx, (v) => v * 9);
  const rotateX = useTransform(smy, (v) => v * -7);

  return (
    <div className="pointer-events-none absolute inset-0 z-10" style={{ perspective: 1100 }}>
      <motion.div className="absolute inset-0" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {heroSlides.map((s, k) => (
          <Bottle key={s.id} slide={s} k={k} pos={pos} onBottle={onBottle} />
        ))}
        {heroSlides.map((s, k) =>
          s.props.map((p, i) => <Prop key={`${s.id}-${i}`} p={p} k={k} pos={pos} />)
        )}
      </motion.div>
    </div>
  );
}