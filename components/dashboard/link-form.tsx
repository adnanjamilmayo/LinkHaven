"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
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

const iconOptions = [
  { value: "linkhaven", label: "LinkHaven", icon: FaLink },
  { value: "globe", label: "Website", icon: FaGlobe },
  { value: "twitter", label: "Twitter", icon: FaTwitter },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { value: "youtube", label: "YouTube", icon: FaYoutube },
  { value: "tiktok", label: "TikTok", icon: FaTiktok },
  { value: "facebook", label: "Facebook", icon: FaFacebook },
  { value: "github", label: "GitHub", icon: FaGithub },
  { value: "email", label: "Email", icon: FaEnvelope },
  { value: "phone", label: "Phone", icon: FaPhone },
  { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
  { value: "telegram", label: "Telegram", icon: FaTelegram },
]

const getIconColor = (iconValue: string) => {
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
  return colorMap[iconValue] || "#6B7280"
}

interface LinkFormProps {
  pageId: string
  link?: {
    id: string
    title: string
    url: string
    icon: string | null
  }
  trigger?: React.ReactNode
}

export function LinkForm({ pageId, link, trigger }: LinkFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)

    const title = formData.get("title") as string
    const url = formData.get("url") as string
    const icon = formData.get("icon") as string

    try {
      if (link) {
        // Update existing link
        const { error } = await supabase
          .from("links")
          .update({ title, url, icon: icon || null })
          .eq("id", link.id)

        if (error) throw error
      } else {
        // Create new link
        const { error } = await supabase.from("links").insert({ page_id: pageId, title, url, icon: icon || null })

        if (error) throw error
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving link:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{link ? "Edit Link" : "Add New Link"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Link title" defaultValue={link?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://example.com" defaultValue={link?.url} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Optional)</Label>
            <Select name="icon" defaultValue={link?.icon || "linkhaven"}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.icon
                  const iconColor = getIconColor(option.value)
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" style={{ color: iconColor }} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : link ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
