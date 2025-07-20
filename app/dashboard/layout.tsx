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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <Sidebar username={page?.username} className="dark:bg-gray-900 dark:border-gray-800" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
