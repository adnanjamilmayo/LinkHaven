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
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  return profile
}

export async function getUserPage(userId: string) {
  const supabase = await createServerClient()
  const { data: page } = await supabase.from("pages").select("*").eq("user_id", userId).single()

  return page
}
