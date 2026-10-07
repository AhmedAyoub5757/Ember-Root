import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../../store/cart";
import HeatRuler from "../ui/HeatRuler";

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

export default function Caption({ slide, bg, ink }) {
  const [added, setAdded] = useState(false);

  const add = () => {
    useCart.getState().add(slide.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="absolute bottom-6 left-5 z-30 w-[min(64vw,380px)] lg:bottom-9 lg:left-8">
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial="hidden" animate="show" exit="exit">
          <Line i={0}><span className="label opacity-70">No. {slide.no} / {slide.latin}</span></Line>
          <Line i={1} className="mt-2"><h2 className="display text-3xl lg:text-5xl">{slide.name}</h2></Line>
          <Line i={2} className="mt-2"><p className="max-w-[34ch] text-[0.95rem] leading-relaxed opacity-85">{slide.line}</p></Line>

          <Line i={3} className="mt-4">
            <span className="label mb-2 block opacity-70">Heat {slide.heat} / 5 · {slide.scoville} SHU</span>
            <HeatRuler level={slide.heat} color="currentColor" />
          </Line>

          <Line i={4} className="mt-5">
            <span className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <motion.button
                onClick={add}
                style={{ backgroundColor: ink, color: bg }}
                className="label inline-flex items-center gap-3 px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                {added ? "Added ✓" : <>Add to cart <span aria-hidden>→</span></>}
              </motion.button>
              <Link to={`/flavor/${slide.id}`} className="label border-b border-current pb-1">Details</Link>
              <span className="label opacity-70">Rs {slide.price.toLocaleString()}</span>
            </span>
          </Line>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}