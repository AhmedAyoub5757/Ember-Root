/* global process */
import "./env.js";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
const client = databaseUrl ? neon(databaseUrl) : null;

// Keep the API module loadable so handlers can return their standard error response.
export const sql = (...args) => {
  if (!client) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return client(...args);
};