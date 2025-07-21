"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, GripVertical, ExternalLink } from "lucide-react"
import { LinkForm } from "./link-form"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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
  FaLink
} from "react-icons/fa"

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  click_count: number
  sort_order: number
  is_active: boolean
}

interface LinkListProps {
  links: Link[]
  pageId: string
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

const getIconColor = (icon: string | null) => {
  const colorMap: Record<string, string> = {
    twitter: "#1DA1F2",
    instagram: "#E4405F",
    linkedin: "#0077B5",
    youtube: "#FF0000",
    tiktok: "#000000",
    facebook: "#1877F2",
    github: "#181717",
    whatsapp: "#25D366",
    telegram: "#0088CC",
    email: "#EA4335",
    phone: "#34A853",
    globe: "#4285F4",
    linkhaven: "#6366F1",
  }
  return colorMap[icon || ""] || "#6B7280"
}

const renderIcon = (icon: string | null) => {
  const IconComponent = getIconComponent(icon)
  const iconColor = getIconColor(icon)
  
  if (icon === "linkhaven") {
    return (
      <img 
        src="/placeholder-logo.svg" 
        alt="LinkHaven" 
        className="w-5 h-5 object-contain"
      />
    )
  }
  
  return <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
}

export function LinkList({ links, pageId }: LinkListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (linkId: string) => {
    setIsDeleting(linkId)

    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting link:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleActive = async (linkId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("links").update({ is_active: !isActive }).eq("id", linkId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error toggling link:", error)
    }
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-500 mb-4">Add your first link to get started</p>
            <LinkForm pageId={pageId} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Card key={link.id} className={`${!link.is_active ? "opacity-50" : ""}`}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <div className="flex items-center space-x-2">
                {renderIcon(link.icon)}
                <div>
                  <h4 className="font-medium text-gray-900">{link.title}</h4>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{link.url}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{link.click_count} clicks</span>

              <Button variant="ghost" size="sm" onClick={() => toggleActive(link.id, link.is_active)}>
                {link.is_active ? "Hide" : "Show"}
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>

              <LinkForm
                pageId={pageId}
                link={link}
                trigger={
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                }
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(link.id)}
                disabled={isDeleting === link.id}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
