import { sizes } from "../data/productExtra";

export const fmt = (n) => `Rs ${n.toLocaleString("en-US")}`;

// base price is for 150 ml, rounded to the nearest Rs 10
export function unitPrice(flavor, sizeId) {
  const s = sizes.find((x) => x.id === sizeId);
  return Math.round((flavor.price * s.mult) / 10) * 10;
}