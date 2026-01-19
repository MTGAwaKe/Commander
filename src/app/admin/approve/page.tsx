// src/app/admin/approve/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminApprovePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) {
    return <div className="text-sm opacity-80">Token mancante.</div>;
  }

  const supabase = await createSupabaseServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return (
      <div className="space-y-3">
        <div className="text-sm opacity-80">Devi fare login come admin.</div>
        <Link className="underline" href={`/login?next=/admin/approve?token=${encodeURIComponent(token)}`}>
          Vai al login
        </Link>
      </div>
    );
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!me || me.role !== "ADMIN" || me.status !== "ACTIVE") {
    return (
      <div className="space-y-3">
        <div className="text-sm opacity-80">Non sei autorizzato.</div>
        <Link className="underline" href="/">
          Torna alla home
        </Link>
      </div>
    );
  }

  // Cerca token
  const { data: tok } = await supabase
    .from("account_approval_tokens")
    .select("user_id, used_at, expires_at, token")
    .eq("token", token)
    .maybeSingle();

  if (!tok) {
    return <div className="text-sm opacity-80">Token non valido.</div>;
  }

  if (tok.used_at) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Questo token è già stato usato. L’account potrebbe essere già approvato.
        </div>
        <Link className="underline" href="/admin/users">
          Vai agli utenti pending
        </Link>
      </div>
    );
  }

  const expires = new Date(tok.expires_at);
  if (Date.now() > expires.getTime()) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Token scaduto. Apri la lista utenti pending e approva da lì.
        </div>
        <Link className="underline" href="/admin/users">
          Vai agli utenti pending
        </Link>
      </div>
    );
  }

  // Approva in modo idempotente: se è già ACTIVE non succede nulla di male.
  await supabase
    .from("profiles")
    .update({
      status: "ACTIVE",
      admin_approved_at: new Date().toISOString(),
      approved_by: authData.user.id,
    })
    .eq("id", tok.user_id)
    .eq("status", "PENDING_APPROVAL");

  // Marca token usato
  await supabase
    .from("account_approval_tokens")
    .update({
      used_at: new Date().toISOString(),
      used_by: authData.user.id,
    })
    .eq("token", token)
    .is("used_at", null);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
        Account approvato ✅
      </div>
      <Link className="underline" href="/admin/users">
        Torna alla lista utenti
      </Link>
    </div>
  );
}
