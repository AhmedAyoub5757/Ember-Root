import { useEffect, useRef, useState } from "react";
import {
  animate, motion, useInView, useMotionValue, useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { flavors } from "../../data/products";
import { letters } from "../../data/letters";
import { useMediaQuery } from "../../lib/useMediaQuery";
import paper from "../../assets/images/paper.jpg";
import Letter from "./Letter";

const ease = [0.2, 0.7, 0.2, 1];

const rise = {
  hidden: { y: "105%" },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: i * 0.12, ease } }),
};

const stats = [
  [1284, "", "Letters received"],
  [96, "%", "Re-ordered"],
  [38, "", "Countries"],
];

function Count({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const mv = useMotionValue(0);
  const text = useTransform(
    mv,
    (v) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix
  );

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 1.6, ease });
    return () => c.stop();
  }, [inView, mv, to]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`label inline-flex shrink-0 items-center gap-2 border px-3 py-2 transition-colors duration-200 ${
        on ? "border-soil bg-soil text-paper" : "border-soil/40 hover:border-soil"
      }`}
    >
      {children}
    </button>
  );
}

export default function Letters() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const desk = useRef(null);
  const top = useRef(10);
  const [z, setZ] = useState({});
  const [filter, setFilter] = useState(null);

  const front = (id) => {
    const n = ++top.current;
    setZ((s) => ({ ...s, [id]: n }));
  };

  return (
    <section id="letters" className="px-5 pb-28 pt-24 lg:px-8 lg:pb-36 lg:pt-32">
      <div className="mx-auto max-w-[1400px]">
        {/* header */}
        <header className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="display mt-5 text-[clamp(3.2rem,9vw,8.5rem)] font-semibold">
              {["Letters,", "received."].map((t, i) => (
                <span key={t} className={`block overflow-hidden pb-[0.12em] ${i ? "lg:pl-[10vw]" : ""}`}>
                  <motion.span
                    className="block"
                    variants={rise}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:self-end">
            <p className="max-w-[40ch] leading-relaxed opacity-80">
              We don't collect stars. We collect mail: postcards, notes, order
              slips and the occasional telegram, from people who put a bottle on
              their table.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-4">
              {stats.map(([n, s, label]) => (
                <div key={label} className="hair flex flex-col-reverse pt-3">
                  <dt className="label mt-1 opacity-60">{label}</dt>
                  <dd className="display text-3xl lg:text-4xl">
                    <Count to={n} suffix={s} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* filing chips */}
        <div
          role="group"
          aria-label="File letters by flavor"
          className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-1 lg:mt-16 lg:flex-wrap lg:overflow-visible"
        >
          <Chip on={filter === null} onClick={() => setFilter(null)}>All letters</Chip>
          {flavors.map((f) => (
            <Chip
              key={f.id}
              on={filter === f.id}
              onClick={() => setFilter(filter === f.id ? null : f.id)}
            >
              <span className="h-2.5 w-2.5" style={{ background: f.color }} />
              {f.name}
            </Chip>
          ))}
        </div>

        {/* the desk */}
        <div
          ref={desk}
          className="relative mt-6 border border-soil/25 p-4 lg:p-12"
          style={{
            backgroundColor: "#E6DCC6",
            backgroundImage: `url(${paper})`,
            backgroundBlendMode: "multiply",
            backgroundSize: "420px",
          }}
        >
          {["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"].map((c) => (
            <span key={c} aria-hidden className={`label pointer-events-none absolute opacity-50 ${c}`}>+</span>
          ))}

          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 pt-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12 lg:snap-none lg:overflow-visible lg:p-0">
            {letters.map((l) => (
              <Letter
                key={l.id}
                l={l}
                f={flavors.find((x) => x.id === l.flavor)}
                dim={filter !== null && filter !== l.flavor}
                drag={isDesktop}
                constraints={desk}
                z={z[l.id] ?? 1}
                onFront={() => front(l.id)}
                className="w-[78vw] max-w-[360px] shrink-0 snap-center lg:w-auto lg:max-w-none"
              />
            ))}
          </div>
        </div>

        {/* mail slot call to action */}
        <div className="mt-20 grid grid-cols-12 items-end gap-x-8 gap-y-10 lg:mt-28">
          <div className="col-span-12 lg:col-span-6">
            <p className="label opacity-60">Your turn</p>
            <h3 className="display mt-3 text-5xl font-semibold lg:text-7xl">Write back.</h3>
            <p className="mt-5 max-w-[40ch] leading-relaxed opacity-80">
              Tell us what you put it on. Every letter gets read, and the best ones
              end up on this desk.
            </p>
          </div>

          <Link
            to="/contact"
            aria-label="Write to Ember & Root"
            className="group col-span-12 block lg:col-span-6"
          >
            <div className="relative mx-auto h-14 w-full max-w-[520px] overflow-hidden">
              <div
                className="absolute inset-x-8 top-0 h-24 -translate-y-4 border border-soil/20 px-5 pt-8 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-y-10 group-focus-visible:translate-y-10 group-active:translate-y-10"
                style={{ background: "#FBF6EA" }}
              >
                <p className="display-s text-xl italic">Dear Ember &amp; Root,</p>
              </div>
            </div>
            <div className="mx-auto h-4 w-full max-w-[520px] bg-soil shadow-[inset_0_3px_0_rgba(0,0,0,0.55)]" />
            <p className="label mx-auto mt-4 flex max-w-[520px] justify-between">
              <span>Post a letter</span>
              <span aria-hidden>→</span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}