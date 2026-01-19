// app/reset/page.tsx
"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ResetPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset/callback`,
    });

    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reset password</h1>

      {sent ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Se l’email esiste, riceverai un link per resettare la password.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
          />
          <button className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-neutral-900">
            Invia link reset
          </button>
        </form>
      )}

      {error ? (
        <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}
