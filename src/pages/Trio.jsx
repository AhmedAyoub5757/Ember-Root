import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { flavors } from "../data/products";
import { sizes } from "../data/productExtra";
import { resolveItem } from "../lib/money";
import { useCart } from "../store/cart";
import Crate from "../components/bundles/Crate";
import HeatRange from "../components/bundles/HeatRange";
import Picker from "../components/bundles/Picker";
import PriceBlock from "../components/bundles/PriceBlock";

const allowedSizes = new Set(["60", "150"]);

function parsePicks(raw) {
  const ids = [...new Set((raw || "").split(",").filter(Boolean))];
  return ids.length <= 3 && ids.every((id) => flavors.some((flavor) => flavor.id === id))
    ? ids.map((id) => flavors.find((flavor) => flavor.id === id))
    : [];
}

export default function Trio() {
  const [params, setParams] = useSearchParams();
  const reduce = useReducedMotion();
  const timer = useRef(null);
  const [added, setAdded] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const sizeId = allowedSizes.has(params.get("size")) ? params.get("size") : "150";
  const picks = useMemo(() => parsePicks(params.get("picks")), [params]);
  const size = sizes.find((option) => option.id === sizeId);

  useEffect(() => {
    document.title = "The Trio Box: Ember & Root";
    return () => clearTimeout(timer.current);
  }, []);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true });
  };

  const setPicks = (next) => update({ picks: next.length ? next.map((pick) => pick.id).join(",") : null });

  const toggle = (flavor) => {
    const index = picks.findIndex((pick) => pick.id === flavor.id);
    if (index >= 0) {
      setPicks(picks.filter((pick) => pick.id !== flavor.id));
      return;
    }
    if (picks.length < 3) setPicks([...picks, flavor]);
  };

  const surprise = () => {
    const choose = () => [...flavors].sort(() => Math.random() - 0.5).slice(0, 3);
    if (reduce) {
      setPicks(choose());
      return;
    }
    clearInterval(timer.current);
    setShuffling(true);
    timer.current = setInterval(() => setPicks(choose()), 100);
    setTimeout(() => {
      clearInterval(timer.current);
      setPicks(choose());
      setShuffling(false);
    }, 700);
  };

  const add = () => {
    const draft = resolveItem({
      kind: "bundle",
      id: "trio",
      size: sizeId,
      picks: picks.map((pick) => pick.id),
      message: "",
      qty: 1,
    });
    if (!draft) return;
    useCart.getState().addBundle({
      id: "trio",
      size: sizeId,
      picks: picks.map((pick) => pick.id),
      message: "",
    });
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="overflow-hidden px-4 pb-28 pt-8 sm:px-5 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <header className="grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-7">
            <p className="label opacity-60">Shop / Build your own</p>
            <h1 className="display mt-5 text-[clamp(3.5rem,11vw,8.5rem)] font-semibold">
              The Trio<br /><span className="lg:pl-[8vw]">Box.</span>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:self-end">
            <p className="max-w-[38ch] text-lg leading-relaxed opacity-80">
              Three varieties, one small packing crate. Choose the bottles that belong on your table.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div role="radiogroup" aria-label="Trio bottle size" className="flex border border-soil">
                {["60", "150"].map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={sizeId === id}
                    onClick={() => update({ size: id === "150" ? null : id })}
                    className={`label px-4 py-3 ${sizeId === id ? "bg-soil text-paper" : ""}`}
                  >
                    {id === "60" ? "60 ml" : "150 ml"}
                  </button>
                ))}
              </div>
              <button type="button" onClick={surprise} disabled={shuffling} className="label border-b border-current pb-1 disabled:opacity-50">
                {shuffling ? "Shuffling…" : "Surprise me"}
              </button>
            </div>
          </div>
        </header>

        <main className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14 sm:gap-x-8 lg:mt-24 lg:gap-x-10">
          <section className="col-span-12 lg:col-span-7">
            <Crate picks={picks} onRemove={(pick) => toggle(pick)} reduce={reduce} />
            <div className="mx-auto mt-10 max-w-[720px]">
              <HeatRange picks={picks} />
            </div>
          </section>

          <section className="col-span-12 lg:col-span-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label opacity-60">Pick three</p>
                <h2 className="display-s mt-2 text-4xl">Fill the crate.</h2>
              </div>
              <p className="label opacity-60">{picks.length}/3 chosen</p>
            </div>
            <div className="mt-6">
              <Picker flavors={flavors} size={size} picks={picks} onToggle={toggle} />
            </div>
            <PriceBlock size={sizeId} picks={picks} added={added} onAdd={add} />
            <p className="label mt-5 opacity-60">
              {picks.length === 3
                ? `Three bottles · ${size.ml} ml each · Free shipping over Rs 5,000`
                : `Choose ${3 - picks.length} more for your box`}
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
