// Torn bottom edge, as a clip-path
export const zigzag = (teeth = 22, depth = 9) =>
  `polygon(0 0, 100% 0, ${Array.from({ length: teeth * 2 + 1 }, (_, i) =>
    `${(100 - (i * 100) / (teeth * 2)).toFixed(2)}% ${i % 2 ? `calc(100% - ${depth}px)` : "100%"}`
  ).join(", ")})`;