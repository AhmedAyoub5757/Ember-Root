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
      return res.status(200).json({ ok: true, message: "You're on the list." });
    }

    const email = s(b.email, 150).toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(422).json({
        error: "That doesn't look like an email address. Check it once more?",
        fields: { email: "Please provide a valid email address." },
      });
    }

    const rawFlavors = Array.isArray(b.flavors) ? b.flavors : [];
    const flavors = rawFlavors
      .map((f) => s(f, 50))
      .filter((f) => f.length > 0)
      .slice(0, 20);

    const batchNo = Number.isInteger(Number(b.batch)) ? Number(b.batch) : null;
    const source = s(b.source, 50) || "batch_form";

    const [row] = await sql`
      INSERT INTO batch_subscribers (email, flavors, batch_no, source, updated_at)
      VALUES (
        ${email},
        ${JSON.stringify(flavors)}::jsonb,
        ${batchNo},
        ${source},
        now()
      )
      ON CONFLICT (email)
      DO UPDATE SET
        flavors = CASE 
          WHEN jsonb_array_length(EXCLUDED.flavors) > 0 THEN EXCLUDED.flavors 
          ELSE batch_subscribers.flavors 
        END,
        batch_no = COALESCE(EXCLUDED.batch_no, batch_subscribers.batch_no),
        source = EXCLUDED.source,
        updated_at = now()
      RETURNING *;
    `;

    // Optionally send welcome to batch reserve list email
    sendEmail({
      to: email,
      subject: batchNo ? `Reserved for Batch ${batchNo} — Ember & Root` : `You're on the list — Ember & Root`,
      text: `You're on the Ember & Root reserve list.${batchNo ? ` We'll write to you the morning Batch ${batchNo} opens.` : ""}\n\nUnsubscribe whenever by replying to this email.`,
      html: `
        <div style="font-family: sans-serif; color: #1F1A14; max-width: 540px; margin: 0 auto; padding: 24px; background: #FAF5E8; border: 1px solid #E2DCB9;">
          <h2 style="text-transform: uppercase; letter-spacing: 0.1em; font-size: 18px; margin: 0 0 16px;">Ember &amp; Root</h2>
          <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">You're on the list.</p>
          <p>We'll send you an email the moment the next crock is unsealed.${flavors.length > 0 ? ` You've noted interest in: <strong>${flavors.join(", ")}</strong>.` : ""}</p>
          <p style="font-size: 12px; color: #786E60; margin-top: 24px; border-top: 1px solid #E2DCB9; padding-top: 12px;">One email per batch. No spam. Unsubscribe whenever.</p>
        </div>
      `,
    }).catch((err) => console.error("Failed to send subscribe confirmation:", err));
    sendAdminEmail(
      "New batch subscriber",
      `Email: ${email}\nBatch: ${batchNo ?? "Any"}\nFlavors: ${flavors.join(", ") || "None specified"}`,
    ).catch((err) => console.error("Failed to send admin subscriber notification:", err));

    return res.status(200).json({
      ok: true,
      email: row.email,
      batch: row.batch_no,
      flavors: row.flavors,
      message: "You're on the list.",
    });
  } catch (err) {
    console.error("POST /api/subscribe failed:", err);
    return res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
}
