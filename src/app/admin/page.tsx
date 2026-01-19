import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <div className="space-y-2">
        <Link href="/admin/users" className="block rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
          <div className="font-medium">Utenti pending</div>
          <div className="text-sm opacity-70">Approva / Disabilita account</div>
        </Link>

        <Link href="/admin/test-email" className="block rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
          <div className="font-medium">Test Email (Resend)</div>
          <div className="text-sm opacity-70">Verifica invio email</div>
        </Link>
      </div>
    </div>
  );
}
