/* global process */
import "./env.js";
import { Resend } from "resend";
import { countryName, methodName, etaFor } from "../../src/data/checkout.js";
import { fmt } from "../../src/lib/money.js";

let resendClient = null;

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Ember & Root <onboarding@resend.dev>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ahmed42.dev@gmail.com";

/**
 * Sends an email safely using Resend or logs to console if no API key is set.
 */
export async function sendEmail({ to, subject, html, text, from = FROM_EMAIL }) {
  const resend = getResend();
  if (!resend) {
    console.log(`[Resend Mock] API key not set. Email simulation:\nTo: ${to}\nSubject: ${subject}\n`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    return { success: true, data };
  } catch (err) {
    console.error("[Resend Error] Failed to send email:", err);
    return { success: false, error: err.message };
  }
}

export function sendAdminEmail(subject, text) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Admin] ${subject}`,
    text,
    html: `<div style="font-family:sans-serif;white-space:pre-wrap">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`,
  });
}

/**
 * Generates and sends an order confirmation email to the customer.
 */
export async function sendOrderConfirmationEmail(order) {
  if (!order || !order.contact?.email) return;

  const to = order.contact.email;
  const name = order.contact.name || "Customer";
  const firstName = name.split(" ")[0];
  const orderNo = order.no;
  const eta = order.eta || etaFor(order.ship?.country || "PK");
  const country = countryName[order.ship?.country] || order.ship?.country || "";
  const paymentMethod = methodName[order.method] || order.method;

  const subject = `Order Confirmation #${orderNo} — Ember & Root`;

  const itemRowsHtml = (order.items || [])
    .map((item) => {
      const partsText = item.parts && item.parts.length > 0 ? `<div style="font-size:12px;color:#786E60;margin-top:2px;">${item.parts.join(" · ")}</div>` : "";
      const messageText = item.message ? `<div style="font-size:12px;font-style:italic;color:#786E60;margin-top:2px;">Card note: “${item.message}”</div>` : "";
      const sizeText = item.kind !== "bundle" && item.ml ? ` (${item.ml} ml)` : "";

      return `
        <tr style="border-bottom: 1px dotted #E5DFC8;">
          <td style="padding: 10px 0; vertical-align: top;">
            <strong style="color: #1F1A14; font-weight: 600;">${item.qty} × ${item.name}</strong>${sizeText}
            ${partsText}
            ${messageText}
          </td>
          <td style="padding: 10px 0; vertical-align: top; text-align: right; font-family: monospace; white-space: nowrap; color: #1F1A14;">
            ${fmt(item.unit * item.qty)}
          </td>
        </tr>
      `;
    })
    .join("");

  const itemRowsText = (order.items || [])
    .map((item) => {
      const size = item.kind !== "bundle" && item.ml ? ` (${item.ml} ml)` : "";
      return `- ${item.qty}x ${item.name}${size} — ${fmt(item.unit * item.qty)}`;
    })
    .join("\n");

  const feeRowHtml = order.money?.fee > 0
    ? `<tr><td style="padding:4px 0;color:#786E60;">Cash handling</td><td style="text-align:right;font-family:monospace;color:#1F1A14;">${fmt(order.money.fee)}</td></tr>`
    : "";

  const paymentInstruction = order.method === "cod"
    ? `Please have <strong>${fmt(order.money.total)}</strong> in cash ready upon delivery.`
    : order.status === "paid"
    ? `Your payment has been successfully received and confirmed.`
    : `Payment status: ${order.status}.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${orderNo}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EEDC; color: #1F1A14; line-height: 1.6;">
  <div style="max-width: 580px; margin: 0 auto; background: #FAF5E8; border: 1px solid #E2DCB9; padding: 32px 28px; border-radius: 4px; box-shadow: 0 4px 14px rgba(31, 26, 20, 0.06);">
    
    <!-- Brand Header -->
    <div style="border-bottom: 2px solid #1F1A14; padding-bottom: 16px; margin-bottom: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: #1F1A14;">
        Ember &amp; Root
      </h1>
      <p style="margin: 4px 0 0; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #786E60;">
        Order Slip · No. ${orderNo}
      </p>
    </div>

    <!-- Greeting & Status -->
    <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #1F1A14;">
      Thank you, ${firstName}.
    </h2>
    <p style="margin: 0 0 20px; font-size: 15px; color: #3B332A;">
      We've received your order and are getting your bottles ready.
    </p>

    <div style="background: #EFE8D3; border-left: 3px solid #C83E29; padding: 12px 16px; margin-bottom: 24px; font-size: 14px; color: #1F1A14;">
      ${paymentInstruction}
    </div>

    <!-- Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
      <thead>
        <tr style="border-bottom: 1px solid #1F1A14; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #786E60;">
          <th style="text-align: left; padding-bottom: 6px;">Item</th>
          <th style="text-align: right; padding-bottom: 6px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRowsHtml}
      </tbody>
    </table>

    <!-- Totals -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
      <tr>
        <td style="padding: 4px 0; color: #786E60;">Subtotal</td>
        <td style="text-align: right; font-family: monospace; color: #1F1A14;">${fmt(order.money.sub)}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #786E60;">Shipping</td>
        <td style="text-align: right; font-family: monospace; color: #1F1A14;">${order.money.ship === 0 ? "Free" : fmt(order.money.ship)}</td>
      </tr>
      ${feeRowHtml}
      <tr style="border-top: 1px solid #1F1A14;">
        <td style="padding: 10px 0 0; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Total</td>
        <td style="padding: 10px 0 0; text-align: right; font-family: monospace; font-size: 18px; font-weight: 700; color: #1F1A14;">${fmt(order.money.total)}</td>
      </tr>
    </table>

    <!-- Shipping & Delivery Details -->
    <div style="border-top: 1px dashed #D6CEA8; padding-top: 20px; margin-bottom: 24px; font-size: 13px; line-height: 1.5;">
      <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; color: #786E60;">
        Ship To
      </p>
      <div style="color: #1F1A14;">
        <strong>${order.contact.name}</strong><br>
        ${order.ship.address}<br>
        ${[order.ship.city, order.ship.province, order.ship.postal].filter(Boolean).join(", ")}<br>
        ${country}<br>
        <span style="color: #786E60;">Phone: ${order.contact.phone}</span>
        ${order.note ? `<br><em style="color:#786E60; margin-top: 4px; display: inline-block;">Note: “${order.note}”</em>` : ""}
      </div>
      <p style="margin: 14px 0 0; color: #786E60;">
        Estimated delivery: <strong style="color: #1F1A14;">${eta}</strong>
      </p>
      <p style="margin: 4px 0 0; color: #786E60;">
        Payment method: <strong style="color: #1F1A14;">${paymentMethod}</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #1F1A14; padding-top: 16px; text-align: center; font-size: 12px; color: #786E60;">
      <p style="margin: 0 0 4px;">Ember &amp; Root — Single Estate Fermented Chilies</p>
      <p style="margin: 0;">Need to change something? Reply directly to this email or visit our website.</p>
    </div>

  </div>
</body>
</html>
  `.trim();

  const text = `
Ember & Root
Order Confirmation #${orderNo}

Thank you, ${firstName}! We have received your order.

Order Summary:
${itemRowsText}

Subtotal: ${fmt(order.money.sub)}
Shipping: ${order.money.ship === 0 ? "Free" : fmt(order.money.ship)}
${order.money.fee > 0 ? `Cash handling: ${fmt(order.money.fee)}\n` : ""}Total: ${fmt(order.money.total)}

Payment Method: ${paymentMethod}
${order.method === "cod" ? `Please have ${fmt(order.money.total)} ready in cash.\n` : ""}
Shipping Address:
${order.contact.name}
${order.ship.address}
${[order.ship.city, order.ship.province, order.ship.postal].filter(Boolean).join(", ")}
${country}
Phone: ${order.contact.phone}

Estimated Delivery: ${eta}

Thank you for choosing Ember & Root.
  `.trim();

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}
