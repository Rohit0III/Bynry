"use client"

import { useState } from "react"
import { Search, MapPin, Filter, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { MapComponent } from "@/components/map-component"
import { useProfiles, type Profile } from "@/hooks/use-profiles"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "@/components/profile-form"

export default function Home() {
  const router = useRouter()
  const [showNewProfileDialog, setShowNewProfileDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { profiles, isLoading, addProfile } = useProfiles()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  // Filter profiles based on search term and selected location
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = selectedLocation ? profile.location === selectedLocation : true

    return matchesSearch && matchesLocation
  })

  // Get unique locations for filter dropdown
  const locations = [...new Set(profiles.map((profile) => profile.location))]

  const handleAddProfile = async (formData: Omit<Profile, "id" | "coordinates">) => {
    setIsSubmitting(true)
    try {
      await addProfile({
        ...formData,
        joined: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      })
      setShowNewProfileDialog(false)
    } catch (error) {
      console.error("Error adding profile:", error)
      alert("Failed to add profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            <h1 className="text-xl font-bold">Profile Explorer</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search profiles..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowNewProfileDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Profile
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Profiles</SheetTitle>
                  <SheetDescription>Filter profiles by location or other criteria</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium leading-none">
                      Location
                    </label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedLocation("")}>
                    Reset
                  </Button>
                  <Button onClick={() => router.push("/admin/login")}>Admin Panel</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video w-full bg-muted">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video w-full bg-muted">
                    <img
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute right-2 top-2">{profile.location}</Badge>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{profile.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedProfile(profile)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Show on Map
                  </Button>
                  <Button asChild>
                    <Link href={`/profile/${profile.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No profiles found</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedLocation("")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Map Modal */}
      {selectedProfile && (
        <Sheet open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <SheetContent side="bottom" className="h-[70vh] sm:h-[80vh]">
            <SheetHeader>
              <SheetTitle>Location: {selectedProfile.name}</SheetTitle>
              <SheetDescription>{selectedProfile.address}</SheetDescription>
            </SheetHeader>
            <div className="mt-4 h-[calc(100%-5rem)]">
              <MapComponent
                address={selectedProfile.address}
                name={selectedProfile.name}
                coordinates={selectedProfile.coordinates}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
      {/* New Profile Dialog */}
      <Dialog open={showNewProfileDialog} onOpenChange={setShowNewProfileDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-scroll">
          <DialogHeader>
            <DialogTitle>Add New Profile</DialogTitle>
            <DialogDescription>Create a new profile with all the necessary information.</DialogDescription>
          </DialogHeader>
          <ProfileForm onSubmit={handleAddProfile} isSubmitting={isSubmitting}  />
        </DialogContent>
      </Dialog>
    </div>
  )
}
