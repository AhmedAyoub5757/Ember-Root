/* global process */
import "../_lib/env.js";
import { sql } from "../_lib/db.js";
import { getStripe } from "../_lib/stripe.js";

export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return new Response("Webhook is not configured", { status: 400 });
  }
  if (!secret.startsWith("whsec_")) {
    console.error("Webhook is misconfigured: STRIPE_WEBHOOK_SECRET must be the whsec_ value from stripe listen.");
    return new Response("Webhook is not configured", { status: 400 });
  }

  const body = await request.text(); // raw, never parsed

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("Rejected webhook, bad signature:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const rows = await sql`
        UPDATE orders
        SET status = 'paid', paid_at = now()
        WHERE provider_ref = ${pi.id}
          AND status = 'pending'
          AND charge_amount = ${pi.amount_received}
        RETURNING no`;
      console.log(
        rows.length
          ? `Order ${rows[0].no} marked paid`
          : `PaymentIntent ${pi.id}: nothing to update (already paid, unknown, or amount mismatch)`
      );
    } else if (event.type === "payment_intent.payment_failed") {
      console.log(`Payment attempt failed for ${event.data.object.id}. The customer may retry.`);
    }
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return new Response("Handler error", { status: 500 }); // a 500 makes Stripe retry later
  }

  return Response.json({ received: true });
}