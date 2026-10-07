import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const Embers = forwardRef(function Embers({ ink, run }, ref) {
  const canvasRef = useRef(null);
  const list = useRef([]);
  const runRef = useRef(run);
  runRef.current = run;

  useImperativeHandle(ref, () => ({
    burst(cx, cy) {
      const r = canvasRef.current.getBoundingClientRect();
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 40 + Math.random() * 200;
        list.current.push({
          x: cx - r.left, y: cy - r.top,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60,
          r: 1 + Math.random() * 2.6, life: 0, max: 0.8 + Math.random() * 0.9,
          w: 0, ph: 0, burst: true,
        });
      }
    },
  }), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf, acc = 0, last = performance.now();

    const fit = () => {
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    fit();

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!runRef.current) return;

      ctx.clearRect(0, 0, w, h);
      const arr = list.current;

      acc += dt * 16; // ambient embers per second
      while (acc >= 1) {
        acc -= 1;
        if (arr.length < 140) {
          arr.push({
            x: Math.random() * w, y: h + 10, vx: 0,
            vy: -(20 + Math.random() * 40), r: 0.6 + Math.random() * 1.8,
            life: 0, max: 5 + Math.random() * 4,
            w: 1 + Math.random() * 2, ph: Math.random() * 6, burst: false,
          });
        }
      }

      const [r, g, b] = ink.get().match(/\d+/g) || [242, 235, 221];
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.life += dt;
        if (p.life >= p.max) { arr.splice(i, 1); continue; }
        if (p.burst) { p.vx *= 0.96; p.vy = p.vy * 0.96 - 90 * dt; }
        else { p.ph += dt; p.vx = Math.sin(p.ph * p.w) * 14; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const t = p.life / p.max;
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.sin(Math.PI * t) * (p.burst ? 0.9 : 0.5)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [ink]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden />;
});

export default Embers;