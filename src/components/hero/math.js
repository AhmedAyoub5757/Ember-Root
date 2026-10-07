import { heroSlides } from "../../data/hero";

export const N = heroSlides.length;
export const mod = (n, m = N) => ((n % m) + m) % m;
// signed distance of slide k from the current position, in range [-N/2, N/2)
export const offset = (k, p) => mod(k - p + N / 2) - N / 2;
export const clamp01 = (v) => Math.min(1, Math.max(0, v));