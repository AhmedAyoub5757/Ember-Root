import { sql } from "../_lib/db.js";
import { getStripe } from "../_lib/stripe.js";
import { safeEqual, toOrder } from "../_lib/orders.js";

// If a card order is still pending, ask Stripe directly whether it was paid.
async function reconcile(row) {
  if (row.status !== "pending" || row.method !== "card" || !row.provider_ref) return row;

  try {
    const pi = await getStripe().paymentIntents.retrieve(row.provider_ref);
    console.log(
      `reconcile order ${row.no}: stripe=${pi.status} received=${pi.amount_received} expected=${row.charge_amount}`
    );
    if (pi.status === "succeeded" && pi.amount_received === row.charge_amount) {
      await sql`
        UPDATE orders SET status = 'paid', paid_at = now()
        WHERE id = ${row.id} AND status = 'pending'`;
      const [fresh] = await sql`SELECT * FROM orders WHERE id = ${row.id}`;
      return fresh ?? row;
    }
  } catch (err) {
    console.error(`Reconcile failed for order ${row.no}:`, err.message);
  }
  return row;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const no = Number(req.query.no);
    const token = String(req.query.t ?? "");
    if (!Number.isInteger(no) || !token) return res.status(404).json({ error: "Order not found." });

    const [row] = await sql`SELECT * FROM orders WHERE no = ${no}`;

    // Same answer for "doesn't exist" and "wrong token", so numbers can't be probed
    if (!row || !safeEqual(row.token, token)) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Orders-Handler", "reconcile-v2"); // deployment marker
    return res.status(200).json(toOrder(await reconcile(row)));
  } catch (err) {
    console.error("GET /api/orders failed:", err);
    return res.status(500).json({ error: "Something went wrong on our side." });
  }
}