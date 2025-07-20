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
  const supabase = await createServerClient()

  // Get analytics data
  const { data: analytics } = await supabase
    .from("analytics")
    .select("views")
    .eq("page_id", page?.id || "")

  const { data: links } = await supabase
    .from("links")
    .select("click_count")
    .eq("page_id", page?.id || "")

  const totalViews = analytics?.reduce((sum, day) => sum + day.views, 0) || 0
  const totalClicks = links?.reduce((sum, link) => sum + link.click_count, 0) || 0
  const totalLinks = links?.length || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || "User"}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your LinkHaven page performance</p>
      </div>

      {!page ? (
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
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClicks}</div>
                <p className="text-xs text-muted-foreground">Link clicks this month</p>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Clicks per view</p>
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
                  <Link href={`/${page.username}`} target="_blank">
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
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <code className="text-sm">linkhaven.vercel.app/{page.username}</code>
                </div>
                <CopyLinkButton link={`linkhaven.vercel.app/${page.username}`} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
