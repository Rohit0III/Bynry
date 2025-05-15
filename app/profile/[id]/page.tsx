"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MapComponent } from "@/components/map-component"
import { useProfile } from "@/hooks/use-profiles"

export default function ProfilePage() {
  const router = useRouter()
  const { id } = useParams()
  const { profile, isLoading } = useProfile(id as string)
  const [showMap, setShowMap] = useState(false)

  if (isLoading) {
    return (
      <div className="container max-w-4xl  py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Profile not found</h2>
        <p className="text-muted-foreground">The profile you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Back to Profiles
        </Button>
      </div>
    )
  }

  return (
    <div className="container   max-w-4xl py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profiles
        </Button>
      </div>
      <div className="grid gap-12 place-items-center pl-96 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <img
            src={profile.image || "/placeholder.svg"}
            alt={profile.name}
            className="aspect-square w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.title}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.address}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setShowMap(!showMap)}>
            {showMap ? "Hide Map" : "Show on Map"}
          </Button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">About</h3>
            <p className="text-muted-foreground">{profile.description}</p>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Work</p>
                <p className="text-sm text-muted-foreground">{profile.work}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">{profile.joined}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{profile.location}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-xl font-semibold">Interests</h3>
            <p className="text-muted-foreground">{profile.interests}</p>
          </div>
          {showMap && (
            <Card className="mt-4">
              <CardContent className="p-0">
                <div className="h-[300px] w-full">
                  <MapComponent address={profile.address} name={profile.name} coordinates={profile.coordinates} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
