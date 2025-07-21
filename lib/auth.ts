import { createServerClient } from "./supabase/server"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient()
  const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", userId as any).single()

  if (error || !profile) {
    return null
  }

  return profile
}

export async function getUserPage(userId: string) {
  const supabase = await createServerClient()
  const { data: pages, error } = await supabase.from("pages").select("*").eq("user_id", userId as any)

  if (error) {
    console.error("getUserPage error:", error)
    return null
  }
  // Filter out any error objects from the pages array
  const validPages = Array.isArray(pages)
    ? (pages as unknown[]).filter((p): p is { id: string; user_id: string; created_at: string } =>
        !!p && typeof p === "object" && typeof (p as any).id === "string" && typeof (p as any).user_id === "string" && typeof (p as any).created_at === "string"
      )
    : [];
  if (validPages.length === 0) {
    console.warn("getUserPage: No valid page found for user_id", userId)
    return null;
  }
  if (validPages.length > 1) {
    // Sort by created_at if available, otherwise just pick the first
    const sorted = validPages.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    console.warn("getUserPage: Multiple pages found for user_id", userId, "Returning the most recent one.");
    return sorted[0];
  }
  return validPages[0];
}
