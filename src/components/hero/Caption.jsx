import { AnimatePresence, motion } from "framer-motion";

const ease = [0.2, 0.7, 0.2, 1];
const mask = {
  hidden: { y: "110%" },
  show: (i) => ({ y: 0, transition: { delay: 0.3 + i * 0.07, duration: 0.6, ease } }),
  exit: { y: "-110%", transition: { duration: 0.25 } },
};

function Line({ i, className = "", children }) {
  return (
    <span className={`block overflow-hidden pb-1 ${className}`}>
      <motion.span custom={i} variants={mask} className="block">
        {children}
      </motion.span>
    </span>
  );
}

export default function Caption({ slide }) {
  return (
    <div className="absolute bottom-6 left-5 z-30 w-[min(64vw,380px)] lg:bottom-9 lg:left-8">
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial="hidden" animate="show" exit="exit">
          <Line i={0}><h2 className="display text-3xl lg:text-5xl">{slide.name}</h2></Line>
          <Line i={1} className="mt-2"><p className="max-w-[34ch] text-[0.95rem] leading-relaxed opacity-85">{slide.line}</p></Line>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}