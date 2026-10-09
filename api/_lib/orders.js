import { timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import { etaFor } from "../../src/data/checkout.js";

// DB row -> the shape the confirmation page already expects
export const toOrder = (r) => ({
  no: String(r.no),
  status: r.status,
  placedAt: new Date(r.created_at).toISOString(),
  method: r.method,
  note: r.note || "",
  eta: etaFor(r.ship_to.country),
  contact: r.contact,
  ship: r.ship_to,
  items: r.items,
  money: { sub: r.sub, ship: r.ship, fee: r.fee, total: r.total },
  charge: r.charge_amount ? { amount: r.charge_amount, currency: r.charge_currency } : null,
});

export const safeEqual = (a, b) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
