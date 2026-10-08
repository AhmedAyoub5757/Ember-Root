import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { extra, nutrition, shelf } from "../../data/productExtra";

const ease = [0.2, 0.7, 0.2, 1];

const shipping = [
  ["Cash on delivery", "Across Pakistan"],
  ["Card & PayPal", "International orders"],
  ["Easypaisa", "Pakistan"],
  ["Free shipping", "Orders over Rs 5,000"],
];

const Row = ({ k, v }) => (
  <div className="hair flex justify-between gap-4 py-3 text-sm">
    <dt className="label opacity-70">{k}</dt>
    <dd className="text-right">{v}</dd>
  </div>
);

export default function Details({ f }) {
  const [open, setOpen] = useState("tasting");
  const x = extra[f.id];

  const panels = [
    ["tasting", "Tasting notes", <dl key="t">{x.tasting.map(([k, v]) => <Row key={k} k={k} v={v} />)}</dl>],
    [
      "inside", "What's inside",
      <div key="i">
        <p className="max-w-[46ch] text-sm leading-relaxed">{x.inside}</p>
        <p className="label mt-4 opacity-70">{shelf}</p>
      </div>,
    ],
    [
      "nutrition", "Nutrition",
      <dl key="n">
        <p className="label mb-1 opacity-70">{nutrition.per}</p>
        {nutrition.rows.map(([k, v]) => <Row key={k} k={k} v={v} />)}
      </dl>,
    ],
    ["shipping", "Shipping & payment", <dl key="s">{shipping.map(([k, v]) => <Row key={k} k={k} v={v} />)}</dl>],
  ];

  return (
    <div className="mt-12">
      {panels.map(([id, title, body]) => {
        const on = open === id;
        return (
          <div key={id} className="hair">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`panel-${id}`}
                onClick={() => setOpen(on ? null : id)}
                className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
              >
                <span className="display-s text-2xl">{title}</span>
                <span className="label" aria-hidden>{on ? "–" : "+"}</span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`panel-${id}`}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <div className="pb-6">{body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <div className="hair" />
    </div>
  );
}