// Picks readable text color (paper or soil) for any background hex
export function inkFor(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1F1A14" : "#F2EBDD";
}