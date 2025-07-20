import { requireAuth, getUserProfile, getUserPage } from "@/lib/auth"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const page = await getUserPage(user.id)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Customize your bio page appearance and information</p>
      </div>

      <ProfileForm userId={user.id} profile={profile} page={page} />
    </div>
  )
}
