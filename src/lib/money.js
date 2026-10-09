import { sizes } from "../data/productExtra.js";
import { flavors } from "../data/products.js";
import { BUNDLES, MESSAGE_MAX } from "../data/bundles.js";

export const fmt = (n) => `Rs ${n.toLocaleString("en-US")}`;

// base price is for 150 ml, rounded to the nearest Rs 10
export function unitPrice(flavor, sizeId) {
  const s = sizes.find((x) => x.id === sizeId);
  return Math.round((flavor.price * s.mult) / 10) * 10;
}

export function cleanMessage(s) {
  const withoutControls = [...String(s ?? "")]
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 31 && (code < 127 || code > 159);
    })
    .join("");
  return withoutControls.replace(/\s+/g, " ").trim().slice(0, MESSAGE_MAX);
}

export function lineKey(item) {
  if (item?.kind === "bundle") {
    const picks = BUNDLES[item.id]?.type === "set"
      ? []
      : Array.isArray(item.picks) ? [...item.picks].sort() : [];
    const size = BUNDLES[item.id]?.type === "set" ? BUNDLES[item.id].size : item.size;
    return `u:${item.id}:${size}:${picks.join("+")}:${cleanMessage(item.message)}`;
  }
  return `b:${item?.id}:${item?.size}`;
}

export function resolveItem(item) {
  const qty = item?.qty;
  if (!Number.isInteger(qty) || qty < 1 || qty > 12) return null;

  if (item?.kind !== "bundle") {
    const f = flavors.find((x) => x.id === item?.id);
    const sizeObj = sizes.find((x) => x.id === item?.size);
    if (!f || !sizeObj) return null;
    const unit = unitPrice(f, sizeObj.id);
    return {
      key: lineKey(item),
      kind: "bottle",
      id: f.id,
      name: f.name,
      qty,
      unit,
      full: unit,
      size: sizeObj.id,
      sizeObj,
      parts: [],
      f,
      message: "",
    };
  }

  const def = BUNDLES[item.id];
  if (!def) return null;
  const size = def.type === "set" ? def.size : item.size;
  const sizeObj = sizes.find((x) => x.id === size);
  if (!sizeObj || (def.type === "pick" && !def.sizes.includes(size))) return null;

  const ids = def.type === "set" ? def.flavors : item.picks;
  if (
    def.type === "pick" &&
    (!Array.isArray(ids) ||
      ids.length !== def.count ||
      new Set(ids).size !== ids.length)
  ) return null;
  if (!Array.isArray(ids) || ids.length === 0) return null;

  const parts = ids.map((id) => flavors.find((x) => x.id === id));
  if (parts.some((part) => !part)) return null;
  const full = parts.reduce((sum, part) => sum + unitPrice(part, sizeObj.id), 0);
  const unit = Math.round((full * (1 - def.discount)) / 10) * 10;
  const normalized = {
    ...item,
    kind: "bundle",
    size: sizeObj.id,
    picks: def.type === "pick" ? [...ids].sort() : [],
    message: cleanMessage(item.message),
  };
  return {
    key: lineKey(normalized),
    kind: "bundle",
    id: def.id,
    name: def.name,
    qty,
    unit,
    full,
    size: sizeObj.id,
    sizeObj,
    parts,
    f: undefined,
    message: normalized.message,
  };
}

export const FREE_SHIP = 5000;
export const SHIP_FEE = 300;

export function totals(items) {
  let sub = 0, count = 0;
  for (const i of items) {
    const resolved = resolveItem(i);
    if (!resolved) continue; // ignore stale ids left in localStorage
    sub += resolved.unit * resolved.qty;
    count += resolved.qty;
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