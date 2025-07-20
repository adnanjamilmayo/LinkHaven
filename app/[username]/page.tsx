import { createServerClient } from "@/lib/supabase/server"
import { BioPage } from "@/components/bio-page/bio-page"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function PublicBioPage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createServerClient()

  // Get page data
  const { data: page } = await supabase.from("pages").select("*").eq("username", username).single()

  if (!page) {
    notFound()
  }

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", page.user_id).single()

  if (!profile) {
    notFound()
  }

  // Get active links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("page_id", page.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  // Increment page views
  await supabase.rpc("increment_page_views", { page_uuid: page.id })

  return <BioPage page={page} links={links || []} profile={profile!} />
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const supabase = await createServerClient()

  const { data: page } = await supabase.from("pages").select("*, user_profiles(*)").eq("username", username).single()

  if (!page) {
    return {
      title: "Page Not Found - LinkHaven",
    }
  }

  return {
    title: `${page.user_profiles?.full_name || username} - LinkHaven`,
    description: page.bio || `Check out ${username}'s links on LinkHaven`,
    openGraph: {
      title: `${page.user_profiles?.full_name || username} - LinkHaven`,
      description: page.bio || `Check out ${username}'s links on LinkHaven`,
      images: page.profile_image_url ? [page.profile_image_url] : [],
    },
  }
}
