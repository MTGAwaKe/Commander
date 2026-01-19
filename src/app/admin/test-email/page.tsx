"use client";

import { useState } from "react";

export default function AdminTestEmailPage() {
  const [to, setTo] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });

      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message ?? "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin · Test Email</h1>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm opacity-80">
        Invia una email di test tramite Resend.
      </div>

      <div className="space-y-2">
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Email destinatario (es. la tua)"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
        />

        <button
          onClick={send}
          disabled={loading}
          className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-neutral-900 disabled:opacity-60"
        >
          {loading ? "Invio..." : "Invia email di test"}
        </button>
      </div>

      {result ? (
        <pre className="whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-xs">
{JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
