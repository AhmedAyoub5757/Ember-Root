import "./_lib/env.js";
import { sql } from "./_lib/db.js";
import { sendAdminEmail, sendEmail } from "./_lib/resend.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const s = (x, max = 200) => String(x ?? "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const b = req.body ?? {};

    // Honeypot check for bots
    if (b.company || b._gotcha) {
      return res.status(200).json({ ok: true, message: "Message received." });
    }

    const name = s(b.name, 120);
    const email = s(b.email, 150).toLowerCase();
    const topic = s(b.topic || b.subject, 100) || "General inquiry";
    const message = s(b.message, 3000);

    const fields = {};
    if (!name || name.length < 2) {
      fields.name = "Please provide your name.";
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      fields.email = "Please provide a valid email address.";
    }
    if (!message || message.length < 5) {
      fields.message = "Please write a message (at least 5 characters).";
    }

    if (Object.keys(fields).length > 0) {
      return res.status(422).json({
        error: "Please check the highlighted fields.",
        fields,
      });
    }

    const [row] = await sql`
      INSERT INTO contact_messages (name, email, topic, message)
      VALUES (${name}, ${email}, ${topic}, ${message})
      RETURNING id, name, email, topic, created_at
    `;

    // Optionally send acknowledgment email
    sendEmail({
      to: email,
      subject: `We've received your note — Ember & Root`,
      text: `Hello ${name.split(" ")[0]},\n\nThank you for reaching out to Ember & Root. We've received your note regarding "${topic}" and will get back to you shortly.\n\nYour message:\n"${message}"\n\nWarm regards,\nEmber & Root Team`,
      html: `
        <div style="font-family: sans-serif; color: #1F1A14; max-width: 540px; margin: 0 auto; padding: 24px; background: #FAF5E8; border: 1px solid #E2DCB9;">
          <h2 style="text-transform: uppercase; letter-spacing: 0.1em; font-size: 18px; margin: 0 0 16px;">Ember &amp; Root</h2>
          <p>Hello ${name.split(" ")[0]},</p>
          <p>Thank you for reaching out. We've received your note regarding <strong>${topic}</strong> and will get back to you as soon as we step out of the kitchen.</p>
          <div style="background: #EFE8D3; border-left: 3px solid #1F1A14; padding: 12px 16px; margin: 16px 0; font-size: 14px; font-style: italic;">
            “${message.replace(/\n/g, "<br>")}”
          </div>
          <p style="font-size: 13px; color: #786E60; margin-top: 24px;">— Ember &amp; Root Kitchen &amp; Cellar</p>
        </div>
      `,
    }).catch((err) => console.error("Failed to send contact confirmation:", err));
    sendAdminEmail(
      `New contact message: ${topic}`,
      `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
    ).catch((err) => console.error("Failed to send admin contact notification:", err));

    return res.status(201).json({
      ok: true,
      id: row.id,
      message: "Thank you for reaching out. We will get back to you soon.",
    });
  } catch (err) {
    console.error("POST /api/contact failed:", err);
    return res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
}
