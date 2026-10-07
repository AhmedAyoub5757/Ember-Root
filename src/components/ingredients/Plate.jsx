import { useRef } from "react";
import { botanicalFor } from "../../lib/assets";
import paper from "../../assets/images/paper.jpg";

const ZOOM = 2.6;
const LENS = 168;
const PAPER = "#E6DCC6";

export default function Plate({ ing, total, pin, setPin }) {
  const src = botanicalFor(ing.plate);
  const wrap = useRef(null);
  const lens = useRef(null);

  const move = (e) => {
    if (e.pointerType !== "mouse" || !lens.current || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const l = lens.current;
    l.style.opacity = 1;
    l.style.transform = `translate(${x - LENS / 2}px, ${y - LENS / 2}px)`;
    l.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
    l.style.backgroundPosition = `${LENS / 2 - x * ZOOM}px ${LENS / 2 - y * ZOOM}px`;
  };

  const leave = () => {
    if (lens.current) lens.current.style.opacity = 0;
  };

  // Dev helper: click the plate to log pin coordinates for data/ingredients.js
  const logCoords = (e) => {
    if (!import.meta.env.DEV) return;
    const r = wrap.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    console.log(`{ x: ${x}, y: ${y} }`);
  };

  return (
    <div
      className="relative w-full max-w-full border border-soil/15 text-soil shadow-[0_26px_44px_-22px_rgba(0,0,0,0.75)]"
      style={{
        backgroundColor: PAPER,
        backgroundImage: `url(${paper})`,
        backgroundBlendMode: "multiply",
        backgroundSize: "420px",
      }}
    >
      <div className="pointer-events-none absolute inset-3 border border-soil/25" />

      <div className="label flex justify-between px-7 pt-7 opacity-70">
        <span>Plate {ing.no} / {String(total).padStart(2, "0")}</span>
        <span>Pressed &amp; annotated</span>
      </div>

      <div className="px-4 pb-5 pt-5 sm:px-10">
        {src ? (
          <div
            ref={wrap}
            onPointerMove={move}
            onPointerLeave={leave}
            onClick={logCoords}
            className="relative mx-auto w-full max-w-full cursor-crosshair lg:w-fit"
          >
            <img
              src={src}
              alt={`Botanical illustration of ${ing.name}`}
              draggable={false}
              className="block h-auto w-full max-w-full select-none object-contain mix-blend-multiply brightness-105 contrast-105 lg:max-h-[min(58svh,600px)] lg:w-auto"
            />

            {/* magnifier */}
            <div
              ref={lens}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 rounded-full border border-soil/60 opacity-0 shadow-[0_14px_26px_-8px_rgba(31,26,20,0.55)] transition-opacity duration-200"
              style={{
                width: LENS,
                height: LENS,
                backgroundImage: `url(${src})`,
                backgroundColor: PAPER,
                backgroundBlendMode: "multiply",
                backgroundRepeat: "no-repeat",
              }}
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-soil/25" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-soil/25" />
            </div>

            {/* anatomy pins */}
            {ing.pins.map((p, i) => {
              const on = pin === i;
              return (
                <button
                  key={p.t}
                  type="button"
                  aria-label={`${p.t}: ${p.d}`}
                  aria-pressed={on}
                  onMouseEnter={() => setPin(i)}
                  onFocus={() => setPin(i)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPin(on ? null : i);
                  }}
                  className={`label absolute z-30 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-soil transition-all duration-300 ${
                    on ? "scale-125 bg-soil text-paper" : "bg-paper text-soil"
                  }`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="label py-24 text-center opacity-60">
            Missing plate: name a file botanical-{ing.plate}.png
          </p>
        )}
      </div>

      <p className="label px-7 pb-7 opacity-60">
        <span className="hidden lg:inline">Move over the plate to magnify ×{ZOOM} · </span>
        Fig. {ing.no} — {ing.latin}
      </p>
    </div>
  );
}