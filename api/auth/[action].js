/* global process */
import { sql } from "../_lib/db.js";
import { sendAdminEmail } from "../_lib/resend.js";
import { toOrder } from "../_lib/orders.js";
import {
  clearAttempts, clearSession, clientIp, dummyHash, getUser, hashPassword, publicUser,
  recordAttempt, sameOrigin, startSession, tooMany, verifyPassword,
} from "../_lib/auth.js";
import { PASSWORD_MAX, validateAuth } from "../../src/lib/authValidate.js";

const s = (x, max) => String(x ?? "").trim().slice(0, max);

async function login(req, res) {
  const b = req.body ?? {};
  const email = s(b.email, 120).toLowerCase();
  const password = typeof b.password === "string" ? b.password : "";
  const ip = clientIp(req);
  const eKey = `login:e:${email}`;
  const iKey = `login:i:${ip}`;

  if ((await tooMany(eKey, 8, 15)) || (await tooMany(iKey, 25, 15))) {
    return res.status(429).json({ error: "Too many attempts. Please wait a few minutes and try again." });
  }

  const bad = async () => {
    await recordAttempt(eKey);
    await recordAttempt(iKey);
    return res.status(401).json({ error: "That email and password don't match." });
  };

  if (!email || !password || password.length > PASSWORD_MAX) return bad();

  const [u] = await sql`
    SELECT id, email, name, member_no, role, password_hash FROM users WHERE email = ${email}`;
  const ok = u
    ? await verifyPassword(password, u.password_hash)
    : (await verifyPassword(password, await dummyHash()), false);
  if (!ok) return bad();

  await clearAttempts(eKey);
  await startSession(req, res, u.id, b.remember === true);
  return res.status(200).json({ user: publicUser(u) });
}

async function signup(req, res) {
  const b = req.body ?? {};
  const v = {
    name: s(b.name, 60),
    email: s(b.email, 120).toLowerCase(),
    password: typeof b.password === "string" ? b.password : "",
  };

  const iKey = `signup:i:${clientIp(req)}`;
  if (await tooMany(iKey, 10, 60)) {
    return res.status(429).json({ error: "Too many sign-ups from this connection. Please try again later." });
  }
  await recordAttempt(iKey);

  const fields = validateAuth({ mode: "signup", ...v });
  if (Object.keys(fields).length) {
    return res.status(422).json({ error: "Please check the highlighted fields.", fields });
  }

  const hash = await hashPassword(v.password);
  const [u] = await sql`
    INSERT INTO users (email, name, password_hash, role)
    VALUES (${v.email}, ${v.name}, ${hash}, CASE WHEN ${v.email} = ${process.env.ADMIN_EMAIL || "ahmed42.dev@gmail.com"} THEN 'admin' ELSE 'customer' END)
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, name, member_no, role`;

  if (!u) {
    return res.status(409).json({
      error: "An account with this email already exists.",
      fields: { email: "An account with this email already exists. Try signing in." },
    });
  }

  await startSession(req, res, u.id, b.remember === true);
  sendAdminEmail(
    "New account created",
    `Name: ${u.name}\nEmail: ${u.email}\nRole: ${u.role}`,
  ).catch((err) => console.error("Failed to send admin signup notification:", err));
  return res.status(201).json({ user: publicUser(u) });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const action = String(req.query.action ?? "");

  try {
    if (req.method === "GET") {
      if (action === "me") {
        const u = await getUser(req);
        return res.status(200).json({ user: u ? publicUser(u) : null });
      }
      if (action === "orders") {
        const u = await getUser(req);
        if (!u) return res.status(401).json({ error: "Please sign in." });
        const rows = await sql`
          SELECT * FROM orders WHERE user_id = ${u.id} ORDER BY created_at DESC LIMIT 50`;
        return res.status(200).json({ orders: rows.map((r) => ({ ...toOrder(r), token: r.token })) });
      }
      return res.status(404).json({ error: "Not found." });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed." });
    }
    if (!sameOrigin(req)) return res.status(403).json({ error: "Request blocked." });
    if (!String(req.headers["content-type"] ?? "").includes("application/json")) {
      return res.status(415).json({ error: "Unsupported content type." });
    }

    if (action === "login") return await login(req, res);
    if (action === "signup") return await signup(req, res);
    if (action === "logout") {
      await clearSession(req, res);
      return res.status(200).json({ ok: true });
    }
    return res.status(404).json({ error: "Not found." });
  } catch (err) {
    console.error(`/api/auth/${action} failed:`, err);
    return res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
}