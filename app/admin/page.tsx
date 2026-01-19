// app/admin/page.tsx
export default async function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
        Placeholder admin panel. Qui metteremo:
        <ul className="mt-2 list-disc pl-5 opacity-90">
          <li>Utenti in attesa (approve)</li>
          <li>Win conditions</li>
          <li>Tornei / sotto-leghe</li>
          <li>Deck</li>
        </ul>
      </div>
    </div>
  );
}
