import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  try {
    // Get the link
    const { data: link } = await supabase.from("links").select("url").eq("id", id).single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Increment click count
    await supabase.rpc("increment_link_clicks", { link_uuid: id })

    // Redirect to the actual URL
    return NextResponse.redirect(link.url)
  } catch (error) {
    console.error("Error tracking link click:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
