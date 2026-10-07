import { motionValue } from "framer-motion";
import { create } from "zustand";

export const heroBg = motionValue("rgb(242, 235, 221)");
export const heroInk = motionValue("rgb(31, 26, 20)");

export const useHeroTheme = create((set) => ({
  inView: false,
  activeIndex: 0,
  setInView: (inView) => set({ inView }),
  setActiveIndex: (activeIndex) => set({ activeIndex }),
}));
