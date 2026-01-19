import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("role,status,email")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!me || me.role !== "ADMIN" || me.status !== "ACTIVE") {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const to = String(body?.to ?? me.email ?? "").trim();

  if (!to || !to.includes("@")) {
    return NextResponse.json({ ok: false, error: "Missing/invalid 'to' email" }, { status: 400 });
  }

  try {
    const result = await sendEmail({
      to: [to],
      subject: "Test Resend - Commanderino ✅",
      html: `<p>Email di test inviata da Commanderino ✅</p>
             <p><small>Se la ricevi, Resend è configurato correttamente.</small></p>`,
    });

    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Email send failed" },
      { status: 500 }
    );
  }
}
