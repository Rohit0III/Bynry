"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProfiles, type Profile } from "@/hooks/use-profiles"
import { ProfileForm } from "@/components/profile-form"
import ProtectedRoute from "@/components/protected-route"

export default function NewProfilePage() {
  const router = useRouter()
  const { addProfile } = useProfiles()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: Omit<Profile, "id" | "coordinates">) => {
    setIsSubmitting(true)
    try {
      await addProfile(formData)
      router.push("/admin")
    } catch (error) {
      console.error("Error adding profile:", error)
      alert("Failed to add profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            <h1 className="text-2xl font-bold">Add New Profile</h1>
            <p className="text-muted-foreground">Create a new profile with all the necessary information.</p>
          </div>
          <ProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
