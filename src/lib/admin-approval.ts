// src/lib/admin-approval.ts
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function randomToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function createOrGetApprovalTokenForUser(userId: string) {
  const supabase = await createSupabaseServerClient();

  // Se esiste già un token per userId, riusalo (constraint one_active_token_per_user)
  const { data: existing } = await supabase
    .from("account_approval_tokens")
    .select("token, expires_at, used_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.token && !existing.used_at) {
    return existing.token as string;
  }

  // Se esiste ma usato/scaduto, proviamo a fare upsert “manuale”: cancelliamo e ricreiamo
  await supabase.from("account_approval_tokens").delete().eq("user_id", userId);

  const token = randomToken();

  const { error } = await supabase.from("account_approval_tokens").insert({
    user_id: userId,
    token,
    // expires_at default 7d
  });

  if (error) throw new Error(error.message);

  return token;
}

export async function notifyAdminsForApproval(userId: string) {
  const supabase = await createSupabaseServerClient();

  // Leggiamo il nuovo utente
  const { data: userProfile, error: userErr } = await supabase
    .from("profiles")
    .select("id, display_name, email, status")
    .eq("id", userId)
    .maybeSingle();

  if (userErr) throw new Error(userErr.message);
  if (!userProfile) return;

  // Notifica solo se è ancora pending
  if (userProfile.status !== "PENDING_APPROVAL") return;

  // Prendi tutti gli admin ACTIVE con email
  const { data: admins, error: adminErr } = await supabase
    .from("profiles")
    .select("email, display_name")
    .eq("role", "ADMIN")
    .eq("status", "ACTIVE");

  if (adminErr) throw new Error(adminErr.message);

  const adminEmails = (admins ?? [])
    .map((a: any) => a.email)
    .filter((e: any) => typeof e === "string" && e.includes("@"));

  if (adminEmails.length === 0) return;

  const token = await createOrGetApprovalTokenForUser(userId);
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const approveUrl = `${appUrl}/admin/approve?token=${encodeURIComponent(token)}`;

  const subject = `Approva nuovo account: ${userProfile.display_name}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
      <h2>Nuovo account da approvare</h2>
      <p><b>Nome:</b> ${escapeHtml(userProfile.display_name ?? "")}</p>
      <p><b>Email:</b> ${escapeHtml(userProfile.email ?? "")}</p>
      <p>
        <a href="${approveUrl}" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#111;color:#fff;text-decoration:none;">
          Approva account
        </a>
      </p>
      <p style="color:#666;font-size:12px;">Basta un solo admin. Se è già approvato, vedrai un messaggio.</p>
    </div>
  `;

  await sendEmail({ to: adminEmails, subject, html });
}

// mini escape per HTML
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
