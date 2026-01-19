// src/lib/profile.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string;
  role: "ADMIN" | "PLAYER";
  status: "PENDING_APPROVAL" | "ACTIVE" | "DISABLED";
  admin_approved_at: string | null;
};

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id,display_name,role,status,admin_approved_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return data ?? null;
}
