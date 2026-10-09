import { fmt, resolveItem } from "../../lib/money";
import paper from "../../assets/images/paper.jpg";

export default function GiftTag({ definition, open, onChoose, children }) {
  const line = resolveItem({ kind: "bundle", id: definition.id, qty: 1 });
  const parts = line.parts;

  return (
    <article className={`gift-tag relative pt-7 ${open ? "gift-tag-open" : ""}`}>
      <span className="absolute left-1/2 top-0 z-10 h-7 w-px bg-soil/50" aria-hidden />
      <span className="absolute left-1/2 top-5 z-20 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-soil/50 bg-paper" aria-hidden />
      <div
        className="relative min-h-[320px] border border-soil/20 p-5 shadow-[0_18px_30px_-25px_rgba(31,26,20,.8)]"
        style={{
          backgroundColor: "#E6DCC6",
          backgroundImage: `url(${paper})`,
          backgroundBlendMode: "multiply",
          transform: `rotate(${definition.id === "starter" ? "-1.2deg" : definition.id === "ladder" ? "1.5deg" : "-0.5deg"})`,
        }}
      >
        <p className="label opacity-60">Gift set</p>
        <h2 className="display-s mt-3 text-3xl">{definition.name}</h2>
        <p className="mt-3 min-h-[3.2em] text-sm leading-relaxed opacity-75">{definition.blurb}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {parts.map((part) => (
            <span key={part.id} className="flex items-center gap-1.5 text-xs" title={part.name}>
              <span className="h-3 w-3 rounded-full" style={{ background: part.color }} aria-hidden />
              <span>{part.name}</span>
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="label opacity-60">150 ml each</p>
            <p className="label mt-2 line-through opacity-50">{fmt(line.full)}</p>
            <p className="display-s text-3xl">{fmt(line.unit)}</p>
          </div>
          <button
            type="button"
            aria-expanded={open}
            onClick={onChoose}
            className="label bg-soil px-4 py-3 text-paper transition-transform hover:-translate-y-0.5"
          >
            {open ? "Close" : "Choose"}
          </button>
        </div>
      </div>
      {children}
    </article>
  );
}
