"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Loader, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// We'll use a conditional import for mapbox-gl to avoid errors when the token is invalid
let mapboxgl: any = null

// This function will be called only when we're sure we want to try loading the map
const loadMapboxGL = async () => {
  try {
    const mapboxModule = await import("mapbox-gl")
    await import("mapbox-gl/dist/mapbox-gl.css")
    return mapboxModule.default
  } catch (error) {
    console.error("Failed to load Mapbox GL:", error)
    return null
  }
}

interface MapComponentProps {
  address: string
  name: string
  coordinates?: [number, number] // Optional coordinates if already known
}

export function MapComponent({ address, name, coordinates }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [tokenInput, setTokenInput] = useState("")

  // Function to initialize the map
  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return
    setLoading(true)
    setError(null)

    try {
      // Load Mapbox GL dynamically
      mapboxgl = await loadMapboxGL()

      if (!mapboxgl) {
        throw new Error("Failed to load Mapbox GL")
      }

      // Set the access token
      mapboxgl.accessToken = token

      let lng: number
      let lat: number

      if (coordinates) {
        // Use provided coordinates
        ;[lng, lat] = coordinates
      } else {
        // For demo purposes, use some default coordinates
        // In a real app, you would use a geocoding service
        lng = -74.006 + Math.random() * 0.02
        lat = 40.7128 + Math.random() * 0.02
      }

      if (map.current) {
        map.current.remove()
      }

      // Create the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: 14,
      })

      // Handle map load event
      map.current.on("load", () => {
        setLoading(false)

        // Add marker
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${address}</p>`))
          .addTo(map.current)
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Save the token to localStorage for future use
      localStorage.setItem("mapbox_token", token)
      setMapboxToken(token)
    } catch (err) {
      console.error("Error initializing map:", err)
      setError("Failed to load map. Please check your Mapbox token.")
      setLoading(false)
    }
  }

  // Try to load the map on component mount
  useEffect(() => {
    // Check if we have a token in localStorage
    const savedToken = localStorage.getItem("mapbox_token")

    if (savedToken) {
      setMapboxToken(savedToken)
      initializeMap(savedToken)
    } else {
      // No token found, show the token input UI
      setLoading(false)
      setError("Mapbox token required")
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [address, name, coordinates])

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenInput.trim().startsWith("pk.")) {
      initializeMap(tokenInput.trim())
    } else {
      setError("Invalid Mapbox token. It should start with 'pk.'")
    }
  }

  // Render a fallback UI when no token is available
  if (!mapboxToken && !loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20 p-4">
        {showTokenInput ? (
          <div className="w-full max-w-md space-y-4">
            <Alert>
              <AlertTitle>Mapbox token required</AlertTitle>
              <AlertDescription>
                Enter your Mapbox public token to display the map. You can get a free token at{" "}
                <a
                  href="https://account.mapbox.com/auth/signup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  mapbox.com
                </a>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleTokenSubmit} className="space-y-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="pk.your_mapbox_token_here"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {error && error !== "Mapbox token required" && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowTokenInput(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Token</Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-muted p-3">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Map display unavailable</h3>
            <p className="text-sm text-muted-foreground">
              A Mapbox token is required to display the map for this location.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowTokenInput(true)}>Add Mapbox Token</Button>
              <Button variant="outline" asChild>
                <a
                  href="https://account.mapbox.com/auth/signup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Get Free Token <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show error state
  if (error && error !== "Mapbox token required") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20 p-4">
        <Alert variant="destructive">
          <AlertTitle>Error loading map</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="link"
              className="mt-2 h-auto p-0"
              onClick={() => {
                localStorage.removeItem("mapbox_token")
                setMapboxToken(null)
                setError(null)
              }}
            >
              Reset Mapbox token
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show loading state or the map
  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full rounded-md" />
    </div>
  )
}
