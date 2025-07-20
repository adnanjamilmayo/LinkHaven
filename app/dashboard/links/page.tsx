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

  if (!page) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Page First</CardTitle>
            <CardDescription>You need to create your bio page before adding links</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/profile">Create Your Page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Links</h1>
          <p className="text-gray-600 mt-2">Add, edit, and organize your links</p>
        </div>
        <LinkForm pageId={page.id} />
      </div>

      <LinkList links={links || []} pageId={page.id} />
    </div>
  )
}
