import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { heroSlides } from "../../data/hero";
import { inkFor, mixHex } from "../../lib/color";
import { heroBg, heroInk, useHeroTheme } from "../../store/heroTheme";
import { N, mod } from "./math";
import Backdrop from "./Backdrop";
import Stage from "./Stage";
import Embers from "./Embers";
import Caption from "./Caption";
import ArcDial from "./ArcDial";

const AUTOPLAY_MS = 6500;

const colors = heroSlides.map((s) => s.color);
const inks = colors.map(inkFor);
const smooth = (f) => f * f * (3 - 2 * f);
const blend = (list) => (p) => {
  const i = Math.floor(p);
  return mixHex(list[mod(i)], list[mod(i + 1)], smooth(p - i));
};
const bgAt = blend(colors);
const inkAt = blend(inks);

export default function Hero() {
  const reduce = useReducedMotion();
  const root = useRef(null);
  const embers = useRef(null);

  const pos = useMotionValue(0);       // the one number everything follows
  const progress = useMotionValue(0);  // autoplay timer 0..1
  const target = useRef(0);
  const anim = useRef(null);
  const dragFrom = useRef(0);
  const ignorePan = useRef(false);
  const didDrag = useRef(false);

  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(true);
  const setHeroInView = useHeroTheme((s) => s.setInView);
  const setActiveIndex = useHeroTheme((s) => s.setActiveIndex);

  const bg = useTransform(pos, bgAt);
  const ink = useTransform(pos, inkAt);

  useMotionValueEvent(bg, "change", (v) => heroBg.set(v));
  useMotionValueEvent(ink, "change", (v) => heroInk.set(v));

  // pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 70, damping: 20 });
  const smy = useSpring(my, { stiffness: 70, damping: 20 });

  /* ---------- navigation ---------- */
  const goTo = useCallback((t) => {
    target.current = t;
    setActive(mod(Math.round(t)));
    progress.set(0);
    anim.current?.stop();
    anim.current = animate(pos, t, { duration: 1.15, ease: [0.65, 0, 0.15, 1] });
  }, [pos, progress]);

  const step = useCallback((n) => goTo(Math.round(target.current) + n), [goTo]);

  const jump = useCallback((index) => {
    const cur = mod(Math.round(target.current));
    let delta = index - cur;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    if (delta) goTo(Math.round(target.current) + delta);
  }, [goTo]);

  const scrub = {
    start: () => {
      setDragging(true);
      didDrag.current = true;
      anim.current?.stop();
      dragFrom.current = pos.get();
    },
    move: (units) => pos.set(dragFrom.current + units),
    end: (v) => {
      setDragging(false);
      goTo(Math.round(pos.get() + Math.max(-1.5, Math.min(1.5, v * 0.3))));
    },
  };

  /* ---------- autoplay ---------- */
  useEffect(() => { if (reduce) setAuto(false); }, [reduce]);
  useEffect(() => { if (!auto) progress.set(0); }, [auto, progress]);

  useEffect(() => {
    heroBg.set(bg.get());
    heroInk.set(ink.get());
    return () => setHeroInView(false);
  }, [bg, ink, setHeroInView]);

  useEffect(() => {
    setActiveIndex(active);
  }, [active, setActiveIndex]);

  useEffect(() => {
    if (!auto || dragging || !inView) return;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const p = progress.get() + dt / AUTOPLAY_MS;
      if (p >= 1) { progress.set(0); step(1); } else progress.set(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, dragging, inView, step, progress]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), {
      rootMargin: "-104px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(root.current);
    return () => io.disconnect();
  }, [setHeroInView]);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, step]);

  /* ---------- pointer ---------- */
  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = root.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const onPanStart = (e) => {
    ignorePan.current = !!e.target?.closest?.("[data-dial]");
    if (!ignorePan.current) scrub.start();
  };
  const onPan = (_, info) => {
    if (ignorePan.current) return;
    const horizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
    scrub.move(-(horizontal ? info.offset.x : info.offset.y) / 420);
  };
  const onPanEnd = (_, info) => {
    if (ignorePan.current) return;
    const horizontal = Math.abs(info.velocity.x) > Math.abs(info.velocity.y);
    scrub.end(-(horizontal ? info.velocity.x : info.velocity.y) / 420);
  };

  const onBottle = (e) => {
    if (didDrag.current) return false;
    embers.current?.burst(e.clientX, e.clientY);
    return true;
  };

  return (
    <motion.section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Featured flavors"
      onPointerDown={() => { didDrag.current = false; }}
      onPointerMove={onMove}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      onPanStart={onPanStart}
      onPan={onPan}
      onPanEnd={onPanEnd}
      style={{ backgroundColor: bg, color: ink, touchAction: "pan-y" }}
      className="hero-root relative h-[calc(100svh-104px)] min-h-[640px] select-none overflow-hidden"
    >
      <Backdrop pos={pos} smx={smx} smy={smy} />
      <Stage pos={pos} smx={smx} smy={smy} onBottle={onBottle} />
      <Embers ref={embers} ink={ink} run={inView} />

      <Caption slide={heroSlides[active]} />
      <ArcDial
        pos={pos}
        progress={progress}
        onJump={jump}
        scrub={scrub}
      />
    </motion.section>
  );
}