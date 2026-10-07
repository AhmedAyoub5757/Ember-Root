import { flavors } from "./products";

const rnd = (i, m) => {
  const x = Math.sin(i * 127.1 + m * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const sgn = (i, m) => (rnd(i, m) > 0.5 ? 1 : -1);

let gi = 0;
const prop = ([shape, colors, size, x, y, z, rot]) => {
  const i = gi++;
  return {
    shape, colors, size, x, y, z, rot,
    blur: z > 250 ? 3 : z < -300 ? 1.6 : 0,      // depth-of-field
    gain: 0.8 + rnd(i, 1) * 0.9,                   // how far it travels along the arc
    fade: 1 + (i % 4) * 0.3,                       // staggers appearance
    spin: sgn(i, 2) * (50 + rnd(i, 3) * 90),
    dx: sgn(i, 4) * (10 + rnd(i, 5) * 18),
    dy: sgn(i, 6) * (10 + rnd(i, 7) * 18),
    dz: sgn(i, 8) * (30 + rnd(i, 9) * 70),
    dr: sgn(i, 10) * (6 + rnd(i, 11) * 12),
    drx: sgn(i, 12) * (8 + rnd(i, 13) * 22),
    dur: 7 + rnd(i, 14) * 6,
    delay: -rnd(i, 15) * 10,
  };
};

const extra = {
  "kashmiri-red": {
    lines: ["Kashmiri", "Red"],
    line: "Deep colour, gentle burn. The one that goes on everything.",
    props: [
      ["chili", ["#7E1C0F", "#E2573A", "#2A0F0C"], 150, 19, 27, 140, -25],
      ["chili", ["#9A2514", "#F0856A", "#2A0F0C"], 120, 73, 21, -180, 38],
      ["seeds", ["#E9D3A0", "#C79A4A", "#5A3A12"], 90, 13, 60, 60, 10],
      ["drop", ["#D9A21B", "#FFF1B8", "#7A5400"], 66, 77, 68, 220, 15],
      ["leaf", ["#4A5A2A", "#9BB05A", "#1F2A0E"], 110, 31, 11, -320, 30],
      ["bhut", ["#5E1209", "#C8452D", "#2A0F0C"], 90, 64, 80, -90, -60],
      ["ring", ["#7E1C0F", "#F2D9B5", "#2A0F0C"], 76, 8, 40, -130, 0],
    ],
  },
  "mango-habanero": {
    lines: ["Mango", "Habanero"],
    line: "Sweet first, then the habanero arrives.",
    props: [
      ["mango", ["#C8411F", "#F7D358", "#5A1B08"], 170, 18, 26, 150, -18],
      ["habanero", ["#B5290F", "#F06A3C", "#3B0F05"], 120, 74, 24, -150, 25],
      ["habanero", ["#D8481A", "#FFB07A", "#3B0F05"], 90, 68, 74, 250, -40],
      ["leaf", ["#3E5A24", "#9DBA5C", "#16240A"], 120, 30, 10, -300, 35],
      ["drop", ["#F7D358", "#FFF6C9", "#7A4300"], 70, 12, 58, 90, 10],
      ["ring", ["#B5290F", "#F7D358", "#5A1B08"], 80, 79, 50, -60, 15],
      ["salt", ["#7A4A1E", "#C98A4A", "#3B220C"], 64, 57, 90, 300, 20],
    ],
  },
  "green-jalapeno-lime": {
    lines: ["Jalapeño", "& Lime"],
    line: "Bright, green and sharp. Built for tacos and tired mornings.",
    props: [
      ["jalapeno", ["#9DBD3A", "#D6EA7A", "#1F2D0A"], 150, 19, 26, 140, -30],
      ["lime", ["#3F6B1C", "#D9E873", "#16240A"], 150, 74, 25, -160, 20],
      ["ring", ["#3F6B1C", "#D6EA7A", "#16240A"], 80, 67, 76, 240, 0],
      ["leaf", ["#E3EBC2", "#8FA84A", "#16240A"], 110, 31, 10, -320, -20],
      ["jalapeno", ["#7FA32A", "#C7E06A", "#1F2D0A"], 100, 79, 52, -80, 65],
      ["drop", ["#C7E06A", "#F4FAD0", "#2D3F0E"], 70, 12, 58, 100, 0],
      ["seeds", ["#F2EBDD", "#C7E06A", "#2D3F0E"], 90, 55, 90, 280, 20],
    ],
  },
  "smoked-chipotle": {
    lines: ["Smoked", "Chipotle"],
    line: "Wood smoke, tamarind and a slow, dark heat.",
    props: [
      ["bhut", ["#3B1710", "#A8623A", "#14080A"], 150, 19, 27, 150, -25],
      ["smoke", ["#F2EBDD"], 180, 74, 20, -200, 8],
      ["tamarind", ["#C58A55", "#7A4A22", "#2B1810"], 130, 70, 72, 160, -15],
      ["pod", ["#2B1810", "#9A6A44", "#0F0705"], 80, 12, 58, -100, 30],
      ["flame", ["#F29B38", "#FFD36A"], 80, 33, 11, -300, 0],
      ["seeds", ["#E9D3A0", "#C79A4A", "#3A2412"], 90, 80, 50, 90, 0],
      ["smoke", ["#F2EBDD"], 120, 52, 88, 270, -20],
    ],
  },
  "garlic-serrano": {
    lines: ["Garlic", "Serrano"],
    line: "Mellow roasted garlic up front, serrano close behind.",
    props: [
      ["garlic", ["#F4EAD0", "#B89A4E", "#3A2A08"], 140, 20, 26, 150, -20],
      ["chili", ["#4F6B22", "#9DBA5C", "#1B2808"], 150, 73, 24, -170, 35],
      ["salt", ["#FBF7EA", "#D9CDA6", "#5A4510"], 70, 66, 74, 240, 0],
      ["leaf", ["#6B7F2A", "#B3C46A", "#243008"], 110, 31, 10, -300, 25],
      ["drop", ["#8A5A12", "#E8B64A", "#3A2504"], 70, 12, 58, 90, 0],
      ["garlic", ["#EADFC0", "#A58A44", "#3A2A08"], 90, 79, 52, -90, 50],
      ["seeds", ["#3A2A08", "#6A4A18", "#1A1004"], 80, 55, 90, 280, 10],
    ],
  },
  "ghost-reserve": {
    lines: ["Ghost", "Reserve"],
    line: "Fermented for ninety days. Respect every drop.",
    props: [
      ["bhut", ["#D4281A", "#FF7A5A", "#0F0402"], 160, 20, 26, 150, -28],
      ["bhut", ["#B01E12", "#F0624A", "#0F0402"], 120, 74, 22, -180, 30],
      ["flame", ["#F26A1B", "#FFC13B"], 90, 68, 73, 230, 10],
      ["smoke", ["#F2EBDD"], 170, 31, 11, -300, -8],
      ["spark", ["#D9A21B"], 40, 13, 58, 120, 0],
      ["spark", ["#D9A21B"], 28, 80, 52, -100, 20],
      ["spark", ["#D9A21B"], 22, 52, 89, 300, 0],
      ["spark", ["#D9A21B"], 24, 40, 18, -50, 0],
    ],
  },
};

export const heroSlides = flavors.map((f) => ({
  ...f,
  ...extra[f.id],
  props: extra[f.id].props.map(prop),
}));