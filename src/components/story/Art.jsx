import { motion } from "framer-motion";

const ease = [0.2, 0.7, 0.2, 1];
const root = { hidden: {}, show: { transition: { staggerChildren: 0.16 } } };
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease } },
};

const P = ({ d }) => <motion.path d={d} variants={draw} />;
const C = ({ cx, cy, r }) => <motion.circle cx={cx} cy={cy} r={r} variants={draw} />;

const Frame = ({ className, children }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="0.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    variants={root}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-20%" }}
    aria-hidden
  >
    {children}
  </motion.svg>
);

const Seed = (p) => (
  <Frame {...p}>
    <P d="M8 76 H92" />
    <P d="M50 76 C48 82 44 86 40 90" />
    <P d="M50 76 C53 83 58 86 62 91" />
    <P d="M50 76 C50 60 49 50 50 38" />
    <P d="M50 50 C40 50 31 44 29 34 C40 33 49 39 50 50Z" />
    <P d="M50 42 C59 42 68 36 71 26 C60 25 51 31 50 42Z" />
  </Frame>
);

const Sun = (p) => (
  <Frame {...p}>
    <C cx={50} cy={50} r={15} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      const pt = (r) => `${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
      return <P key={i} d={`M${pt(23)} L${pt(i % 2 ? 31 : 38)}`} />;
    })}
  </Frame>
);

const Fire = (p) => (
  <Frame {...p}>
    <P d="M50 4 C58 28 82 40 80 64 C78 84 62 96 50 96 C36 96 20 84 20 64 C20 50 30 44 34 34 C40 42 44 44 46 44 C44 30 46 16 50 4Z" />
    <P d="M50 54 C56 64 66 68 64 80 C62 90 56 92 50 92 C44 92 38 90 38 80 C38 72 46 68 50 54Z" />
    <P d="M82 22 L87 15" />
    <P d="M16 34 L9 30" />
  </Frame>
);

const Time = (p) => (
  <Frame {...p}>
    <P d="M34 12 H66 V22 H34Z" />
    <P d="M30 22 H70 C74 30 76 36 76 44 V84 C76 90 72 94 66 94 H34 C28 94 24 90 24 84 V44 C24 36 26 30 30 22Z" />
    <P d="M24 52 C36 48 44 56 56 52 C64 49 70 52 76 52" />
    <C cx={42} cy={72} r={3.5} />
    <C cx={58} cy={64} r={2.5} />
    <C cx={52} cy={80} r={2} />
  </Frame>
);

const Glass = (p) => (
  <Frame {...p}>
    <P d="M42 6 H58 V17 H42Z" />
    <P d="M44 17 V30 C44 37 30 40 30 52 V88 C30 92 33 94 36 94 H64 C67 94 70 92 70 88 V52 C70 40 56 37 56 30 V17" />
    <P d="M34 56 H66 V82 H34Z" />
    <P d="M40 66 H60" />
    <P d="M43 73 H57" />
  </Frame>
);

const arts = { seed: Seed, sun: Sun, fire: Fire, time: Time, glass: Glass };

export default function Art({ name, className }) {
  const A = arts[name];
  return <A className={className} />;
}