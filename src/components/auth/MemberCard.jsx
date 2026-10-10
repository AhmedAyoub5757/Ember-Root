import { motion } from "framer-motion";
import paper from "../../assets/images/paper.jpg";

const barcode =
  "repeating-linear-gradient(90deg, #1F1A14 0 2px, transparent 2px 4px, #1F1A14 4px 5px, transparent 5px 9px, #1F1A14 9px 12px, transparent 12px 14px)";
const since = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date());

export default function MemberCard({ name = "", memberNo, stamped = false, onDark = false, className = "" }) {
  const shown = name.trim();

  return (
    <div
      className={`relative aspect-[1.6/1] rotate-0 transition-transform duration-300 sm:-rotate-3 text-soil ${className}`}
      style={{
        backgroundColor: onDark ? "#F2EBDD" : "#E6DCC6",
        backgroundImage: `url(${paper})`,
        backgroundBlendMode: "multiply",
        backgroundSize: "420px",
      }}
    >
      <span
        aria-hidden
        className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full ${onDark ? "bg-soil" : "bg-paper"}`}
      />
      <div className="pointer-events-none absolute inset-2 border border-soil/25" />

      <div className="absolute inset-x-4 top-5 flex justify-between sm:inset-x-5 sm:top-8">
        <span className="label text-[0.7rem] sm:text-xs">Ember &amp; Root</span>
        <span className="label text-[0.7rem] opacity-60 sm:text-xs">Grower's card</span>
      </div>

      <div className="absolute inset-x-4 top-[38%] sm:inset-x-5 sm:top-[40%]">
        <p className="label text-[0.7rem] opacity-60 sm:text-xs">Member</p>
        <p className="display-s mt-1 truncate text-[clamp(1.2rem,4vw,2.1rem)] italic">
          {shown || <span className="opacity-35">Your name</span>}
        </p>
      </div>

      <div className="absolute inset-x-4 bottom-6 flex justify-between sm:inset-x-5 sm:bottom-8">
        <span className="label text-[0.7rem] sm:text-xs">No. {memberNo ? String(memberNo).padStart(4, "0") : "····"}</span>
        <span className="label text-[0.7rem] opacity-60 sm:text-xs">Since {since}</span>
      </div>
      <div className="absolute inset-x-4 bottom-2.5 h-2.5 sm:inset-x-5 sm:bottom-3 sm:h-3" style={{ backgroundImage: barcode }} aria-hidden />

      {stamped && (
        <motion.span
          initial={{ scale: 2.6, opacity: 0, rotate: -14 }}
          animate={{ scale: 1, opacity: 1, rotate: 9 }}
          transition={{ type: "spring", stiffness: 520, damping: 17, delay: 0.1 }}
          className="label absolute right-4 top-[34%] border-[3px] border-chili px-3 py-1.5 text-base text-chili mix-blend-multiply"
        >
          Member
        </motion.span>
      )}
    </div>
  );
}