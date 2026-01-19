// app/page.tsx
import Link from "next/link";
import { getMyProfile } from "@/lib/profile";

export default async function HomePage() {
  const profile = await getMyProfile();

  // Se loggato ma non attivo, lo portiamo su pending
  if (profile && profile.status !== "ACTIVE") {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Classifica</h1>
        <p className="opacity-80">
          Il tuo account è in attesa di approvazione admin.
        </p>
        <Link
          href="/pending"
          className="inline-block rounded-xl border border-neutral-700 px-4 py-2"
        >
          Vai alla pagina di approvazione
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Classifica</h1>
        <div className="text-xs opacity-70">TrueSkill (placeholder)</div>
      </div>

      {/* Toggle Player/Deck (placeholder UI) */}
      <div className="flex gap-2">
        <button className="flex-1 rounded-xl border border-neutral-700 px-3 py-2 text-sm">
          Players
        </button>
        <button className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-3 py-2 text-sm opacity-70">
          Decks
        </button>
      </div>

      {/* Lista placeholder */}
      <div className="space-y-2">
        {["Player A", "Player B", "Player C"].map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 text-sm opacity-70">{i + 1}</div>
              <div className="font-medium">{name}</div>
            </div>
            <div className="text-sm opacity-80">mu−3σ: —</div>
          </div>
        ))}
      </div>

      {profile?.role === "ADMIN" && profile.status === "ACTIVE" ? (
        <Link
          href="/admin"
          className="inline-block rounded-xl border border-neutral-700 px-4 py-2"
        >
          Vai ad Admin
        </Link>
      ) : null}
    </div>
  );
}
