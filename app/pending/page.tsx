// app/pending/page.tsx
import Link from "next/link";
import { getMyProfile } from "@/lib/profile";

export default async function PendingPage() {
  const profile = await getMyProfile();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">In attesa di approvazione</h1>

      {!profile ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Non sei loggato. <Link className="underline" href="/login">Vai al login</Link>.
        </div>
      ) : profile.status === "ACTIVE" ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Il tuo account è attivo ✅{" "}
          <Link className="underline" href="/">
            Torna alla home
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Hai verificato l’email, ma un admin deve ancora approvare il tuo
          account. Riceverai una notifica quando sarà attivo.
        </div>
      )}

      <Link
        href="/"
        className="inline-block rounded-xl border border-neutral-700 px-4 py-2"
      >
        Torna alla home
      </Link>
    </div>
  );
}
