import { motion } from "framer-motion";
import paper from "../../assets/images/paper.jpg";

const barcode =
  "repeating-linear-gradient(90deg, #1F1A14 0 2px, transparent 2px 4px, #1F1A14 4px 5px, transparent 5px 9px, #1F1A14 9px 12px, transparent 12px 14px)";
const since = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date());

export default function MemberCard({ name = "", memberNo, stamped = false, onDark = false, className = "" }) {
  const shown = name.trim();

  return (
    <div
      className={`relative aspect-[1.6/1] -rotate-3 text-soil ${className}`}
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

      <div className="absolute inset-x-5 top-8 flex justify-between">
        <span className="label">Ember &amp; Root</span>
        <span className="label opacity-60">Grower's card</span>
      </div>

      <div className="absolute inset-x-5 top-[40%]">
        <p className="label opacity-60">Member</p>
        <p className="display-s mt-1 truncate text-[clamp(1.35rem,2.6vw,2.1rem)] italic">
          {shown || <span className="opacity-35">Your name</span>}
        </p>
      </div>

      <div className="absolute inset-x-5 bottom-8 flex justify-between">
        <span className="label">No. {memberNo ? String(memberNo).padStart(4, "0") : "····"}</span>
        <span className="label opacity-60">Since {since}</span>
      </div>
      <div className="absolute inset-x-5 bottom-3 h-3" style={{ backgroundImage: barcode }} aria-hidden />

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