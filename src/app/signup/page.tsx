// app/signup/page.tsx
import Link from "next/link";
import { signUpAction } from "@/app/auth/actions";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; checkEmail?: string };
}) {
  const checkEmail = searchParams?.checkEmail === "1";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Crea account</h1>

      {searchParams?.error ? (
        <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm">
          {searchParams.error}
        </div>
      ) : null}

      {checkEmail ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          Ti abbiamo inviato una email di verifica. Dopo aver confermato, il tuo
          account sarà in attesa di approvazione admin.
        </div>
      ) : (
        <form action={signUpAction} className="space-y-3">
          <input
            name="display_name"
            placeholder="Nome (nickname)"
            required
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3"
          />
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
            Registrati
          </button>
        </form>
      )}

      <div className="text-sm opacity-80">
        Hai già un account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
