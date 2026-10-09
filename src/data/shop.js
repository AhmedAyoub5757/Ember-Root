export const heatLevels = [
  { n: 1, word: "Gentle" },
  { n: 2, word: "Warm" },
  { n: 3, word: "Hot" },
  { n: 4, word: "Fierce" },
  { n: 5, word: "Reckless" },
];

const byNo = (a, b) => a.no.localeCompare(b.no);

export const sorts = [
  { id: "index",     label: "Index",   fn: byNo },
  { id: "heat-asc",  label: "Mildest", fn: (a, b) => a.heat - b.heat || byNo(a, b) },
  { id: "heat-desc", label: "Hottest", fn: (a, b) => b.heat - a.heat || byNo(a, b) },
  { id: "price-asc", label: "Price",   fn: (a, b) => a.price - b.price || byNo(a, b) },
];