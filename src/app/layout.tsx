// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { getMyProfile } from "@/lib/profile";

export const metadata = {
  title: "Commanderino",
  description: "Commander League",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getMyProfile();

  return (
    <html lang="it">
      <body className="min-h-screen bg-neutral-950 text-neutral-50">
        <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              Commanderino
            </Link>

            <div className="flex items-center gap-3 text-sm">
              {profile ? (
                <>
                  <span className="opacity-80">
                    {profile.display_name}
                    {profile.status !== "ACTIVE" ? " (pending)" : ""}
                  </span>
                  <Link
                    href="/logout"
                    className="rounded-lg border border-neutral-700 px-3 py-1.5"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg border border-neutral-700 px-3 py-1.5"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-md px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
