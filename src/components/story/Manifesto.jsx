import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const text =
  "Peppers don't care about deadlines. They ripen when the sun says so and mellow when time allows. We learned to wait, because the wait is the recipe.";
const em = ["wait", "recipe"];

function Word({ w, i, n, progress }) {
  const start = (i / n) * 0.8;
  const opacity = useTransform(progress, [start, start + 0.2], [0.12, 1]);
  const italic = em.includes(w.replace(/[.,]/g, ""));
  return (
    <motion.span style={{ opacity }} className={`inline-block pr-[0.26em] ${italic ? "italic" : ""}`}>
      {w}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <div ref={ref} className="px-5 pb-28 pt-24 lg:px-8 lg:pb-44 lg:pt-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-8 gap-y-8">
        <p className="label col-span-12 opacity-60 lg:col-span-3">03 / The long way round</p>
        <p className="display-s col-span-12 text-[clamp(2.2rem,5.4vw,5rem)] lg:col-span-9">
          {words.map((w, i) => (
            <Word key={i} w={w} i={i} n={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </div>
  );
}