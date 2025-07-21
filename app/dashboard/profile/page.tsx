import { requireAuth, getUserProfile, getUserPage } from "@/lib/auth"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const page = await getUserPage(user.id)

  if (!profile || typeof profile !== "object" || !("id" in profile)) {
    return <div>Error loading profile data</div>;
  }
  if (!page || typeof page !== "object" || !("id" in page)) {
    return <div>Error loading page data</div>;
  }

  // Type assertions to tell TypeScript data is valid
  const validProfile = profile as any;
  const validPage = page as any;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Customize your bio page appearance and information</p>
      </div>

      <ProfileForm userId={user.id} profile={validProfile} page={validPage} />
    </div>
  )
}
