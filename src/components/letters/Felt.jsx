import { motion } from "framer-motion";

const ease = [0.2, 0.7, 0.2, 1];

export default function Felt({ value, color }) {
  return (
    <div className="mt-5">
      <div className="label flex justify-between opacity-60">
        <span>Milder</span>
        <span>Hotter</span>
      </div>

      <div className="relative mt-1.5 h-4">
        <span className="absolute inset-x-0 top-1/2 h-px bg-current opacity-40" />
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="absolute top-1/2 w-px -translate-y-1/2 bg-current opacity-50"
            style={{ left: `${i * 12.5}%`, height: i % 4 === 0 ? 12 : 6 }}
          />
        ))}
        <motion.span
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-soil"
          style={{ background: color }}
          initial={{ left: "50%" }}
          whileInView={{ left: `${(value / 4) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.5, ease }}
        />
      </div>

      <p className="label mt-1.5 opacity-60">Felt, by the sender</p>
    </div>
  );
}