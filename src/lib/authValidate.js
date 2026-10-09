export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const COMMON = new Set([
  "password12", "password123", "password1234", "passw0rd123", "1234567890",
  "12345678910", "0123456789", "0000000000", "1111111111", "qwertyuiop",
  "qwerty12345", "1q2w3e4r5t", "iloveyou123", "letmein1234", "welcome1234",
  "admin12345", "abc1234567", "emberandroot",
]);

export const strengthWords = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"];

// A visual heuristic (length first, then variety). It is not a security guarantee.
export function strength(pw) {
  if (!pw || pw.length < PASSWORD_MIN) return 0;
  if (COMMON.has(pw.toLowerCase())) return 1;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  let s = 1;
  if (pw.length >= 14) s += 1;
  if (pw.length >= 18) s += 1;
  if (classes >= 2) s += 1;
  if (classes >= 3) s += 1;
  if (new Set(pw).size < 5) s = Math.min(s, 1); // "aaaaaaaaaa"
  return s;
}

export function validateAuth({ mode, name = "", email = "", password = "" }) {
  const e = {};
  const n = name.trim();
  const m = email.trim();

  if (mode === "signup" && (n.length < 2 || n.length > 60)) {
    e.name = "Tell us what to call you (2 to 60 characters).";
  }
  if (!EMAIL.test(m) || m.length > 120) e.email = "That doesn't look like an email address.";

  if (mode === "signup") {
    if (password.length < PASSWORD_MIN) e.password = `Use at least ${PASSWORD_MIN} characters. A short phrase works well.`;
    else if (password.length > PASSWORD_MAX) e.password = `Use at most ${PASSWORD_MAX} characters.`;
    else if (COMMON.has(password.toLowerCase())) e.password = "That password is too common. Try a short phrase instead.";
  } else if (!password) {
    e.password = "Enter your password.";
  }
  return e;
}