import { sql } from "../_lib/db.js";
import { getStripe } from "../_lib/stripe.js";

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const stale = await sql`
      SELECT id, no, provider_ref, charge_amount
      FROM orders
      WHERE status = 'pending' AND created_at < now() - interval '24 hours'
      ORDER BY created_at
      LIMIT 50`;

    const out = { checked: stale.length, paid: 0, cancelled: 0, skipped: 0 };

    for (const o of stale) {
      try {
        // Never reached the payment step
        if (!o.provider_ref) {
          await sql`UPDATE orders SET status = 'cancelled' WHERE id = ${o.id} AND status = 'pending'`;
          out.cancelled++;
          continue;
        }

        const stripe = getStripe();
        const pi = await stripe.paymentIntents.retrieve(o.provider_ref);

        if (pi.status === "succeeded") {
          if (pi.amount_received === o.charge_amount) {
            await sql`
              UPDATE orders SET status = 'paid', paid_at = now()
              WHERE id = ${o.id} AND status = 'pending'`;
            out.paid++; // the webhook was missed
          } else {
            console.error(`Order ${o.no}: paid amount mismatch. Left pending for a human.`);
            out.skipped++;
          }
          continue;
        }

        if (pi.status !== "canceled") await stripe.paymentIntents.cancel(pi.id);
        await sql`UPDATE orders SET status = 'cancelled' WHERE id = ${o.id} AND status = 'pending'`;
        out.cancelled++;
      } catch (err) {
        console.error(`Cleanup failed for order ${o.no}:`, err.message);
        out.skipped++; // stays pending, tried again tomorrow
      }
    }

    return res.status(200).json(out);
  } catch (err) {
    console.error("Cleanup job failed:", err);
    return res.status(500).json({ error: "Cleanup failed." });
  }
}