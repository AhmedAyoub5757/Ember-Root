import "../_lib/env.js";
import { sql } from "../_lib/db.js";
import { requireAdmin } from "../_lib/admin.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await requireAdmin(req, res);
    if (!user) return;
    const [orders, contacts, subscribers, users] = await Promise.all([
      sql`SELECT no, status, method, total, contact, created_at FROM orders ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT id, name, email, topic, message, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT id, email, flavors, batch_no, source, created_at FROM batch_subscribers ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT id, name, email, role, member_no, created_at FROM users ORDER BY created_at DESC LIMIT 100`,
    ]);
    return res.status(200).json({ orders, contacts, subscribers, users });
  } catch (err) {
    console.error("GET /api/admin/dashboard failed:", err);
    return res.status(500).json({ error: "Unable to load the dashboard." });
  }
}
