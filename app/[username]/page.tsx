import { createServerClient } from "@/lib/supabase/server"
import { BioPage } from "@/components/bio-page/bio-page"
import { notFound } from "next/navigation"

interface PageProps {
  params: { username: string }
}

export default async function PublicBioPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const supabase = await createServerClient()

  // Get page data
  const { data: page, error: pageError } = await supabase.from("pages").select("*").eq("username", username as any).single()
  
  if (pageError) {
    notFound()
  }
  
  if (!page) {
    notFound()
  }

  // Type assertion for page
  const validPage = page as any;

  // Get user profile
  const { data: profile, error: profileError } = await supabase.from("user_profiles").select("*").eq("id", validPage.user_id as any).single()
  if (profileError || !profile) {
    notFound()
  }

  // Get active links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("page_id", validPage.id as any)
    .eq("is_active", true as any)
    .order("sort_order", { ascending: true })
  if (linksError) {
    notFound()
  }

  // Increment page views
  await supabase.rpc("increment_page_views", { page_uuid: validPage.id as any })

  return <BioPage page={validPage} links={links as any || []} profile={profile as any} />
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const supabase = await createServerClient()

  const { data: page, error: pageError } = await supabase.from("pages").select("*, user_profiles(*)").eq("username", username as any).single()
  if (pageError || !page) {
    return {
      title: `${username} - LinkHaven`,
    }
  }

  const validPage = page as any;

  return {
    title: `${validPage.user_profiles?.full_name || username} - LinkHaven`,
    description: validPage.bio || `Check out ${username}'s links on LinkHaven`,
    openGraph: {
      title: `${validPage.user_profiles?.full_name || username} - LinkHaven`,
      description: validPage.bio || `Check out ${username}'s links on LinkHaven`,
      images: validPage.profile_image_url ? [validPage.profile_image_url] : [],
    },
  }
}
