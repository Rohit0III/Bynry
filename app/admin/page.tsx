"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProfiles } from "@/hooks/use-profiles"
import { MapComponent } from "@/components/map-component"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const router = useRouter()
  const { profiles, isLoading, deleteProfile, resetProfiles } = useProfiles()
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null)

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async () => {
    if (profileToDelete) {
      await deleteProfile(profileToDelete)
      setShowDeleteDialog(false)
      setProfileToDelete(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => router.push("/admin/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Profile
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search profiles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            View Public Page
          </Button>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to reset all profiles to the default data? This will delete any custom profiles.",
                )
              ) {
                resetProfiles()
              }
            }}
          >
            Reset to Default Data
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            Logout
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading profiles...
                  </TableCell>
                </TableRow>
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No profiles found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{profile.location}</TableCell>
                    <TableCell>{profile.title}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => setSelectedProfile(profile)}>
                          <MapPin className="h-4 w-4" />
                          <span className="sr-only">View on map</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => router.push(`/admin/edit/${profile.id}`)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setProfileToDelete(profile.id)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Map Dialog */}
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Location: {selectedProfile?.name}</DialogTitle>
              <DialogDescription>{selectedProfile?.address}</DialogDescription>
            </DialogHeader>
            <div className="h-[400px] w-full">
              {selectedProfile && (
                <MapComponent
                  address={selectedProfile.address}
                  name={selectedProfile.name}
                  coordinates={selectedProfile.coordinates}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this profile? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
