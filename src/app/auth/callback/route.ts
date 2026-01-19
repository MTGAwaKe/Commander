// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notifyAdminsForApproval } from "@/lib/admin-approval";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );

  if (code) {
    // Exchange code for session (email verify / magic link)
    await supabase.auth.exchangeCodeForSession(code);

    const { data } = await supabase.auth.getUser();
    if (data.user) {
      // Qui notifichiamo tutti gli admin che c'è un account da approvare
      await notifyAdminsForApproval(data.user.id);
    }
  }

  // Dopo conferma email: se non approvato, va su pending
  return NextResponse.redirect(new URL("/pending", requestUrl.origin));
}
