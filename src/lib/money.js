import { sizes } from "../data/productExtra.js";
import { flavors } from "../data/products.js";

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

export const COD_FEE = 100;     // PLACEHOLDER handling fee. Set to 0 to disable.
export const INTL_SHIP = 2500;  // PLACEHOLDER flat international rate

// Display-only. The backend recomputes this from the cart.
export function quote(items, { country = "PK", method = "cod" } = {}) {
  const base = totals(items);
  const domestic = country === "PK";
  const ship = base.sub === 0 ? 0 : domestic ? base.ship : INTL_SHIP;
  const fee = method === "cod" && domestic && base.sub > 0 ? COD_FEE : 0;
  return { ...base, ship, fee, total: base.sub + ship + fee };
}

export const PKR_PER_USD = 280; // PLACEHOLDER test rate

export const toUsdCents = (pkr) => Math.round((pkr / PKR_PER_USD) * 100);
export const fmtUsd = (cents) => `$${(cents / 100).toFixed(2)}`;