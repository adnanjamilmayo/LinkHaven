import { BioPage } from "@/components/bio-page/bio-page"

// Sample data for demo
const demoPage = {
  id: "demo-page",
  username: "johndoe",
  bio: "Digital creator & entrepreneur sharing insights on tech, business, and lifestyle. Building the future, one link at a time. ✨",
  profile_image_url: "/placeholder-user.jpg",
  template: "premium",
  user_id: "demo-user"
}

const demoProfile = {
  id: "demo-user",
  full_name: "John Doe",
  email: "john@example.com",
  is_premium: false
}

const demoLinks = [
  {
    id: "1",
    title: "YouTube Channel",
    url: "https://youtube.com",
    icon: "youtube",
    is_active: true,
    sort_order: 1,
    page_id: "demo-page"
  },
  {
    id: "2",
    title: "Instagram",
    url: "https://instagram.com",
    icon: "instagram",
    is_active: true,
    sort_order: 2,
    page_id: "demo-page"
  },
  {
    id: "3",
    title: "LinkedIn",
    url: "https://linkedin.com",
    icon: "linkedin",
    is_active: true,
    sort_order: 3,
    page_id: "demo-page"
  },
  {
    id: "4",
    title: "My Website",
    url: "https://example.com",
    icon: "globe",
    is_active: true,
    sort_order: 4,
    page_id: "demo-page"
  },
  {
    id: "5",
    title: "Newsletter",
    url: "https://newsletter.com",
    icon: "email",
    is_active: true,
    sort_order: 5,
    page_id: "demo-page"
  },
  {
    id: "6",
    title: "GitHub",
    url: "https://github.com",
    icon: "github",
    is_active: true,
    sort_order: 6,
    page_id: "demo-page"
  }
]

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <BioPage page={demoPage} links={demoLinks} profile={demoProfile} />
    </div>
  )
} 