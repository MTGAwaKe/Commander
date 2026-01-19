// app/logout/page.tsx
import { signOutAction } from "@/app/auth/actions";

export default function LogoutPage() {
  return (
    <form action={signOutAction} className="space-y-3">
      <h1 className="text-2xl font-semibold">Logout</h1>
      <p className="opacity-80">Vuoi uscire?</p>
      <button className="rounded-xl bg-neutral-100 px-4 py-3 text-neutral-900">
        Conferma logout
      </button>
    </form>
  );
}
