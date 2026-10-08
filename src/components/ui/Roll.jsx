import { AnimatePresence, motion } from "framer-motion";

export default function Roll({ value, className = "", height = "1.25em" }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ height }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className={`block whitespace-nowrap tabular-nums ${className}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}