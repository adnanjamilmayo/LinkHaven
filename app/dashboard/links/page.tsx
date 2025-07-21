import { requireAuth, getUserPage } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { LinkForm } from "@/components/dashboard/link-form"
import { LinkList } from "@/components/dashboard/link-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LinksPage() {
  const user = await requireAuth()
  const page = await getUserPage(user.id)
  const supabase = await createServerClient()

  if (!page || typeof page !== "object" || !("id" in page)) {
    return <div>Error loading page data</div>;
  }

  // Type assertion to tell TypeScript page is valid
  const validPage = page as { id: string; username: string };

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("page_id", validPage.id as any)
    .order("sort_order", { ascending: true })

  if (linksError || !Array.isArray(links)) {
    return <div>Error loading links</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Links</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Add, edit, and organize your links</p>
        </div>
        <LinkForm pageId={validPage.id} />
      </div>

      <LinkList links={links as any} pageId={validPage.id} />
    </div>
  )
}
