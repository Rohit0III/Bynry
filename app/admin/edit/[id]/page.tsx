"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile, useProfiles, type Profile } from "@/hooks/use-profiles"
import { ProfileForm } from "@/components/profile-form"
import ProtectedRoute from "@/components/protected-route"

export default function EditProfilePage() {
  const router = useRouter()
  const { id } = useParams()
  const { profile, isLoading } = useProfile(id as string)
  const { updateProfile } = useProfiles()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: Partial<Profile>) => {
    setIsSubmitting(true)
    try {
      await updateProfile(id as string, formData)
      router.push("/admin")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container max-w-2xl py-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" disabled>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </div>
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="container flex h-[70vh] flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Profile not found</h2>
          <p className="text-muted-foreground">The profile you're trying to edit doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-2xl py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Update the profile information for {profile.name}.</p>
          </div>
          <ProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={profile} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
