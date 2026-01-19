// src/app/admin/users/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { approveUserAction, disableUserAction } from "./actions";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Admin · Utenti</h1>
        <p className="opacity-80">Devi fare login.</p>
        <Link className="underline" href="/login">
          Vai al login
        </Link>
      </div>
    );
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("id, role, status, display_name")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!me || me.role !== "ADMIN" || me.status !== "ACTIVE") {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Admin · Utenti</h1>
        <p className="opacity-80">Non autorizzato.</p>
        <Link className="underline" href="/">
          Torna alla home
        </Link>
      </div>
    );
  }

  const { data: pending } = await supabase
    .from("profiles")
    .select("id, display_name, email, created_at, status")
    .eq("status", "PENDING_APPROVAL")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Admin · Utenti</h1>
        <Link href="/admin" className="text-sm underline opacity-80">
          Back
        </Link>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
        Utenti in attesa di approvazione: <b>{pending?.length ?? 0}</b>
      </div>

      <div className="space-y-2">
        {(pending ?? []).map((u: any) => (
          <div
            key={u.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
          >
            <div className="font-medium">{u.display_name}</div>
            <div className="text-sm opacity-80">{u.email}</div>
            <div className="mt-3 flex gap-2">
              <form
                action={async () => {
                  "use server";
                  await approveUserAction(u.id);
                }}
              >
                <button className="rounded-xl bg-neutral-100 px-3 py-2 text-sm text-neutral-900">
                  Approva
                </button>
              </form>

              <form
                action={async () => {
                  "use server";
                  await disableUserAction(u.id);
                }}
              >
                <button className="rounded-xl border border-neutral-700 px-3 py-2 text-sm">
                  Disabilita
                </button>
              </form>
            </div>
          </div>
        ))}

        {(!pending || pending.length === 0) && (
          <div className="text-sm opacity-70">Nessun utente pending 🎉</div>
        )}
      </div>
    </div>
  );
}
