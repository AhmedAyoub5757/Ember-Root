// Picks readable text color (paper or soil) for any background hex
export function inkFor(hex) {
  const [r, g, b] = parseColor(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1F1A14" : "#F2EBDD";
}

export function parseColor(str) {
  if (str.startsWith("#")) {
    const n = parseInt(str.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }

  const match = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/);
  if (match) return match.slice(1).map(Number);

  throw new Error(`Unsupported color format: ${str}`);
}

export function mixColors(a, b, t) {
  const A = parseColor(a), B = parseColor(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

export function mixHex(a, b, t) {
  return mixColors(a, b, t);
}