import { motion, useTransform } from "framer-motion";
import { heroSlides } from "../../data/hero";
import { clamp01, offset } from "./math";

// D-shape geometry: straight spine on the left, curve bulging right
const W = 132, H = 360, CX = 8, CY = 180, RX = 92, RY = 164, PHI = 0.56;

const phiOf = (v) => Math.max(-1.55, Math.min(1.55, v * PHI));
const fadeOf = (v) => {
  const a = Math.abs(v * PHI);
  return a < 0.85 ? 1 : clamp01(1 - (a - 0.85) / 0.65);
};

function Marker({ k, name, pos, onJump }) {
  const d = useTransform(pos, (p) => offset(k, p));
  const x = useTransform(d, (v) => CX + RX * Math.cos(phiOf(v)));
  const y = useTransform(d, (v) => CY + RY * Math.sin(phiOf(v)));
  const opacity = useTransform(d, fadeOf);
  const near = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 1));
  const dotScale = useTransform(near, (n) => 0.7 + n * 0.9);

  return (
    <motion.button
      type="button"
      onClick={() => onJump(k)}
      aria-label={`Show ${name}`}
      className="absolute left-0 top-0 h-0 w-0"
      style={{ x, y, opacity }}
    >
      <span className="absolute -left-4 -top-4 h-8 w-8" />
      <motion.span className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-current" style={{ scale: dotScale }} />
    </motion.button>
  );
}

function Tick({ k, off, pos }) {
  const d = useTransform(pos, (p) => offset(k + off, p));
  const x = useTransform(d, (v) => CX + RX * Math.cos(phiOf(v)));
  const y = useTransform(d, (v) => CY + RY * Math.sin(phiOf(v)));
  const rotate = useTransform(d, (v) => phiOf(v) * 57.2958);
  const opacity = useTransform(d, (v) => fadeOf(v) * 0.45);
  return <motion.span className="absolute left-0 top-0 h-px w-[6px] origin-left bg-current" style={{ x, y, rotate, opacity }} />;
}

export default function ArcDial({ pos, progress, onJump, scrub }) {
  return (
    <div
      data-dial
      className="absolute right-0 top-1/2 z-30 origin-right -translate-y-1/2 scale-[0.72] md:scale-100"
      style={{ width: W, height: H }}
    >
      <motion.div
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        style={{ scaleX: -1 }}
        onPanStart={() => scrub.start()}
        onPan={(_, i) => scrub.move(-i.offset.y / 90)}
        onPanEnd={(_, i) => scrub.end(-i.velocity.y / 90)}
      >
        {/* the D */}
        <svg width={W} height={H} className="pointer-events-none absolute inset-0 overflow-visible" fill="none" stroke="currentColor">
          <path d={`M${CX} ${CY - RY} A${RX} ${RY} 0 0 1 ${CX} ${CY + RY} Z`} strokeOpacity=".28" />
        </svg>

        {heroSlides.map((s, k) =>
          [0.25, 0.5, 0.75].map((o) => <Tick key={`${k}-${o}`} k={k} off={o} pos={pos} />)
        )}

        {/* fixed reticle at the apex, fills with the autoplay timer */}
        <svg
          width="32" height="32" viewBox="-16 -16 32 32"
          className="pointer-events-none absolute"
          style={{ left: CX + RX - 16, top: CY - 16 }}
          fill="none" stroke="currentColor"
        >
          <circle r="12" strokeOpacity=".25" />
          <g transform="rotate(-90)">
            <motion.circle r="12" strokeWidth="1.5" style={{ pathLength: progress }} />
          </g>
        </svg>

        {heroSlides.map((s, k) => (
          <Marker key={s.id} k={k} name={s.name} pos={pos} onJump={onJump} />
        ))}
      </motion.div>

    </div>
  );
}