import { useEffect, useRef } from "react";

const CHARS = Array.from("Ember & Root");
const COOL = [138, 36, 20];   // cooling coal
const HOT = [244, 176, 64];   // glowing turmeric
const heat = (t) => `rgb(${COOL.map((c, i) => Math.round(c + (HOT[i] - c) * t)).join(",")})`;

export default function Wordmark() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const chars = Array.from(el.querySelectorAll("[data-ch]"));

    const paint = (i, t) => {
      const c = chars[i];
      c.style.fontVariationSettings = `"opsz" 144, "wght" ${Math.round(360 + t * 440)}`;
      c.style.color = heat(t);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((_, i) => paint(i, 0.35));
      return;
    }

    let raf = 0, visible = false, inside = false;
    let tx = 0, ty = 0, cx = 0, cy = 0, snapped = false;

    const move = (e) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX; ty = e.clientY; inside = true;
      if (!snapped) { cx = tx; cy = ty; snapped = true; }
    };
    const leave = () => { inside = false; snapped = false; };

    const loop = (now) => {
      if (!visible) { raf = 0; return; }

      if (inside) { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; }
      const R = Math.max(220, el.clientWidth * 0.24);

      const rects = chars.map((c) => c.getBoundingClientRect()); // read all…
      rects.forEach((r, i) => {                                   // …then write all
        let prox = 0;
        if (inside) {
          const d = Math.hypot(r.left + r.width / 2 - cx, (r.top + r.height / 2 - cy) * 0.6);
          prox = Math.max(0, 1 - d / R);
          prox = prox * prox * (3 - 2 * prox);
        }
        // slow heat wave rolling through the name (keeps touch screens alive)
        const wave = (Math.sin(now / 1300 - i * 0.6) + 1) / 2;
        const idle = 0.1 + wave * 0.3;
        paint(i, Math.max(prox, idle * (inside ? 0.45 : 1)));
      });

      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={root}
      role="img"
      aria-label="Ember & Root"
      className="display select-none overflow-x-clip whitespace-nowrap py-4 text-[12.6vw]"
    >
      {CHARS.map((ch, i) => (
        <span
          key={i}
          data-ch
          aria-hidden
          className="inline-block"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 360', color: heat(0.2) }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}