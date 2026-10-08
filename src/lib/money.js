import { sizes } from "../data/productExtra";
import { flavors } from "../data/products";

export const fmt = (n) => `Rs ${n.toLocaleString("en-US")}`;

// base price is for 150 ml, rounded to the nearest Rs 10
export function unitPrice(flavor, sizeId) {
  const s = sizes.find((x) => x.id === sizeId);
  return Math.round((flavor.price * s.mult) / 10) * 10;
}

export const FREE_SHIP = 5000;
export const SHIP_FEE = 300;

export function totals(items) {
  let sub = 0, count = 0;
  for (const i of items) {
    const f = flavors.find((x) => x.id === i.id);
    if (!f) continue; // ignore stale ids left in localStorage
    sub += unitPrice(f, i.size) * i.qty;
    count += i.qty;
  }
  const ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_FEE;
  return { sub, count, ship, total: sub + ship, left: Math.max(0, FREE_SHIP - sub) };
}