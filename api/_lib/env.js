/* global process */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

if ((!process.env.STRIPE_SECRET_KEY || !process.env.DATABASE_URL) && typeof process.loadEnvFile === "function") {
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) process.loadEnvFile(envPath);
}
