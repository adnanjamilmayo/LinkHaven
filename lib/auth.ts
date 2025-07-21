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
  const { data: page, error } = await supabase.from("pages").select("*").eq("user_id", userId as any).single()

  if (error || !page) {
    return null
  }

  return page
}
