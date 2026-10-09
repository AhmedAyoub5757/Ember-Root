/* global Buffer */
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { sql } from "./db.js";

const scryptAsync = promisify(scrypt);
const COOKIE = "er_session";
const N = 32768, R = 8, P = 3, KEYLEN = 64;
const maxmem = (n, r) => 128 * n * r * 2;
const sha = (t) => createHash("sha256").update(t).digest("hex");

/* ---------- passwords ---------- */
export async function hashPassword(pw) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(pw, salt, KEYLEN, { N, r: R, p: P, maxmem: maxmem(N, R) });
  return ["scrypt", N, R, P, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(pw, stored) {
  const [scheme, n, r, p, saltB64, hashB64] = String(stored).split("$");
  if (scheme !== "scrypt") return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scryptAsync(pw, Buffer.from(saltB64, "base64"), expected.length, {
    N: +n, r: +r, p: +p, maxmem: maxmem(+n, +r),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Verified against when the email doesn't exist, so timing doesn't reveal it
let dummy;
export const dummyHash = () => (dummy ??= hashPassword("not-a-real-password"));

/* ---------- cookies and sessions ---------- */
function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie ?? "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

function setCookie(req, res, value, maxAge) {
  const secure = String(req.headers["x-forwarded-proto"] ?? "").split(",")[0] === "https";
  const parts = [`${COOKIE}=${value}`, "Path=/", "HttpOnly", "SameSite=Lax"];
  if (secure) parts.push("Secure");
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  res.setHeader("Set-Cookie", parts.join("; "));
}

// remember = 30 days (persistent cookie). Otherwise a browser-session cookie, 24 h on the server.
export async function startSession(req, res, userId, remember) {
  const token = randomBytes(32).toString("base64url");
  const ttl = remember ? 30 * 86400 : 86400;
  const expires = new Date(Date.now() + ttl * 1000).toISOString();
  await sql`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (${sha(token)}, ${userId}, ${expires}::timestamptz)`;
  await sql`DELETE FROM sessions WHERE expires_at < now()`;
  setCookie(req, res, token, remember ? ttl : undefined);
}

export async function clearSession(req, res) {
  const token = parseCookies(req)[COOKIE];
  if (token) await sql`DELETE FROM sessions WHERE token_hash = ${sha(token)}`;
  setCookie(req, res, "", 0);
}

// Used by the orders endpoint too: returns the signed-in user, or null
export async function getUser(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const [row] = await sql`
    SELECT u.id, u.email, u.name, u.member_no, u.role
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${sha(token)} AND s.expires_at > now()`;
  return row ?? null;
}

export const publicUser = (u) => ({
  id: u.id, name: u.name, email: u.email, memberNo: u.member_no, role: u.role,
});

export const isAdmin = (u) => u?.role === "admin";

/* ---------- request hygiene ---------- */
export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser clients. SameSite still protects cookies.
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

export const clientIp = (req) =>
  String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "unknown";

/* ---------- rate limiting ---------- */
export async function tooMany(key, limit, minutes) {
  const since = new Date(Date.now() - minutes * 60_000).toISOString();
  const [row] = await sql`
    SELECT count(*)::int AS n FROM auth_attempts
    WHERE key = ${key} AND at > ${since}::timestamptz`;
  return row.n >= limit;
}

export async function recordAttempt(key) {
  await sql`INSERT INTO auth_attempts (key) VALUES (${key})`;
  await sql`DELETE FROM auth_attempts WHERE at < now() - interval '1 day'`;
}

export const clearAttempts = (key) => sql`DELETE FROM auth_attempts WHERE key = ${key}`;