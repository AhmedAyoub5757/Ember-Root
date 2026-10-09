import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { flavors } from "../../data/products";
import { useAuth } from "../../store/auth";
import logo from "../../assets/images/logo.png";

export default function MobileMenu({ open, onClose, links, navBg, navInk, lightInk }) {
  const [shop, setShop] = useState(false);
  const user = useAuth((s) => s.user);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          style={{ backgroundColor: navBg, color: navInk }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto lg:hidden"
        >
          <div className="hair-b flex h-[72px] shrink-0 items-center justify-between px-5">
            <img
              src={logo}
              alt="Ember & Root"
              className={`h-9 w-auto transition-[filter] duration-300 ${lightInk ? "brightness-0 invert" : "mix-blend-multiply"}`}
            />
            <button onClick={onClose} className="label border border-current px-4 py-2">
              Close ×
            </button>
          </div>

          <ul className="px-5 pt-4">
            <li className="hair">
              <button
                onClick={() => setShop((s) => !s)}
                className="flex w-full items-baseline gap-4 py-4 text-left"
              >
                <span className="label opacity-50">01</span>
                <span className="display text-5xl">Shop</span>
                <span className="label ml-auto">{shop ? "–" : "+"}</span>
              </button>

              <AnimatePresence initial={false}>
                {shop && (
                  <motion.ul
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {flavors.map((f) => (
                      <li key={f.id}>
                        <Link
                          to={`/flavor/${f.id}`}
                          onClick={onClose}
                          className="hair flex items-center gap-4 py-3"
                        >
                          <span className="h-3 w-3 shrink-0" style={{ background: f.color }} />
                          <span className="display text-2xl">{f.name}</span>
                          <span className="label ml-auto opacity-60">{f.heat}/5</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/shop" onClick={onClose} className="hair label block py-4">
                        View all sauces →
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop/trio" onClick={onClose} className="hair flex items-center justify-between py-4">
                        <span>The Trio Box</span><span aria-hidden>→</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop/gifts" onClick={onClose} className="hair flex items-center justify-between py-4">
                        <span>Gift sets</span><span aria-hidden>→</span>
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {links.map((l) => (
              <li key={l.to} className="hair">
                <Link to={l.to} onClick={onClose} className="flex items-baseline gap-4 py-4">
                  <span className="label opacity-50">{l.no}</span>
                  <span className="display text-5xl">{l.label}</span>
                </Link>
              </li>
            ))}
            <li className="hair">
              <Link to={user ? "/account" : "/auth"} onClick={onClose} className="flex items-baseline gap-4 py-4">
                <span className="label opacity-50">05</span>
                <span className="display text-5xl">{user ? "Account" : "Sign in"}</span>
              </Link>
            </li>
            <li className="hair" />
          </ul>

          <p className="label mt-auto px-5 py-6 opacity-60">
            Ember & Root / Slow-grown heat
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}