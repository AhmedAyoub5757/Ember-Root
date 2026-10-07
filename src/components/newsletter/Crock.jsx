import { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

const ease = [0.2, 0.7, 0.2, 1];
const TOP = 40, BOTTOM = 216, H = BOTTOM - TOP;
const BODY =
  "M58 34 C40 54 26 86 26 128 C26 176 40 206 52 216 H148 C160 206 174 176 174 128 C174 86 160 54 142 34 Z";
// 8 half-waves, period 100, seamless when translated by -100
const WAVE = "M-100 0 q25 -7 50 0 " + "t50 0 ".repeat(7) + "V300 H-100Z";

const bubbles = [
  { x: 70, r: 3, d: 0, s: 5.5 }, { x: 94, r: 2, d: 1.6, s: 4.6 },
  { x: 120, r: 3.4, d: 2.8, s: 6.2 }, { x: 82, r: 1.8, d: 3.6, s: 4.2 },
  { x: 138, r: 2.4, d: 0.9, s: 5.2 }, { x: 106, r: 2.8, d: 4.4, s: 6.6 },
  { x: 62, r: 2.2, d: 2.2, s: 5.8 }, { x: 128, r: 1.8, d: 5.1, s: 4.8 },
];

const puffs = [[-18, 3], [-8, 4.5], [2, 3.5], [12, 5], [22, 3]];

export default function Crock({ progress, day, total, batchNo }) {
  const level = BOTTOM - progress * H;   // y of the brine surface
  const depth = BOTTOM - level;
  const rock = useAnimationControls();
  const lid = useAnimationControls();
  const [burst, setBurst] = useState(0);

  const burp = () => {
    setBurst((b) => b + 1);
    rock.start({ rotate: [0, -2.2, 1.8, -1, 0], transition: { duration: 0.6 } });
    lid.start({ y: [0, -7, 0], transition: { duration: 0.45 } });
  };

  // liquid, ruler marker and day label all ride the same animation
  const rise = {
    initial: { y: BOTTOM + 14 },
    whileInView: { y: level },
    viewport: { once: true, margin: "-20%" },
    transition: { duration: 2.4, ease },
  };

  const ticks = [];
  for (let d = 0; d <= total; d += 5) ticks.push(d);
  const yOf = (d) => BOTTOM - (d / total) * H;

  return (
    <figure>
      <button
        type="button"
        onClick={burp}
        aria-label="Burp the crock"
        className="block w-full cursor-pointer"
      >
        <svg
          viewBox="0 0 300 240"
          className="w-full overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          aria-hidden
        >
          <defs>
            <clipPath id="crock-clip"><path d={BODY} /></clipPath>
          </defs>

          <motion.g animate={rock} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
            <path d={BODY} fill="rgba(0,0,0,0.14)" />

            {/* brine */}
            <g clipPath="url(#crock-clip)">
              <motion.g {...rise}>
                <g className="wave">
                  <path d={WAVE} fill="#1F1A14" stroke="none" />
                </g>
                {bubbles.map((b, i) => (
                  <circle
                    key={i}
                    className="bubble"
                    cx={b.x}
                    cy={depth - 8}
                    r={b.r}
                    fill="#F2EBDD"
                    stroke="none"
                    style={{
                      "--rise": `${-(depth - 14)}px`,
                      "--s": `${b.s}s`,
                      "--d": `${b.d}s`,
                    }}
                  />
                ))}
              </motion.g>
            </g>

            {/* glaze highlight + bands */}
            <path d="M44 106 C44 136 50 166 58 188" strokeOpacity=".35" />
            <path d="M32 92 C80 104 120 104 168 92" strokeOpacity=".3" />

            {/* lid */}
            <motion.g animate={lid}>
              <rect x="50" y="18" width="100" height="16" rx="3" fill="rgba(0,0,0,0.14)" />
              <path d="M92 18 V9 H108 V18" />
            </motion.g>
          </motion.g>

          {/* steam puffs when you burp it */}
          {burst > 0 &&
            puffs.map(([dx, r], i) => (
              <motion.circle
                key={`${burst}-${i}`}
                cx={100 + dx}
                cy={8}
                r={r}
                initial={{ opacity: 0.9, y: 0, x: 0, scale: 0.6 }}
                animate={{ opacity: 0, y: -34 - i * 6, x: dx * 0.7, scale: 1.6 }}
                transition={{ duration: 1.1 + i * 0.1, ease: "easeOut" }}
              />
            ))}

          {/* ruler: days in the crock */}
          <line x1="212" x2="212" y1={TOP} y2={BOTTOM} strokeOpacity=".5" />
          {ticks.map((d) => {
            const major = d % 30 === 0;
            const mid = d % 15 === 0;
            return (
              <g key={d}>
                <line
                  x1="212"
                  x2={212 + (major ? 14 : mid ? 10 : 6)}
                  y1={yOf(d)}
                  y2={yOf(d)}
                  strokeOpacity={major ? 1 : 0.55}
                />
                {major && (
                  <text
                    x="230"
                    y={yOf(d) + 2.5}
                    fontSize="7"
                    fill="currentColor"
                    stroke="none"
                    fontFamily="var(--font-mono)"
                  >
                    {d}
                  </text>
                )}
              </g>
            );
          })}

          {/* today marker, riding the surface */}
          <motion.g {...rise}>
            <line x1="178" x2="206" y1="0" y2="0" strokeDasharray="2 3" strokeOpacity=".7" />
            <path d="M206 -4 L212 0 L206 4 Z" fill="currentColor" stroke="none" />
            <text
              x="242"
              y="2.5"
              fontSize="7"
              fill="currentColor"
              stroke="none"
              fontFamily="var(--font-mono)"
              letterSpacing=".08em"
            >
              DAY {day}
            </text>
          </motion.g>
        </svg>
      </button>

      <figcaption className="label mt-4 flex justify-between gap-6 opacity-70">
        <span>Fig. 5 — Crock No. {batchNo}, sealed</span>
        <span>Day {day} / {total}</span>
      </figcaption>
      <p className="label mt-1 opacity-50">Tap the crock to burp it</p>
    </figure>
  );
}