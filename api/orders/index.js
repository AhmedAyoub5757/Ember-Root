import { randomBytes } from "node:crypto";
import { sql } from "../_lib/db.js";
import { getStripe } from "../_lib/stripe.js";
import { toOrder } from "../_lib/orders.js";
import { countries } from "../../src/data/checkout.js";
import { quote, resolveItem, toUsdCents } from "../../src/lib/money.js";
import { validate } from "../../src/lib/validate.js";

const METHODS = ["cod", "card", "paypal", "easypaisa"];
const CODES = new Set(countries.map(([code]) => code));
const s = (x, max = 200) => String(x ?? "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const b = req.body ?? {};
    const method = s(b.method, 20);
    const v = {
      name: s(b.name, 100),
      email: s(b.email, 120).toLowerCase(),
      phone: s(b.phone, 30),
      country: s(b.country, 2).toUpperCase(),
      address: s(b.address, 200),
      city: s(b.city, 80),
      province: s(b.province, 80),
      postal: s(b.postal, 20),
      wallet: s(b.wallet, 30),
    };
    const note = s(b.note, 300);

    if (!METHODS.includes(method)) {
      return res.status(422).json({ error: "Unknown payment method." });
    }
    if (!CODES.has(v.country)) {
      return res.status(422).json({
        error: "We don't ship to that country yet.",
        fields: { country: "Choose a country from the list." },
      });
    }
    if (v.country !== "PK" && (method === "cod" || method === "easypaisa")) {
      return res.status(422).json({ error: "That payment method is only available in Pakistan." });
    }

    // Rebuild the cart from IDs only. Prices always come from our own catalog.
    const raw = Array.isArray(b.items) ? b.items.slice(0, 20) : [];
    if (raw.length === 0) return res.status(422).json({ error: "Your cart is empty." });

    const normalizedItems = [];
    const lines = [];
    for (const it of raw) {
      const input = {
        kind: it?.kind === "bundle" ? "bundle" : "bottle",
        id: it?.id,
        size: it?.size,
        picks: Array.isArray(it?.picks) ? it.picks : [],
        message: it?.message,
        qty: it?.qty,
      };
      const resolved = resolveItem(input);
      if (!resolved) {
        return res.status(422).json({ error: "Something in your cart is out of date. Please add it again." });
      }
      normalizedItems.push({
        kind: resolved.kind,
        id: resolved.id,
        size: resolved.size,
        picks: resolved.parts.map((part) => part.id),
        message: resolved.message,
        qty: resolved.qty,
      });
      lines.push({
        kind: resolved.kind,
        id: resolved.id,
        name: resolved.name,
        size: resolved.size,
        ...(resolved.kind === "bottle" ? { ml: resolved.sizeObj.ml } : {}),
        qty: resolved.qty,
        unit: resolved.unit,
        full: resolved.full,
        parts: resolved.parts.map((part) => part.name),
        message: resolved.message,
      });
    }

    const fields = validate(v, method);
    if (Object.keys(fields).length) {
      return res.status(422).json({ error: "Please check the highlighted fields.", fields });
    }

    if (!["cod", "card"].includes(method)) {
      return res.status(501).json({
        error: "That payment method is connected in a later step. Use Cash on delivery or Card for now.",
      });
    }

    const q = quote(normalizedItems, { country: v.country, method });
    const isCard = method === "card";
    const chargeAmount = isCard ? toUsdCents(q.total) : null;
    const chargeCurrency = isCard ? "usd" : null;
    const token = randomBytes(16).toString("hex");
    const contact = { name: v.name, email: v.email, phone: v.phone };
    const shipTo = {
      address: v.address, city: v.city, province: v.province, postal: v.postal, country: v.country,
    };

    const [row] = await sql`
      INSERT INTO orders (
        token, status, method, currency, sub, ship, fee, total,
        contact, ship_to, note, items, charge_currency, charge_amount
      )
      VALUES (
        ${token}, ${isCard ? "pending" : "cod"}, ${method}, 'PKR',
        ${q.sub}, ${q.ship}, ${q.fee}, ${q.total},
        ${JSON.stringify(contact)}::jsonb, ${JSON.stringify(shipTo)}::jsonb,
        ${note}, ${JSON.stringify(lines)}::jsonb,
        ${chargeCurrency}, ${chargeAmount}
      )
      RETURNING *`;

    if (!isCard) return res.status(201).json({ order: toOrder(row), token });

    // Card: create the PaymentIntent for exactly the amount we just saved
    try {
      const pi = await getStripe().paymentIntents.create(
        {
          amount: chargeAmount,
          currency: "usd",
          description: `Ember & Root order #${row.no}`,
          metadata: { order_no: String(row.no) },
        },
        { idempotencyKey: `order-${row.no}` }
      );
      const [updated] = await sql`
        UPDATE orders SET provider_ref = ${pi.id} WHERE id = ${row.id} RETURNING *`;
      return res.status(201).json({ order: toOrder(updated), token, clientSecret: pi.client_secret });
    } catch (err) {
      console.error("Stripe PaymentIntent failed:", err);
      await sql`UPDATE orders SET status = 'failed' WHERE id = ${row.id}`;
      return res.status(502).json({
        error: "We couldn't start the card payment. Nothing was charged. Please try again.",
      });
    }
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return res.status(500).json({ error: "Something went wrong on our side. Nothing was charged." });
  }
}