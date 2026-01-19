// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  // Next 16: cookies() è async
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Next 16: puoi passare un oggetto a set()
            cookieStore.set({ name, value, ...options });
          });
        } catch {
          // In alcune render path non puoi settare cookie.
          // Il middleware gestisce comunque il refresh della sessione.
        }
      },
    },
  });
}
