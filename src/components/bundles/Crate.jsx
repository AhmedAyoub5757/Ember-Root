import { motion } from "framer-motion";
import { bottleFor } from "../../lib/assets";

const spring = { type: "spring", stiffness: 420, damping: 26 };

export default function Crate({ picks, onRemove, reduce }) {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="relative aspect-[1.45] overflow-hidden rounded-[0.4rem] border-[10px] border-clay bg-[#C9895A] p-3 shadow-[0_24px_0_-12px_#8d543d,0_30px_45px_-25px_rgba(31,26,20,.7)] sm:p-5">
        <div className="absolute inset-x-0 top-0 h-4 bg-[#D8A16A] opacity-80" />
        <div className="grid h-full grid-cols-3 gap-3 sm:gap-5">
          {Array.from({ length: 3 }).map((_, index) => {
            const id = picks[index];
            const filled = Boolean(id);
            return (
              <button
                key={index}
                type="button"
                onClick={() => filled && onRemove(id)}
                aria-label={filled ? `Remove ${id}` : `Empty slot ${index + 1}`}
                className={`relative mt-4 overflow-hidden rounded-sm border-2 text-left ${
                  filled ? "border-soil/30 bg-soil/10" : "border-dashed border-soil/35 bg-[#E4B477]/30"
                }`}
              >
                <span className="label absolute left-2 top-2 z-10 opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {filled ? (
                  <motion.span
                    initial={{ y: reduce ? 0 : "-100%", opacity: reduce ? 1 : 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : spring}
                    className="absolute inset-0 block"
                    style={{ background: id.color }}
                  >
                    <img
                      src={bottleFor(id.id)}
                      alt={id.name}
                      className="absolute inset-x-0 bottom-0 mx-auto h-[88%] w-auto max-w-none object-contain"
                    />
                  </motion.span>
                ) : (
                  <span className="display-s absolute inset-0 flex items-center justify-center text-center text-lg opacity-40">
                    empty
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-[#B5694A] px-3 py-2 text-paper shadow-[0_-4px_0_rgba(31,26,20,.12)] sm:px-5 sm:py-3">
          <p className="label truncate">
            {Array.from({ length: 3 }).map((_, index) => {
              const pick = picks[index];
              return `Slot ${String(index + 1).padStart(2, "0")}: ${pick ? pick.name : "empty"}`;
            }).join(" · ")}
          </p>
        </div>
      </div>
      <p className="label mt-4 text-center opacity-60">Three places. Your order.</p>
    </div>
  );
}
