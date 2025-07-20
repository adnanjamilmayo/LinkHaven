import { requireAuth, getUserPage } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Eye, MousePointer, TrendingUp } from "lucide-react"

export default async function AnalyticsPage() {
  const user = await requireAuth()
  const page = await getUserPage(user.id)
  const supabase = await createServerClient()

  if (!page) {
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

  // Get analytics data
  const { data: analytics } = await supabase
    .from("analytics")
    .select("*")
    .eq("page_id", page.id)
    .order("view_date", { ascending: false })
    .limit(30)

  const { data: links } = await supabase
    .from("links")
    .select("title, click_count, url")
    .eq("page_id", page.id)
    .order("click_count", { ascending: false })

  const totalViews = analytics?.reduce((sum, day) => sum + day.views, 0) || 0
  const totalClicks = links?.reduce((sum, link) => sum + link.click_count, 0) || 0
  const avgClickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0"

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your page performance and link engagement</p>
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
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">All time link clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate}%</div>
            <p className="text-xs text-muted-foreground">Average click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links?.length || 0}</div>
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
              {analytics?.slice(0, 10).map((day) => (
                <div key={day.view_date} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{new Date(day.view_date).toLocaleDateString()}</span>
                  <span className="font-medium">{day.views} views</span>
                </div>
              ))}
              {!analytics?.length && <p className="text-gray-500 text-center py-4">No views yet</p>}
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
              {links?.slice(0, 10).map((link) => (
                <div key={link.title} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                  <span className="ml-2 font-medium">{link.click_count} clicks</span>
                </div>
              ))}
              {!links?.length && <p className="text-gray-500 text-center py-4">No links yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
