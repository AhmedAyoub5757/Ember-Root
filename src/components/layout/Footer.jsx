import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { flavors } from "../../data/products";
import Wordmark from "./Wordmark";

// Replace with your real handles
const cols = [
  ["Shop", [...flavors.map((f) => [f.name, `/flavor/${f.id}`]), ["All sauces", "/shop"]]],
  ["Learn", [["Our story", "/story"], ["Ingredients", "/ingredients"], ["Heat guide", "/heat-guide"], ["Write to us", "/contact"]]],
  ["Help", [["Shipping & returns", "/shipping"], ["FAQ", "/faq"], ["Track an order", "/track"], ["Contact", "/contact"]]],
  ["Elsewhere", [["Instagram", "https://www.instagram.com/", true], ["TikTok", "https://www.tiktok.com/", true], ["WhatsApp", "https://wa.me/", true]]],
];

const pay = ["Card (Stripe)", "PayPal", "Easypaisa", "Cash on delivery"];

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Karachi",
});

function KitchenClock() {
  const [t, setT] = useState(() => clock.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setT(clock.format(new Date())), 15000);
    return () => clearInterval(id);
  }, []);
  return <span>Kitchen time {t} PKT</span>;
}

function Ruler() {
  return (
    <svg className="h-3 w-full" aria-hidden>
      <defs>
        <pattern id="rt-minor" width="8" height="12" patternUnits="userSpaceOnUse">
          <line x1=".5" x2=".5" y1="7" y2="12" stroke="currentColor" strokeOpacity=".45" />
        </pattern>
        <pattern id="rt-major" width="80" height="12" patternUnits="userSpaceOnUse">
          <line x1=".5" x2=".5" y1="0" y2="12" stroke="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill="url(#rt-minor)" />
      <rect width="100%" height="12" fill="url(#rt-major)" />
    </svg>
  );
}

function FooterLink({ to, external, children }) {
  const cls = "group inline-flex items-baseline gap-2 py-1 display-s text-xl lg:text-[1.35rem]";
  const inner = (
    <>
      <span className="transition-transform duration-300 group-hover:translate-x-1">{children}</span>
      <span aria-hidden className="label opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {external ? "↗" : "→"}
      </span>
    </>
  );
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link to={to} className={cls}>{inner}</Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-soil text-paper">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 lg:px-8 lg:pt-28">
        <Ruler />
        <p className="label mt-3 flex justify-between gap-6 opacity-60">
          <span>07 / The back of the label</span>
          <span>Batch 07 / Bottling now</span>
        </p>

        <div className="mt-14 grid grid-cols-12 gap-x-8 gap-y-14 lg:mt-20">
          <div className="col-span-12 lg:col-span-4">
            <p className="display-s text-4xl lg:text-5xl">
              Slow-grown <span className="italic">heat.</span>
            </p>
            <p className="mt-5 max-w-[34ch] leading-relaxed opacity-75">
              Small-batch hot sauce, fermented in crocks and bottled by hand.
            </p>
            <a
              href="mailto:hello@emberandroot.example"
              className="label mt-6 inline-block border-b border-current pb-1"
            >
              hello@emberandroot.example
            </a>
          </div>

          <nav aria-label="Footer" className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:col-span-8">
            {cols.map(([title, items]) => (
              <div key={title}>
                <p className="label opacity-60">{title}</p>
                <ul className="mt-4">
                  {items.map(([label, to, external]) => (
                    <li key={label}>
                      <FooterLink to={to} external={external}>{label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="hair mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 py-6 lg:mt-20">
          <span className="label opacity-60">Pay with</span>
          {pay.map((p) => (
            <span key={p} className="label border border-paper/40 px-3 py-1.5">{p}</span>
          ))}
        </div>

        <div className="hair label flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5 opacity-80">
          <span>© {new Date().getFullYear()} Ember &amp; Root</span>
          <KitchenClock />
          <span className="flex gap-6">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="border-b border-current pb-0.5"
          >
            Back to top ↑
          </button>
        </div>

        <p className="label mt-10 opacity-50">Run your cursor across the name. It runs warm.</p>
        <Wordmark />
        <p className="label pb-6 opacity-40">Set in Fraunces, Hanken Grotesk and IBM Plex Mono</p>
      </div>
    </footer>
  );
}