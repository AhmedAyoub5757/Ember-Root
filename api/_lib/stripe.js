/* global process */
import "./env.js";
import Stripe from "stripe";

let client;
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set in .env.local");
  }
  return (client ??= new Stripe(process.env.STRIPE_SECRET_KEY));
}