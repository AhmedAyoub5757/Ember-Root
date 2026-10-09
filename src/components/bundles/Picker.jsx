import { fmt, unitPrice } from "../../lib/money";
import HeatRuler from "../ui/HeatRuler";

export default function Picker({ flavors, size, picks, onToggle }) {
  const full = picks.length >= 3;
  return (
    <div>
      <div className="label hidden grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_6rem_5rem] gap-x-4 px-3 pb-3 opacity-60 sm:grid">
        <span>No.</span><span>Variety</span><span>Heat</span><span className="text-right">Price</span><span />
      </div>
      <div className="hair-b">
        {flavors.map((flavor) => {
          const slot = picks.findIndex((pick) => pick.id === flavor.id);
          const chosen = slot >= 0;
          const disabled = full && !chosen;
          return (
            <button
              key={flavor.id}
              type="button"
              aria-pressed={chosen}
              disabled={disabled}
              onClick={() => onToggle(flavor)}
              className={`hair grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-4 text-left transition-colors sm:grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_6rem_5rem] sm:gap-x-4 ${
                chosen ? "bg-turmeric/10" : "hover:bg-soil/5"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span className="label">{flavor.no}</span>
              <span>
                <span className="display-s block text-xl">{flavor.name}</span>
                <span className="label mt-1 block opacity-60 sm:hidden">{flavor.heat}/5 heat · {fmt(unitPrice(flavor, size.id))}</span>
              </span>
              <span className="hidden sm:block"><HeatRuler level={flavor.heat} color={flavor.color} /></span>
              <span className="display-s hidden text-right text-lg tabular-nums sm:block">{fmt(unitPrice(flavor, size.id))}</span>
              <span className="label justify-self-end text-right">
                {chosen ? `✓ Slot ${String(slot + 1).padStart(2, "0")}` : disabled ? "Full" : "+"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
