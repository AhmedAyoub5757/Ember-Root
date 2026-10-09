import { sql } from "../_lib/db.js";
import { safeEqual } from "../_lib/orders.js";

const notFound = (res) => res.status(404).json({ error: "Order not found." });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const b = req.body ?? {};
    const no = Number(String(b.no ?? "").replace(/\D/g, ""));
    const email = String(b.email ?? "").trim().toLowerCase().slice(0, 120);
    if (!Number.isInteger(no) || no <= 0 || no > 2147483647 || !email) return notFound(res);

    const [row] = await sql`SELECT token, contact FROM orders WHERE no = ${no}`;
    const stored = String(row?.contact?.email ?? "").toLowerCase();

    // Same answer for "no such order" and "wrong email"
    if (!row || !stored || !safeEqual(stored, email)) return notFound(res);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ token: row.token });
  } catch (err) {
    console.error("POST /api/orders/lookup failed:", err);
    return res.status(500).json({ error: "Something went wrong on our side." });
  }
}