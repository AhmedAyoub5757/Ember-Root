import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { flavors } from "../../data/products";
import { useCart } from "../../store/cart";
import { inkFor, mixColors, parseColor } from "../../lib/color";
import { heroBg, heroInk, useHeroTheme } from "../../store/heroTheme";
import logo from "../../assets/images/logo.png";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";

const PAPER = "#F2EBDD";
const SOIL = "#1F1A14";

const links = [
  { no: "02", label: "Story", to: "/story" },
  { no: "03", label: "Ingredients", to: "/ingredients" },
  { no: "04", label: "Contact", to: "/contact" },
];

const ticker = [
  "Batch 07 now bottling",
  "Cash on delivery across Pakistan",
  "Free shipping over Rs 5,000",
  "Fermented, never rushed",
  "Small batch / Single estate chilies",
];

const underline =
  "relative after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100";

function Ticker() {
  const row = [...ticker, ...ticker];
  return (
    <div className="label h-8 overflow-hidden bg-soil text-paper">
      <div className="marquee flex h-full w-max items-center">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6">{t}</span>
                <span className="opacity-40">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(flavors[0]);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const inView = useHeroTheme((s) => s.inView);
  const heroMix = useMotionValue(0);
  const megaMix = useMotionValue(0);
  const megaBg = useMotionValue(active.color);
  const megaInk = useMotionValue(inkFor(active.color));
  const navBg = useTransform(
    [heroBg, heroMix, megaBg, megaMix],
    ([h, hm, mb, mm]) => mixColors(mixColors(PAPER, h, hm), mb, mm),
  );
  const navInk = useTransform(
    [heroInk, heroMix, megaInk, megaMix],
    ([h, hm, mi, mm]) => mixColors(mixColors(SOIL, h, hm), mi, mm),
  );
  const [lightInk, setLightInk] = useState(() => {
    const [r, g, b] = parseColor(navInk.get());
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 <= 0.55;
  });

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 140 && !megaOpen);
  });

  // close menus on route change
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMegaOpen(false);
      setMobileOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    const controls = animate(heroMix, inView && !megaOpen ? 1 : 0, { duration: 0.4 });
    return () => controls.stop();
  }, [heroMix, inView, megaOpen]);

  useEffect(() => {
    const controls = animate(megaMix, megaOpen ? 1 : 0, { duration: 0.45 });
    return () => controls.stop();
  }, [megaMix, megaOpen]);

  useEffect(() => {
    const bgControls = animate(megaBg, active.color, { duration: 0.45 });
    const inkControls = animate(megaInk, inkFor(active.color), { duration: 0.45 });
    return () => {
      bgControls.stop();
      inkControls.stop();
    };
  }, [active, megaBg, megaInk]);

  useMotionValueEvent(navInk, "change", (value) => {
    const [r, g, b] = parseColor(value);
    const next = (0.299 * r + 0.587 * g + 0.114 * b) / 255 <= 0.55;
    setLightInk((current) => (current === next ? current : next));
  });

  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMegaOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        onMouseLeave={() => setMegaOpen(false)}
        className="fixed inset-x-0 top-0 z-50"
      >
        <Ticker />

        <motion.div
          style={{ backgroundColor: navBg, color: navInk }}
          className="hair-b"
        >
          <div className="mx-auto flex h-[72px] max-w-[1400px] items-stretch px-5 lg:px-8">
            {/* Logo */}
            <Link to="/" className="mr-10 flex items-center" aria-label="Ember & Root home">
              <img
                src={logo}
                alt="Ember & Root"
                className={`h-9 w-auto transition-[filter] duration-300 ${
                  lightInk ? "brightness-0 invert" : "mix-blend-multiply"
                }`}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-stretch lg:flex" aria-label="Primary">
              <button
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onMouseEnter={() => setMegaOpen(true)}
                onClick={() => setMegaOpen((o) => !o)}
                className={`flex items-center gap-2 px-4 ${underline} ${
                  megaOpen ? "after:scale-x-100" : ""
                }`}
              >
                <span className="label opacity-50">01</span>
                <span className="display text-xl tracking-normal">Shop</span>
                <span className="label w-3">{megaOpen ? "–" : "+"}</span>
              </button>

              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onMouseEnter={() => setMegaOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 ${underline} ${
                      isActive ? "after:scale-x-100" : ""
                    }`
                  }
                >
                  <span className="label opacity-50">{l.no}</span>
                  <span className="display text-xl tracking-normal">{l.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => useCart.getState().toggle()}
                className="label flex h-10 items-center gap-3 border border-current pl-4 transition-colors hover:bg-[color:var(--hover-bg)]"
              >
                Cart
                <span
                  className="flex h-full min-w-10 items-center justify-center border-l border-current px-2"
                  aria-label={`${count} items in cart`}
                >
                  {String(count).padStart(2, "0")}
                </span>
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="label h-10 border border-current px-4 lg:hidden"
              >
                Menu +
              </button>
            </div>
          </div>

          <MegaMenu
            open={megaOpen}
            active={active}
            setActive={setActive}
            ink={inkFor(active.color)}
            close={() => setMegaOpen(false)}
          />
        </motion.div>
      </motion.header>

      {/* Outside the header on purpose: transformed parents break position:fixed */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} />
    </>
  );
}