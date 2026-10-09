/* global process */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

if (typeof process.loadEnvFile === "function") {
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // ignore if already loaded or on error
    }
  }
}
