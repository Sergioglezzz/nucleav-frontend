"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

interface DashboardStats {
  companies: {
    total: number
    myCompanies: number
    recentlyCreated: number
  }
  materials: {
    total: number
    videos: number
    images: number
    audio: number
    documents: number
    totalSize: string
  }
  projects: {
    total: number
    completed: number
    inProgress: number
    pending: number
    delayed: number
  }
  activity: {
    uploadsToday: number
    activeUsers: number
    completedTasksWeek: number
  }
}

interface RecentActivity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: string
  type: "upload" | "create" | "update" | "delete"
}

interface Company {
  cif: string
  name: string
  logo_url?: string
  created_at: string
  is_active: boolean
}

interface Material {
  id: string
  name: string
  type: "video" | "image" | "audio" | "document"
  file_size: number
  created_at: string
  thumbnail_url?: string
  duration?: string
  resolution?: string
}

export function useDashboardData() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    if (!session?.accessToken) return

    setLoading(true)
    setError(null)

    try {
      // Fetch companies
      const companiesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })

      // Fetch materials
      const materialsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })

      const companiesData = companiesResponse.data
      const materialsData = materialsResponse.data

      setCompanies(companiesData)
      setMaterials(materialsData)

      // Calculate stats from real data
      const materialsByType = materialsData.reduce(
        (acc: Record<Material["type"], number>, material: Material) => {
          acc[material.type] = (acc[material.type] || 0) + 1
          return acc
        },
        { video: 0, image: 0, audio: 0, document: 0 }
      )

      const totalSize = materialsData.reduce((acc: number, material: Material) => {
        return acc + (material.file_size || 0)
      }, 0)

      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
      }

      const calculatedStats: DashboardStats = {
        companies: {
          total: companiesData.length,
          myCompanies: companiesData.filter((c: Company) => c.is_active).length,
          recentlyCreated: companiesData.filter((c: Company) => {
            const createdDate = new Date(c.created_at)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return createdDate > weekAgo
          }).length,
        },
        materials: {
          total: materialsData.length,
          videos: materialsByType.video || 0,
          images: materialsByType.image || 0,
          audio: materialsByType.audio || 0,
          documents: materialsByType.document || 0,
          totalSize: formatFileSize(totalSize),
        },
        projects: {
          total: 0, // Will be implemented when projects API is available
          completed: 0,
          inProgress: 0,
          pending: 0,
          delayed: 0,
        },
        activity: {
          uploadsToday: materialsData.filter((m: Material) => {
            const uploadDate = new Date(m.created_at)
            const today = new Date()
            return uploadDate.toDateString() === today.toDateString()
          }).length,
          activeUsers: companiesData.length, // Placeholder
          completedTasksWeek: 0, // Placeholder
        },
      }

      setStats(calculatedStats)

      // Generate recent activities from real data
      const recentActivities: RecentActivity[] = [
        ...materialsData.slice(0, 5).map((material: Material) => ({
          id: `material-${material.id}`,
          user: {
            name: "Usuario",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "subió",
          target: material.name,
          timestamp: new Date(material.created_at).toLocaleDateString(),
          type: "upload" as const,
        })),
        ...companiesData.slice(0, 3).map((company: Company) => ({
          id: `company-${company.cif}`,
          user: {
            name: "Usuario",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "creó la empresa",
          target: company.name,
          timestamp: new Date(company.created_at).toLocaleDateString(),
          type: "create" as const,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setActivities(recentActivities.slice(0, 8))
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Error al cargar los datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchDashboardData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken])

  return {
    stats,
    companies,
    materials,
    activities,
    loading,
    error,
    refetch: fetchDashboardData,
  }
}
