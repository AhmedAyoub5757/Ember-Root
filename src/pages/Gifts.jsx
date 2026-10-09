import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BUNDLES } from "../data/bundles";
import GiftPanel from "../components/bundles/GiftPanel";
import GiftTag from "../components/bundles/GiftTag";
import { useCart } from "../store/cart";

const definitions = Object.values(BUNDLES).filter((definition) => definition.type === "set");

export default function Gifts() {
  const [open, setOpen] = useState(null);
  const [messages, setMessages] = useState({});
  const [added, setAdded] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    document.title = "Gift sets: Ember & Root";
    return () => clearTimeout(timer.current);
  }, []);

  const choose = (id) => setOpen((current) => current === id ? null : id);
  const add = (definition) => {
    useCart.getState().addBundle({ id: definition.id, message: messages[definition.id] || "" });
    setAdded(definition.id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(null), 1400);
  };

  return (
    <div className="overflow-hidden px-4 pb-28 pt-8 sm:px-5 lg:px-8 lg:pb-36 lg:pt-14">
      <div className="mx-auto max-w-[1400px]">
        <header className="grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-7">
            <p className="label opacity-60">Shop / Gifts</p>
            <h1 className="display mt-5 text-[clamp(3.5rem,11vw,8.5rem)] font-semibold">
              Gift<br /><span className="lg:pl-[8vw]">sets.</span>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:self-end">
            <p className="max-w-[38ch] text-lg leading-relaxed opacity-80">
              A few good bottles, wrapped for the people who bring heat to your kitchen.
            </p>
          </div>
        </header>

        <main className="mt-16 lg:mt-28">
          <div className="relative hidden h-px bg-soil/40 lg:block" aria-hidden />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {definitions.map((definition) => (
              <GiftTag
                key={definition.id}
                definition={definition}
                open={open === definition.id}
                onChoose={() => choose(definition.id)}
              >
                <div className="lg:hidden">
                  {open === definition.id && (
                    <GiftPanel
                      definition={definition}
                      message={messages[definition.id] || ""}
                      onMessage={(message) => setMessages((current) => ({ ...current, [definition.id]: message }))}
                      added={added === definition.id}
                      onAdd={() => add(definition)}
                    />
                  )}
                </div>
              </GiftTag>
            ))}
          </div>

          <div className="hidden lg:block">
            <AnimatePresence initial={false}>
            {open && (
              <GiftPanel
                key={open}
                definition={BUNDLES[open]}
                message={messages[open] || ""}
                onMessage={(message) => setMessages((current) => ({ ...current, [open]: message }))}
                added={added === open}
                onAdd={() => add(BUNDLES[open])}
              />
            )}
            </AnimatePresence>
          </div>

          <p className="label mt-10 flex justify-between gap-6 opacity-60">
            <span>Printed cards · kraft paper · packed by hand</span>
            <span>Free shipping over Rs 5,000</span>
          </p>
        </main>
      </div>
    </div>
  );
}
