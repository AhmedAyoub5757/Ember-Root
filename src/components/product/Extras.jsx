import { Link } from "react-router-dom";
import { flavors } from "../../data/products";
import { letters } from "../../data/letters";
import { bottleFor } from "../../lib/assets";
import { inkFor } from "../../lib/color";
import HeatRuler from "../ui/HeatRuler";

export function JarLetters({ f }) {
  const list = letters.filter((l) => l.flavor === f.id);
  if (!list.length) return null;

  return (
    <section className="pt-20 lg:pt-28">
      <p className="label opacity-70">Letters about this jar</p>
      <ul className="mt-5">
        {list.map((l) => (
          <li key={l.id} className="hair grid grid-cols-12 gap-x-0 gap-y-3 py-6 lg:gap-x-8">
            <p className="label col-span-12 opacity-70 md:col-span-3">
              {l.date}<br />{l.city}
            </p>
            <blockquote className="col-span-12 md:col-span-9">
              <p className="display-s text-2xl italic lg:text-4xl">
                “{l.text ?? l.wire.join(". ")}”
              </p>
              <footer className="label mt-3 opacity-70">— {l.from}</footer>
            </blockquote>
          </li>
        ))}
        <li className="hair" />
      </ul>
    </section>
  );
}

export function OtherVarieties({ current }) {
  const list = flavors.filter((x) => x.id !== current);

  return (
    <section className="pb-20 pt-20 lg:pb-28 lg:pt-28">
      <p className="label opacity-70">Also in the field</p>
      <ul className="mt-5">
        {list.map((x) => (
          <li key={x.id} className="hair">
            <Link
              to={`/flavor/${x.id}`}
              style={{ "--hi": inkFor(x.color) }}
              className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-x-3 px-3 py-5 transition-colors duration-300 hover:text-[color:var(--hi)] focus-visible:text-[color:var(--hi)]"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                style={{ background: x.color }}
              />
              <span className="label relative">{x.no}</span>
              <span className="display-s relative text-3xl lg:text-4xl">{x.name}</span>
              <span className="relative hidden items-center gap-5 sm:flex">
                <HeatRuler level={x.heat} color="currentColor" />
                <span className="label" aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
        <li className="hair" />
      </ul>
    </section>
  );
}

export function NextBand({ next }) {
  const ink = inkFor(next.color);
  return (
    <Link
      to={`/flavor/${next.id}`}
      className="group relative block overflow-hidden"
      style={{ background: next.color, color: ink }}
    >
      <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-16 lg:px-8 lg:pb-16 lg:pt-24">
        <p className="label opacity-70">Next variety · No. {next.no}</p>
        <p className="display mt-4 max-w-[12ch] text-[clamp(3rem,9vw,8rem)] font-semibold">{next.name}</p>
        <p className="label mt-6 inline-flex items-center gap-3 border-b border-current pb-1">
          Turn the page
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </p>
      </div>
      <img
        src={bottleFor(next.id)}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute -bottom-[18%] right-[6%] hidden h-[115%] w-auto translate-y-10 rotate-6 drop-shadow-[0_24px_22px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-y-0 group-hover:rotate-2 sm:block lg:right-[10%]"
      />
    </Link>
  );
}