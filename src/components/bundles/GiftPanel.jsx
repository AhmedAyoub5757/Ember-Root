import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { bottleFor } from "../../lib/assets";
import { MESSAGE_MAX } from "../../data/bundles";
import { cleanMessage, fmt, resolveItem } from "../../lib/money";

const ladderHeat = [2, 2, 3, 3, 4, 5];

export default function GiftPanel({ definition, message, onMessage, added, onAdd }) {
  const line = resolveItem({ kind: "bundle", id: definition.id, qty: 1 });
  const isLadder = definition.id === "ladder";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="hair-b border-x border-soil/15 bg-paper-dark/35 px-4 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-end gap-2 border-b border-soil/30 pb-3">
              {line.parts.map((part, index) => (
                <div key={part.id} className="relative flex h-40 flex-1 items-end justify-center border-b-2 border-soil/50">
                  <img src={bottleFor(part.id)} alt={part.name} className="h-[90%] w-auto max-w-none object-contain" />
                  <span className="label absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-60">{String(index + 1).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
            {isLadder && (
              <div className="mt-10">
                <p className="label mb-3 opacity-60">The climb</p>
                <div className="flex h-20 items-end gap-1">
                  {ladderHeat.map((heat, index) => (
                    <span key={index} className="flex-1 bg-chili/70" style={{ height: `${heat * 16}%` }} title={`Heat ${heat}`} />
                  ))}
                </div>
                <p className="label mt-2 flex justify-between opacity-60"><span>Gentle</span><span>Reckless</span></p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor={`gift-message-${definition.id}`} className="label block opacity-70">
              Printed message card
            </label>
            <textarea
              id={`gift-message-${definition.id}`}
              value={message}
              maxLength={MESSAGE_MAX}
              onChange={(event) => onMessage(cleanMessage(event.target.value))}
              placeholder="Write a little fire..."
              rows={4}
              className="display-s mt-3 w-full resize-none border border-soil/30 bg-paper px-4 py-3 text-xl outline-none focus:border-soil"
            />
            <p className="label mt-2 text-right opacity-60">{message.length} / {MESSAGE_MAX}</p>

            <div className="mt-6 rotate-[-1deg] border border-soil/15 bg-[#C9895A] p-5 shadow-[0_16px_24px_-22px_rgba(31,26,20,.8)]">
              <p className={`display-s min-h-16 text-2xl italic ${message ? "" : "opacity-45"}`}>
                {message || "Your message goes here..."}
              </p>
              <p className="label mt-6 border-t border-soil/25 pt-3 opacity-65">From the kitchen of Ember &amp; Root</p>
            </div>

            <button
              type="button"
              onClick={onAdd}
              className="label mt-7 flex h-14 w-full items-center justify-between bg-soil px-5 text-paper transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <span>{added ? "Added to cart" : "Add gift set to cart"}</span>
                {added && <FontAwesomeIcon icon={faCheck} className="text-xs" aria-hidden />}
              </span>
              {!added && <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />}
            </button>
            <p className="label mt-3 opacity-60">Ships in kraft paper with your card tucked inside. {fmt(line.unit)}.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
