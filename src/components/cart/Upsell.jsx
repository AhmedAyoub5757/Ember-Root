import { flavors } from "../../data/products";
import { sizes } from "../../data/productExtra";
import { fmt, unitPrice } from "../../lib/money";
import { useCart } from "../../store/cart";

const taster = sizes.find((s) => s.id === "60");

export default function Upsell({ items }) {
  const add = useCart((s) => s.add);
  const pick = flavors.find((f) => !items.some((i) => i.kind !== "bundle" && i.id === f.id));
  if (!pick) return null;

  return (
    <div className="mt-8">
      <p className="label opacity-60">Not yet in your order</p>
      <div className="hair hair-b mt-3 flex items-center gap-4 py-4">
        <span className="h-10 w-10 shrink-0" style={{ background: pick.color }} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="display-s truncate text-lg leading-tight">{pick.name}</p>
          <p className="label mt-0.5 opacity-60">
            {taster.ml} ml taster · {fmt(unitPrice(pick, "60"))}
          </p>
        </div>
        <button
          type="button"
          onClick={() => add(pick.id, 1, "60")}
          className="label shrink-0 border border-current px-3 py-2 transition-colors hover:bg-soil hover:text-paper"
        >
          Add +
        </button>
      </div>
    </div>
  );
}