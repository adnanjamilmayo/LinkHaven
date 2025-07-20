import type { Database } from "@/lib/supabase/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

type Page = Database["public"]["Tables"]["pages"]["Row"]
type LinkType = Database["public"]["Tables"]["links"]["Row"]
type Profile = Database["public"]["Tables"]["user_profiles"]["Row"]

interface BioPageProps {
  page: Page
  links: LinkType[]
  profile: Profile
}

const getIconEmoji = (icon: string | null) => {
  const iconMap: Record<string, string> = {
    globe: "🌐",
    twitter: "🐦",
    instagram: "📷",
    linkedin: "💼",
    youtube: "📺",
    tiktok: "🎵",
    facebook: "📘",
    github: "💻",
    email: "✉️",
    phone: "📞",
    whatsapp: "💬",
    telegram: "✈️",
  }
  return icon ? iconMap[icon] || "🔗" : "🔗"
}

const getTemplateStyles = (template: string) => {
  switch (template) {
    case "creator":
      return {
        background: "bg-gradient-to-br from-purple-50 to-pink-50",
        card: "bg-white/80 backdrop-blur-sm border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700 text-white",
      }
    case "shop":
      return {
        background: "bg-gradient-to-br from-green-50 to-emerald-50",
        card: "bg-white/80 backdrop-blur-sm border-green-200",
        button: "bg-green-600 hover:bg-green-700 text-white",
      }
    case "coach":
      return {
        background: "bg-gradient-to-br from-blue-50 to-cyan-50",
        card: "bg-white/80 backdrop-blur-sm border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700 text-white",
      }
    default:
      return {
        background: "bg-gray-50",
        card: "bg-white border-gray-200",
        button: "bg-gray-900 hover:bg-gray-800 text-white",
      }
  }
}

export function BioPage({ page, links, profile }: BioPageProps) {
  const styles = getTemplateStyles(page.template)
  const activeLinks = links.filter((link) => link.is_active)

  return (
    <div className={`min-h-screen ${styles.background} py-8 px-4`}>
      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Section */}
        <Card className={styles.card + " shadow-lg rounded-3xl border-0"}>
          <CardContent className="pt-8 pb-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-400 via-blue-400 to-purple-400 animate-spin-slow p-1"></div>
              <Avatar className="w-28 h-28 mx-auto relative z-10 border-4 border-white shadow-xl">
              <AvatarImage src={page.profile_image_url || ""} />
                <AvatarFallback className="text-3xl">
                {profile.full_name?.charAt(0) || page.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{profile.full_name || `@${page.username}`}</h1>
            {page.bio && (
              <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-xl px-4 py-2 mt-2 mb-1 mx-auto max-w-xs">
                <span className="text-lg">💬</span>
                <span className="text-gray-700 text-base leading-relaxed">{page.bio}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Links Section */}
        <div className="space-y-4 mt-6">
          {activeLinks.map((link) => (
            <Link
              key={link.id}
              href={`/api/link-click/${link.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className={`${styles.card} hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 cursor-pointer rounded-2xl border-0`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <span className="text-2xl bg-white/70 rounded-full p-2 shadow-sm border border-gray-200">{getIconEmoji(link.icon)}</span>
                  <span className="font-semibold text-gray-900 text-lg flex-1">{link.title}</span>
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer */}
        {!profile.is_premium && (
          <div className="text-center py-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Made with ❤️ by LinkHaven
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
