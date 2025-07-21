import { requireAuth, getUserPage } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Eye, MousePointer, TrendingUp } from "lucide-react"

export default async function AnalyticsPage() {
  const user = await requireAuth()
  const page = await getUserPage(user.id)
  const supabase = await createServerClient()

  if (!page || typeof page !== "object" || !("id" in page)) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>No Analytics Available</CardTitle>
            <CardDescription>Create your bio page first to start tracking analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Type assertion to tell TypeScript page is valid
  const validPage = page as { id: string; username: string };

  // Get analytics data
  const { data: analytics, error: analyticsError } = await supabase
    .from("analytics")
    .select("*")
    .eq("page_id", validPage.id as any)
    .order("view_date", { ascending: false })
    .limit(30)

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("title, click_count, url")
    .eq("page_id", validPage.id as any)
    .order("click_count", { ascending: false })

  if (analyticsError || !Array.isArray(analytics)) {
    return <div>Error loading analytics</div>;
  }
  if (linksError || !Array.isArray(links)) {
    return <div>Error loading links</div>;
  }

  // Remove totalClicks and click rate logic
  const totalViews = (analytics as any).reduce((sum: number, day: any) => sum + day.views, 0) || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Track your page performance and link engagement</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">All time page views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(links as any).length || 0}</div>
            <p className="text-xs text-muted-foreground">Links on your page</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Views */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Page Views</CardTitle>
            <CardDescription>Daily page views for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(analytics as any).slice(0, 10).map((day: any) => (
                <div key={day.view_date} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{new Date(day.view_date).toLocaleDateString()}</span>
                  <span className="font-medium">{day.views} views</span>
                </div>
              ))}
              {!(analytics as any).length && <p className="text-gray-500 text-center py-4">No views yet</p>}
            </div>
          </CardContent>
        </Card>

        {/* Top Links */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Your most clicked links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(links as any).slice(0, 10).map((link: any) => (
                <div key={link.title} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                  <span className="ml-2 font-medium">{link.click_count} clicks</span>
                </div>
              ))}
              {!(links as any).length && <p className="text-gray-500 text-center py-4">No links yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
