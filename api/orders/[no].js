import { sql } from "../_lib/db.js";
import { safeEqual, toOrder } from "../_lib/orders.js";

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
    return res.status(200).json(toOrder(row));
  } catch (err) {
    console.error("GET /api/orders failed:", err);
    return res.status(500).json({ error: "Something went wrong on our side." });
  }
}