// src/app/admin/users/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireAdmin(profile: any) {
  if (!profile || profile.role !== "ADMIN" || profile.status !== "ACTIVE") {
    throw new Error("Not authorized");
  }
}

export async function approveUserAction(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Not authenticated");

  const { data: me } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", authData.user.id)
    .maybeSingle();

  requireAdmin(me);

  // Approva solo se ancora pending (idempotente)
  const { error } = await supabase
    .from("profiles")
    .update({
      status: "ACTIVE",
      admin_approved_at: new Date().toISOString(),
      approved_by: authData.user.id,
    })
    .eq("id", userId)
    .eq("status", "PENDING_APPROVAL");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function disableUserAction(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Not authenticated");

  const { data: me } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", authData.user.id)
    .maybeSingle();

  requireAdmin(me);

  const { error } = await supabase
    .from("profiles")
    .update({ status: "DISABLED" })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
