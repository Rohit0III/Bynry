"use client"

import { useState, useEffect } from "react"

// Type definitions for better type safety
export interface Profile {
  id: string
  name: string
  email: string
  phone: string
  title: string
  description: string
  address: string
  location: string
  work: string
  joined: string
  interests: string
  image: string
  avatar: string
  coordinates: [number, number]
}

// Storage key for profiles in localStorage
const STORAGE_KEY = "profile-explorer-data"

// Initial mock data with more readable formatting
const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    title: "Software Engineer",
    description:
      "Experienced software engineer with a passion for building user-friendly applications. Specializes in frontend development with React and TypeScript.",
    address: "123 Tech Avenue, San Francisco, CA 94107",
    location: "San Francisco",
    work: "Acme Inc.",
    joined: "January 2020",
    interests: "Hiking, photography, coding, and exploring new technologies.",
    image: "https://source.unsplash.com/random/800x600/?city",
    avatar: "https://source.unsplash.com/random/200x200/?man",
    coordinates: [-122.4194, 37.7749],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    title: "UX Designer",
    description:
      "Creative UX designer with 5+ years of experience creating intuitive and beautiful user interfaces. Passionate about accessibility and inclusive design.",
    address: "456 Design Street, New York, NY 10001",
    location: "New York",
    work: "Design Co.",
    joined: "March 2019",
    interests: "Art, design, travel, and cooking.",
    image: "https://source.unsplash.com/random/800x600/?design",
    avatar: "https://source.unsplash.com/random/200x200/?woman",
    coordinates: [-73.9857, 40.7484],
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 456-7890",
    title: "Product Manager",
    description:
      "Strategic product manager with a track record of launching successful products. Focused on user-centric solutions and data-driven decision making.",
    address: "789 Product Road, Austin, TX 78701",
    location: "Austin",
    work: "Tech Solutions LLC",
    joined: "June 2021",
    interests: "Technology trends, market research, and outdoor activities.",
    image: "https://source.unsplash.com/random/800x600/?tech",
    avatar: "https://source.unsplash.com/random/200x200/?man",
    coordinates: [-97.7431, 30.2672],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 234-5678",
    title: "Marketing Specialist",
    description:
      "Results-driven marketing specialist with expertise in digital marketing campaigns and brand development. Skilled in social media strategy and content creation.",
    address: "101 Marketing Blvd, Chicago, IL 60601",
    location: "Chicago",
    work: "Brand Masters",
    joined: "April 2018",
    interests: "Digital marketing, social media, writing, and yoga.",
    image: "https://source.unsplash.com/random/800x600/?marketing",
    avatar: "https://source.unsplash.com/random/200x200/?woman",
    coordinates: [-87.6298, 41.8781],
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+1 (555) 876-5432",
    title: "Data Scientist",
    description:
      "Analytical data scientist specializing in machine learning and predictive modeling. Experienced in transforming complex data into actionable insights.",
    address: "202 Data Drive, Seattle, WA 98101",
    location: "Seattle",
    work: "Data Insights Inc.",
    joined: "September 2020",
    interests: "Machine learning, statistics, hiking, and chess.",
    image: "https://source.unsplash.com/random/800x600/?data",
    avatar: "https://source.unsplash.com/random/200x200/?man",
    coordinates: [-122.3321, 47.6062],
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    phone: "+1 (555) 345-6789",
    title: "HR Manager",
    description:
      "Compassionate HR manager dedicated to creating positive workplace cultures. Experienced in talent acquisition, employee development, and conflict resolution.",
    address: "303 HR Street, Denver, CO 80202",
    location: "Denver",
    work: "People First Co.",
    joined: "February 2017",
    interests: "People management, workplace culture, reading, and skiing.",
    image: "https://source.unsplash.com/random/800x600/?office",
    avatar: "https://source.unsplash.com/random/200x200/?woman",
    coordinates: [-104.9903, 39.7392],
  },
]

// Utility functions for localStorage
const storageUtils = {
  // Save data to localStorage with pretty formatting
  saveProfiles: (profiles: Profile[]): void => {
    try {
      const formattedData = JSON.stringify(profiles, null, 2) // Pretty print with 2 spaces
      localStorage.setItem(STORAGE_KEY, formattedData)
      console.log("Profiles saved to localStorage successfully")
    } catch (error) {
      console.error("Error saving profiles to localStorage:", error)
    }
  },

  // Load data from localStorage
  loadProfiles: (): Profile[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return mockProfiles
      return JSON.parse(data)
    } catch (error) {
      console.error("Error loading profiles from localStorage:", error)
      return mockProfiles
    }
  },

  // Initialize localStorage with mock data if empty
  initializeStorage: (): void => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        storageUtils.saveProfiles(mockProfiles)
        console.log("Initialized localStorage with mock profiles")
      }
    } catch (error) {
      console.error("Error initializing localStorage:", error)
    }
  },

  // Clear all profile data
  clearProfiles: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log("Profiles cleared from localStorage")
    } catch (error) {
      console.error("Error clearing profiles from localStorage:", error)
    }
  },
}

// Hook for managing profiles
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch profiles from localStorage
    const fetchProfiles = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Initialize storage if needed
        storageUtils.initializeStorage()

        // Load profiles
        const loadedProfiles = storageUtils.loadProfiles()
        setProfiles(loadedProfiles)
      } catch (error) {
        console.error("Error fetching profiles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  // Add a new profile
  const addProfile = async (profileData: Omit<Profile, "id" | "coordinates">): Promise<Profile> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newProfile: Profile = {
      ...profileData,
      id: `profile_${Date.now()}`,
      // Generate random coordinates for the map
      coordinates: [
        -98 + Math.random() * 50, // longitude
        30 + Math.random() * 20, // latitude
      ] as [number, number],
    }

    const updatedProfiles = [...profiles, newProfile]
    setProfiles(updatedProfiles)
    storageUtils.saveProfiles(updatedProfiles)

    return newProfile
  }

  // Update an existing profile
  const updateProfile = async (id: string, profileData: Partial<Profile>): Promise<Profile | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const profileIndex = profiles.findIndex((profile) => profile.id === id)

    if (profileIndex === -1) {
      console.error(`Profile with ID ${id} not found`)
      return null
    }

    const updatedProfile = {
      ...profiles[profileIndex],
      ...profileData,
    }

    const updatedProfiles = [...profiles]
    updatedProfiles[profileIndex] = updatedProfile

    setProfiles(updatedProfiles)
    storageUtils.saveProfiles(updatedProfiles)

    return updatedProfile
  }

  // Delete a profile
  const deleteProfile = async (id: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const updatedProfiles = profiles.filter((profile) => profile.id !== id)

    if (updatedProfiles.length === profiles.length) {
      console.error(`Profile with ID ${id} not found`)
      return false
    }

    setProfiles(updatedProfiles)
    storageUtils.saveProfiles(updatedProfiles)

    return true
  }

  // Reset to initial mock data
  const resetProfiles = async (): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setProfiles(mockProfiles)
    storageUtils.saveProfiles(mockProfiles)
  }

  return {
    profiles,
    isLoading,
    addProfile,
    updateProfile,
    deleteProfile,
    resetProfiles,
  }
}

// Hook for fetching a single profile
export function useProfile(id: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Initialize storage if needed
        storageUtils.initializeStorage()

        // Load profiles and find the requested one
        const profiles = storageUtils.loadProfiles()
        const foundProfile = profiles.find((p) => p.id === id)
        setProfile(foundProfile || null)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProfile()
    }
  }, [id])

  return { profile, isLoading }
}
