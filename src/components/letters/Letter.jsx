import { motion } from "framer-motion";
import { inkFor } from "../../lib/color";
import Postmark from "./Postmark";
import Felt from "./Felt";

const ease = [0.2, 0.7, 0.2, 1];
const CREAM = "#FBF6EA";

const airmail =
  "repeating-linear-gradient(135deg, #B8321F 0 10px, #FBF6EA 10px 20px, #1F1A14 20px 30px, #FBF6EA 30px 40px)";

const ruled =
  "repeating-linear-gradient(to bottom, transparent 0 27px, rgba(184,50,31,0.16) 27px 28px)";

const barcode =
  "repeating-linear-gradient(90deg, #1F1A14 0 2px, transparent 2px 4px, #1F1A14 4px 5px, transparent 5px 9px, #1F1A14 9px 12px, transparent 12px 14px)";

// torn bottom edge for the order slip
const TEETH = 22;
const zigzag = `polygon(0 0, 100% 0, ${Array.from({ length: TEETH * 2 + 1 }, (_, i) =>
  `${(100 - (i * 100) / (TEETH * 2)).toFixed(2)}% ${i % 2 ? "calc(100% - 9px)" : "100%"}`
).join(", ")})`;

function Stamp({ f }) {
  return (
    <div
      className="relative h-[68px] w-14 shrink-0 ring-1 ring-soil/40 ring-offset-[3px] ring-offset-[#FBF6EA]"
      style={{ background: f.color, color: inkFor(f.color) }}
    >
      <div className="absolute inset-1 border border-current opacity-60" />
      <span className="label absolute left-1.5 top-1.5">{f.no}</span>
      <span className="label absolute bottom-1.5 right-1.5 text-[0.55rem]">E&amp;R</span>
    </div>
  );
}

function Rule() {
  return <div className="my-3 border-t border-dashed border-soil/40" />;
}

/* ---------- the four kinds of letter ---------- */

function Postcard({ l, f }) {
  return (
    <div className="p-[7px]" style={{ backgroundImage: airmail }}>
      <div className="relative px-5 pb-5 pt-5" style={{ background: CREAM }}>
        <div className="flex items-start justify-between gap-4">
          <p className="label opacity-60">
            Post card
            <br />
            Par avion
          </p>
          <div className="relative">
            <Stamp f={f} />
            <Postmark
              id={l.id}
              city={l.city}
              date={l.date}
              className="absolute -left-12 -top-1 h-[88px] w-[88px] -rotate-12 text-soil/70 mix-blend-multiply"
            />
          </div>
        </div>

        <p className="display-s mt-6 text-[1.3rem] italic">“{l.text}”</p>

        <div className="mt-6">
          <p className="display-s text-lg">— {l.from}</p>
          <p className="label mt-1 opacity-60">
            {l.city} · re: {f.name}
          </p>
        </div>

        <Felt value={l.felt} color={f.color} />
      </div>
    </div>
  );
}

function Note({ l, f }) {
  const row = { lineHeight: "28px" };
  return (
    <div className="relative" style={{ background: CREAM }}>
      <div className="relative pl-12 pr-5 pt-[28px]" style={{ backgroundImage: ruled }}>
        <span className="absolute inset-y-0 left-9 w-px bg-chili/45" />
        <span className="absolute left-3 top-[44px] h-3 w-3 rounded-full bg-paper-dark ring-1 ring-soil/10" />
        <span className="absolute left-3 top-[176px] h-3 w-3 rounded-full bg-paper-dark ring-1 ring-soil/10" />

        <p className="display-s text-lg italic" style={row}>Dear Ember &amp; Root,</p>
        <span className="label absolute right-5 top-[28px]" style={row}>{l.date}</span>

        <p className="display-s text-[1.18rem] italic" style={row}>{l.text}</p>
        <p className="display-s text-lg" style={row}>— {l.from}, {l.city}</p>
        <div className="h-[28px]" />
      </div>

      <div className="pb-5 pl-12 pr-5" style={{ background: CREAM }}>
        <p className="label opacity-60">re: {f.name}</p>
        <Felt value={l.felt} color={f.color} />
      </div>
    </div>
  );
}

function Slip({ l, f }) {
  return (
    <div
      className="px-5 pb-9 pt-5 font-mono text-[12px] leading-[1.6]"
      style={{ background: "#F4F0E4", clipPath: zigzag }}
    >
      <p className="label text-center">Ember &amp; Root</p>
      <p className="label text-center opacity-60">Order slip · No. {l.order}</p>
      <Rule />

      <div className="flex justify-between gap-3">
        <span>1 × {f.name}</span>
        <span>Rs {f.price.toLocaleString()}</span>
      </div>
      <div className="flex justify-between gap-3 opacity-60">
        <span>150 ml · Batch 07</span>
        <span>{l.date}</span>
      </div>
      <Rule />

      <p className="label opacity-60">Customer comment</p>
      <p className="mt-2 text-[13px]">“{l.text}”</p>
      <Rule />

      <div className="flex justify-between gap-3">
        <span>Signed {l.from}</span>
        <span>{l.city}</span>
      </div>

      <Felt value={l.felt} color={f.color} />

      <div className="mt-5 h-9" style={{ backgroundImage: barcode }} />
      <p className="label mt-1 text-center opacity-60">{l.order} · thank you</p>
    </div>
  );
}

function Wire({ l, f }) {
  return (
    <div style={{ background: "#EFE3B2" }}>
      <div className="flex items-center justify-between bg-soil px-4 py-2 text-paper">
        <span className="label">Telegram</span>
        <span className="label opacity-70">Rec’d {l.date}</span>
      </div>

      <div className="px-4 pb-5 pt-4">
        <p className="label opacity-60">To: Ember &amp; Root · From: {l.city}</p>

        <div className="mt-4 flex flex-col items-start gap-2">
          {l.wire.map((s, i) => (
            <p
              key={s}
              className="bg-[#FBF3CE] px-2 py-1 font-mono text-[13px] uppercase tracking-[0.12em]"
              style={{ transform: `rotate(${i % 2 ? 0.6 : -0.5}deg)` }}
            >
              {s}
            </p>
          ))}
        </div>

        <p className="display-s mt-5 text-lg">— {l.from}</p>
        <p className="label mt-1 opacity-60">re: {f.name}</p>

        <Felt value={l.felt} color={f.color} />
      </div>
    </div>
  );
}

const bodies = { postcard: Postcard, note: Note, slip: Slip, wire: Wire };

/* ---------- the draggable wrapper ---------- */

export default function Letter({ l, f, dim, drag, constraints, z, onFront, className = "" }) {
  const Body = bodies[l.kind];

  return (
    <motion.div
      className={`relative ${l.pos} ${className}`}
      style={{ zIndex: z }}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: l.delay, ease }}
    >
      <motion.article
        aria-label={`Letter from ${l.from}, ${l.city}`}
        drag={drag}
        dragConstraints={constraints}
        dragMomentum={false}
        dragElastic={0.06}
        onPointerDown={onFront}
        animate={{ opacity: dim ? 0.2 : 1, scale: dim ? 0.97 : 1 }}
        whileHover={drag ? { scale: 1.015 } : undefined}
        whileDrag={{ scale: 1.04, rotate: l.rot * 0.3 }}
        transition={{ duration: 0.4 }}
        style={{ rotate: l.rot }}
        className={`text-soil drop-shadow-[0_18px_16px_rgba(31,26,20,0.25)] ${
          drag ? "cursor-grab select-none active:cursor-grabbing" : ""
        }`}
      >
        <Body l={l} f={f} />
      </motion.article>
    </motion.div>
  );
}