import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/supabase/types"
import { 
  FaGlobe, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok, 
  FaFacebook, 
  FaGithub, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp, 
  FaTelegram,
  FaLink,
  FaHeart
} from "react-icons/fa"

type Page = Database["public"]["Tables"]["pages"]["Row"]
type LinkType = Database["public"]["Tables"]["links"]["Row"]
type Profile = Database["public"]["Tables"]["user_profiles"]["Row"]

interface BioPageProps {
  page: Page
  links: LinkType[]
  profile: Profile
}

const getIconComponent = (icon: string | null) => {
  const iconMap: Record<string, any> = {
    linkhaven: FaLink,
    globe: FaGlobe,
    twitter: FaTwitter,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    facebook: FaFacebook,
    github: FaGithub,
    email: FaEnvelope,
    phone: FaPhone,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
  }
  return icon ? iconMap[icon] || FaLink : FaLink
}

const getIconGradient = (icon: string | null) => {
  const gradientMap: Record<string, string> = {
    twitter: "from-blue-400 to-blue-600",
    instagram: "from-purple-400 via-pink-500 to-orange-500",
    linkedin: "from-blue-500 to-blue-700",
    youtube: "from-red-500 to-red-700",
    tiktok: "from-pink-500 via-purple-500 to-blue-500",
    facebook: "from-blue-600 to-blue-800",
    github: "from-gray-700 to-gray-900",
    whatsapp: "from-green-500 to-green-700",
    telegram: "from-blue-400 to-blue-600",
    email: "from-red-400 to-red-600",
    phone: "from-green-400 to-green-600",
    globe: "from-blue-400 to-blue-600",
    linkhaven: "from-linkhaven-gradient-1 to-linkhaven-gradient-2",
  }
  return gradientMap[icon || ""] || "from-gray-400 to-gray-600"
}

const renderIcon = (icon: string | null) => {
  const IconComponent = getIconComponent(icon)
  const gradient = getIconGradient(icon)
  
  if (icon === "linkhaven") {
    return (
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-linkhaven-gradient-1 to-linkhaven-gradient-2 flex items-center justify-center shadow-lg icon-container">
        <img 
          src="/placeholder-logo.svg" 
          alt="LinkHaven" 
          className="w-6 h-3 md:w-7 md:h-4 object-contain"
        />
      </div>
    )
  }
  
  return (
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg icon-container`}>
      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </div>
  )
}

export function BioPage({ page, links, profile }: BioPageProps) {
  const activeLinks = links.filter((link) => link.is_active)

  return (
    <div className="min-h-screen relative overflow-hidden bio-page-container">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-linkhaven-lavender via-linkhaven-ocean-blue to-linkhaven-pastel-pink animate-gradient-shift bg-[length:400%_400%]"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-6 md:py-8 px-4">
        <div className="max-w-md w-full space-y-6 md:space-y-8">
          
          {/* Profile Section */}
          <div className="relative group">
            <div className="absolute inset-0 glass rounded-3xl shadow-2xl"></div>
            <div className="relative p-6 md:p-8 text-center">
              {/* Avatar with animated border */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-linkhaven-gradient-1 via-linkhaven-gradient-3 to-linkhaven-gradient-4 animate-gradient-shift bg-[length:200%_200%] p-1"></div>
                <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto relative z-10 border-4 border-white/80 shadow-2xl profile-avatar">
                  <AvatarImage src={page.profile_image_url || ""} />
                  <AvatarFallback className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-linkhaven-gradient-1 to-linkhaven-gradient-2 text-white">
                    {profile.full_name?.charAt(0) || page.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Username */}
              <h1 className="text-2xl md:text-4xl font-bold gradient-text mb-2 md:mb-3 tracking-tight profile-name">
                {profile.full_name || `@${page.username}`}
              </h1>
              
              {/* Bio */}
              {page.bio && (
                <div className="glass rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg">
                  <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium">
                    {page.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3 md:space-y-4">
            {activeLinks.map((link, index) => (
              <Link
                key={link.id}
                href={`/api/link-click/${link.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group focus-visible"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  {/* Glassmorphism Card */}
                  <div className="glass rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 link-card">
                    <div className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {renderIcon(link.icon)}
                      </div>
                      
                      {/* Link Title */}
                      <span className="font-bold text-gray-900 text-base md:text-lg flex-1 group-hover:text-gray-700 transition-colors">
                        {link.title}
                      </span>
                      
                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-linkhaven-gradient-1 to-linkhaven-gradient-2 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-linkhaven-gradient-1/20 to-linkhaven-gradient-3/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          {!profile.is_premium && (
            <div className="text-center pt-6 md:pt-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium focus-visible"
              >
                <span>Made with</span>
                <FaHeart className="text-red-500 animate-pulse" />
                <span>by LinkHaven</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
