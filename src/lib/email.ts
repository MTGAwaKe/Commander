// src/lib/email.ts
import { Resend } from "resend";

export async function sendEmail(params: {
  to: string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    // Email provider non configurato: skip silenzioso
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  return { skipped: false as const };
}
