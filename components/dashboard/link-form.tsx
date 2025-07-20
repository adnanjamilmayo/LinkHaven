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

const iconOptions = [
  { value: "globe", label: "🌐 Website" },
  { value: "twitter", label: "🐦 Twitter" },
  { value: "instagram", label: "📷 Instagram" },
  { value: "linkedin", label: "💼 LinkedIn" },
  { value: "youtube", label: "📺 YouTube" },
  { value: "tiktok", label: "🎵 TikTok" },
  { value: "facebook", label: "📘 Facebook" },
  { value: "github", label: "💻 GitHub" },
  { value: "email", label: "✉️ Email" },
  { value: "phone", label: "📞 Phone" },
  { value: "whatsapp", label: "💬 WhatsApp" },
  { value: "telegram", label: "✈️ Telegram" },
]

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
            <Select name="icon" defaultValue={link?.icon || "globe"}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe">No icon</SelectItem>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
