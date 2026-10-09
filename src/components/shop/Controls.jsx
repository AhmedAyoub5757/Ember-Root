import { heatLevels } from "../../data/shop";

export function HeatFilter({ active, counts, toggle, clear }) {
  return (
    <div role="group" aria-label="Filter by heat">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label opacity-60">Heat</p>
        {active.length > 0 && (
          <button type="button" onClick={clear} className="label border-b border-current pb-0.5">
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-5">
        {heatLevels.map(({ n, word }) => {
          const on = active.includes(n);
          const none = counts[n] === 0;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              aria-label={`${word}, heat ${n} of 5, ${counts[n]} varieties`}
              disabled={none}
              onClick={() => toggle(n)}
              className={`relative -ml-px border px-2 pb-3 pt-3 text-left transition-colors duration-200 first:ml-0 sm:px-3 ${
                on ? "z-10 border-soil bg-soil text-paper" : "border-soil/30 hover:bg-soil/5"
              } disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent`}
            >
              <span className="flex items-end gap-[3px]" aria-hidden>
                {Array.from({ length: 5 }, (_, k) => (
                  <span
                    key={k}
                    className="w-[2px] bg-current"
                    style={{ height: 8 + k * 3, opacity: k < n ? 1 : 0.25 }}
                  />
                ))}
              </span>
              <span className="label mt-3 flex justify-between gap-1">
                <span>
                  <span aria-hidden>{String(n).padStart(2, "0")}</span>
                  <span className="hidden sm:inline"> {word}</span>
                </span>
                <span className="opacity-60" aria-hidden>{counts[n]}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Segmented({ label, value, options, onChange }) {
  return (
    <div role="group" aria-label={label}>
      <p className="label opacity-60">{label}</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.id)}
              className={`label border-b-2 pb-1 transition-opacity duration-200 ${
                on ? "border-current" : "border-transparent opacity-55 hover:opacity-100"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}