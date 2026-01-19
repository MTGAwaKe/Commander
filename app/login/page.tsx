// app/login/page.tsx
import Link from "next/link";
import { signInAction } from "@/app/auth/actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>

      {searchParams?.error ? (
        <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm">
          {searchParams.error}
        </div>
      ) : null}

      <form action={signInAction} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
        />

        <button className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-neutral-900">
          Entra
        </button>
      </form>

      <div className="flex items-center justify-between text-sm opacity-80">
        <Link href="/signup" className="underline">
          Crea account
        </Link>
        <Link href="/reset" className="underline">
          Password dimenticata
        </Link>
      </div>
    </div>
  );
}
