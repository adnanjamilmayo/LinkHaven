import type React from "react"
import { requireAuth, getUserPage } from "@/lib/auth"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  const page = await getUserPage(user.id)

  // Handle case where page doesn't exist yet
  const username = page && typeof page === "object" && "username" in page 
    ? (page as any).username 
    : "user";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar username={username} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
