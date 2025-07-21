"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/supabase/types"

type Profile = Database["public"]["Tables"]["user_profiles"]["Row"]
type Page = Database["public"]["Tables"]["pages"]["Row"]

interface ProfileFormProps {
  userId: string
  profile: Profile | null
  page: Page | null
}

export function ProfileForm({ userId, profile, page }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const fullName = formData.get("fullName") as string
      const username = formData.get("username") as string
      const bio = formData.get("bio") as string
      const template = formData.get("template") as string

      // Update profile
      await supabase.from("user_profiles").upsert({
        id: userId,
        full_name: fullName,
        email: profile?.email || "",
      })

      let profileImageUrl = page?.profile_image_url

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("profile-images").upload(fileName, imageFile)

        if (!uploadError) {
          const { data } = supabase.storage.from("profile-images").getPublicUrl(fileName)

          profileImageUrl = data.publicUrl
        }
      }

      // Update or create page
      await supabase.from("pages").upsert({
        id: page?.id,
        user_id: userId,
        username,
        bio,
        template: template as "creator" | "shop" | "coach",
        profile_image_url: profileImageUrl,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details and customize your bio page</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={page?.profile_image_url || ""} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="max-w-xs"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={profile?.full_name || ""}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                  linkhaven.app/
                </span>
                <Input
                  id="username"
                  name="username"
                  defaultValue={page?.username || ""}
                  placeholder="username"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={page?.bio || ""}
                placeholder="Tell people about yourself..."
                rows={3}
              />
            </div>

            {/* Template */}
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select name="template" defaultValue={page?.template || "creator"}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creator">Creator - Perfect for content creators</SelectItem>
                  <SelectItem value="shop">Shop - Great for businesses and stores</SelectItem>
                  <SelectItem value="coach">Coach - Ideal for coaches and consultants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
