import { getUser, isAdmin } from "./auth.js";

export async function requireAdmin(req, res) {
  const user = await getUser(req);
  if (!user) {
    res.status(401).json({ error: "Please sign in." });
    return null;
  }
  if (!isAdmin(user)) {
    res.status(403).json({ error: "Admin access required." });
    return null;
  }
  return user;
}
