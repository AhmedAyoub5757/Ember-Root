import { fmt, resolveItem } from "../../lib/money";
import Roll from "../ui/Roll";

export default function PriceBlock({ size, picks, added, onAdd }) {
  const draft = picks.length === 3
    ? resolveItem({ kind: "bundle", id: "trio", size, picks: picks.map((pick) => pick.id), message: "", qty: 1 })
    : null;
  const missing = 3 - picks.length;

  return (
    <div className="hair hair-b mt-8 pt-6">
      {draft ? (
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="label opacity-60">Your trio</p>
            <p className="label mt-2 line-through opacity-50">{fmt(draft.full)}</p>
            <p className="display mt-1 text-5xl"><Roll value={fmt(draft.unit)} /></p>
            <p className="label mt-2 text-leaf">You save {fmt(draft.full - draft.unit)}</p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="label flex h-14 items-center gap-4 bg-soil px-5 text-paper transition-transform hover:-translate-y-0.5"
          >
            {added ? "Added ✓" : "Add box"} <span aria-hidden>→</span>
          </button>
        </div>
      ) : (
        <button type="button" disabled className="label flex h-14 w-full items-center justify-between border border-soil/30 px-5 opacity-60">
          <span>Choose {missing} more</span><span aria-hidden>→</span>
        </button>
      )}
    </div>
  );
}
