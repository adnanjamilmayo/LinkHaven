import { requireAuth, getUserProfile, getUserPage } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Eye, MousePointer, Users } from "lucide-react"
import Link from "next/link"
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton"

export default async function DashboardPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const page = await getUserPage(user.id)

  if (!page || typeof page !== "object" || !("id" in page) || !("username" in page)) {
    return <div>Error loading page data</div>;
  }
  
  // Type assertion to tell TypeScript page is valid
  const validPage = page as { id: string; username: string };
  const validProfile = profile as any;
  
  const supabase = await createServerClient()

  // Get analytics data
  const { data: analytics, error: analyticsError } = await supabase
    .from("analytics")
    .select("views")
    .eq("page_id", validPage.id as any)

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("click_count")
    .eq("page_id", validPage.id as any)

  if (analyticsError || !Array.isArray(analytics)) return <div>Error loading analytics</div>;
  if (linksError || !Array.isArray(links)) return <div>Error loading links</div>;

  // Remove totalClicks and click rate logic
  const totalViews = (analytics as any).reduce((sum: number, day: any) => sum + day.views, 0) || 0
  const totalLinks = (links as any).length || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {validProfile?.full_name || "User"}!</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Here's an overview of your LinkHaven page performance</p>
      </div>

      {!validPage ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Create your first bio page to start sharing your links</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/profile">Create Your Page</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">Page views this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLinks}</div>
                <p className="text-xs text-muted-foreground">Links on your page</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your bio page and links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/dashboard/links">Manage Links</Link>
                </Button>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href={`/${validPage.username}`} target="_blank">
                    View Public Page
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Page</CardTitle>
                <CardDescription>Share your LinkHaven page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3">
                  <code className="text-sm text-gray-900 dark:text-gray-100">linkhaven.app/{validPage.username}</code>
                </div>
                <CopyLinkButton link={`${process.env.NEXT_PUBLIC_SITE_URL}/${validPage.username}`} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
