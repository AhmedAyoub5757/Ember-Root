/* global process */
import "../api/_lib/env.js";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const sql = neon(databaseUrl);

  console.log("Connecting to database and running migrations...");

  const schemaSql = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  const contactSql = readFileSync(join(__dirname, "contact-newsletter.sql"), "utf-8");

  const stmts = [
    ...schemaSql.split(";").map(s => s.trim()).filter(Boolean),
    ...contactSql.split(";").map(s => s.trim()).filter(Boolean)
  ];

  for (const stmt of stmts) {
    console.log("Running statement:", stmt.slice(0, 40) + "...");
    await sql.query(stmt);
  }

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log("Current tables in Neon DB:", tables.map(t => t.table_name));
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
