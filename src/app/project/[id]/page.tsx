/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Grid,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  Sheet,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy"
import {
  ArrowBackIos,
  Edit,
  Delete,
  Share,
  Download,
  Movie,
  Tv,
  Campaign,
  Work,
  Business,
  Group,
  Folder,
  PlayArrow,
  Pause,
  CheckCircle,
  Cancel,
  Schedule,
  Settings,
  Timeline,
  People,
  Add,
  Star,
  StarBorder,
  PersonRemove,
  MoreVert,
} from "@mui/icons-material"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useNotification } from "@/components/context/NotificationContext"
import { useState, useEffect } from "react"
import { useColorScheme } from "@mui/joy/styles"
import axios from "axios"
import ColumnLayout from "@/components/ColumnLayout"
import DeleteProjectModal from "../components/DeleteProjectModal"
import CustomTabs from "@/components/CustomTabs"
import MaterialSelectModal from "../components/MaterialSelectModal"
import TeamMemberSelectModal from "../components/TeamMemberSelectModal"

// Enumeración para tipos de proyecto
enum ProjectType {
  FILM = "film",
  TV = "tv",
  ADVERTISING = "advertising",
  OTHER = "other",
}

// Interfaces
interface Project {
  id: number
  company_cif: string
  company: {
    name: string
    logo_url?: string | null
  }
  created_by: number
  creator: {
    name: string
    lastname: string
    username: string
  }
  name: string
  description?: string
  type: ProjectType
  start_date?: string
  end_date?: string
  status: string
  is_collaborative: boolean
  created_at: string
  updated_at: string
  materials_count?: number
  team_members?: number
  progress?: number
}

interface ProjectUser {
  id: number
  user_id: number
  project_id: number
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    lastname: string
    username: string
    email: string
    avatar_url?: string
  }
}

interface Material {
  id: number
  name: string
  type: string
  size: number
  uploaded_at: string
  uploaded_by: {
    name: string
    lastname: string
  }
  url?: string
}

interface Activity {
  id: number
  type: string
  description: string
  user: {
    name: string
    lastname: string
    username: string
  }
  created_at: string
}

interface ProjectMaterial {
  id: number
  material_id: number
  project_id: number
  quantity_assigned: number
  material: {
    id: number
    name: string
    description?: string
    category?: string
    location?: string
    serial_number?: string
    is_consumible: boolean
    quantity: number
  }
  project: {
    id: number
    name: string
  }
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const { mode } = useColorScheme()

  // Estados
  const [project, setProject] = useState<Project | null>(null)
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>([])
  const [materialSelectOpen, setMaterialSelectOpen] = useState(false)
  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [teamMemberSelectOpen, setTeamMemberSelectOpen] = useState(false)
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false)

  // Cargar datos del proyecto
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!session?.accessToken) return

      setLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const projectData = response.data.data || response.data
        setProject(projectData)

        // Cargar materiales del proyecto usando la tabla intermedia
        const materialsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/project-materials`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        // Filtrar solo los materiales de este proyecto
        const allProjectMaterials = materialsResponse.data.data || materialsResponse.data || []
        const projectSpecificMaterials = allProjectMaterials.filter((pm: any) => pm.project_id === Number(projectId))

        // Si algunos materiales no tienen datos relacionados, cargarlos
        const materialsWithCompleteData = await Promise.all(
          projectSpecificMaterials.map(async (pm: any) => {
            if (!pm.material) {
              try {
                const materialResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/v1/materials/${pm.material_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${session.accessToken}`,
                    },
                  },
                )

                const materialData = materialResponse.data.data || materialResponse.data

                return {
                  ...pm,
                  material: materialData,
                  project: {
                    id: Number(projectId),
                    name: projectData.name,
                  },
                }
              } catch (materialError) {
                console.error(`Error al cargar material ${pm.material_id}:`, materialError)
                return pm // Devolver el original si falla
              }
            }
            return pm
          }),
        )

        setProjectMaterials(materialsWithCompleteData.filter((pm) => pm.material)) // Solo incluir los que tienen datos del material

        // Cargar usuarios del proyecto
        const projectUsersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/project-users`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        // Filtrar solo los usuarios de este proyecto
        const allProjectUsers = projectUsersResponse.data.data || projectUsersResponse.data || []
        const projectSpecificUsers = allProjectUsers.filter((pu: any) => pu.project_id === Number(projectId))

        // Si algunos usuarios no tienen datos de usuario, cargarlos
        const projectUsersWithCompleteData = await Promise.all(
          projectSpecificUsers.map(async (pu: any) => {
            if (!pu.user) {
              try {
                const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${pu.user_id}`, {
                  headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                  },
                })

                const userData = userResponse.data.data || userResponse.data

                return {
                  ...pu,
                  user: userData,
                }
              } catch (userError) {
                console.error(`Error al cargar usuario ${pu.user_id}:`, userError)
                return pu // Devolver el original si falla
              }
            }
            return pu
          }),
        )

        setProjectUsers(projectUsersWithCompleteData.filter((pu) => pu.user)) // Solo incluir los que tienen datos del usuario

        setActivities([
          {
            id: 1,
            type: "upload",
            description: "subió el archivo Guión_Final_v3.pdf",
            user: { name: "Ana", lastname: "García", username: "ana.garcia" },
            created_at: "2024-01-25T10:30:00Z",
          },
          {
            id: 2,
            type: "status_change",
            description: "cambió el estado del proyecto a 'En progreso'",
            user: { name: "Carlos", lastname: "López", username: "carlos.lopez" },
            created_at: "2024-01-24T15:45:00Z",
          },
          {
            id: 3,
            type: "member_added",
            description: "añadió a María Rodríguez al equipo",
            user: { name: "Ana", lastname: "García", username: "ana.garcia" },
            created_at: "2024-01-23T09:15:00Z",
          },
        ])
      } catch (error: unknown) {
        console.error("Error al cargar proyecto:", error)

        let errorMessage = "Error al cargar el proyecto"
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            errorMessage = "No tienes permisos para ver este proyecto"
          } else if (error.response?.status === 404) {
            errorMessage = "El proyecto no existe"
          }
        }

        setError(errorMessage)
        showNotification(errorMessage, "error")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [session?.accessToken, projectId, showNotification])

  // Agregar función para notificar cambios al componente padre
  const notifyMaterialCountChange = () => {
    // Emitir evento personalizado para notificar cambios
    window.dispatchEvent(
      new CustomEvent("materialCountChanged", {
        detail: { projectId: Number(projectId) },
      }),
    )
  }

  // Función para agregar material al proyecto
  const handleAddMaterial = async (materialId: number, quantity: number) => {
    if (!session?.accessToken) return

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/project-materials`,
        {
          project_id: Number(projectId),
          material_id: materialId,
          quantity_assigned: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      const newProjectMaterial = response.data.data || response.data

      // Si la respuesta no incluye los datos del material, los obtenemos por separado
      if (!newProjectMaterial.material) {
        try {
          const materialResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials/${materialId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          const materialData = materialResponse.data.data || materialResponse.data

          // Construir el objeto completo
          const completeProjectMaterial = {
            ...newProjectMaterial,
            material: materialData,
            project: {
              id: Number(projectId),
              name: project?.name || "",
            },
          }

          setProjectMaterials((prev) => [...prev, completeProjectMaterial])
        } catch (materialError) {
          console.error("Error al obtener datos del material:", materialError)
          // Fallback: recargar todos los materiales del proyecto
          const materialsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/project-materials`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          const allProjectMaterials = materialsResponse.data.data || materialsResponse.data || []
          const projectSpecificMaterials = allProjectMaterials.filter((pm: any) => pm.project_id === Number(projectId))
          setProjectMaterials(projectSpecificMaterials)
        }
      } else {
        // Si la respuesta incluye los datos del material, usarla directamente
        setProjectMaterials((prev) => [...prev, newProjectMaterial])
      }

      showNotification("Material agregado al proyecto correctamente", "success")
      setMaterialSelectOpen(false)

      // Notificar cambio en el contador de materiales
      notifyMaterialCountChange()
    } catch (error: unknown) {
      console.error("Error al agregar material:", error)
      let errorMessage = "Error al agregar el material al proyecto"
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = "El material ya está asignado al proyecto"
        } else if (error.response?.status === 404) {
          errorMessage = "Material no encontrado"
        }
      }
      showNotification(errorMessage, "error")
    }
  }

  // Función para agregar usuario al proyecto
  const handleAddTeamMember = async (userId: number) => {
    if (!session?.accessToken) return

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/project-users`,
        {
          project_id: Number(projectId),
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      const newProjectUser = response.data.data || response.data

      // Si la respuesta no incluye los datos del usuario, los obtenemos por separado
      if (!newProjectUser.user) {
        try {
          const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          const userData = userResponse.data.data || userResponse.data

          // Construir el objeto completo
          const completeProjectUser = {
            ...newProjectUser,
            user: userData,
          }

          setProjectUsers((prev) => [...prev, completeProjectUser])
        } catch (userError) {
          console.error("Error al obtener datos del usuario:", userError)
          // Fallback: recargar todos los usuarios del proyecto
          const projectUsersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/project-users`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          const allProjectUsers = projectUsersResponse.data.data || projectUsersResponse.data || []
          const projectSpecificUsers = allProjectUsers.filter((pu: any) => pu.project_id === Number(projectId))
          setProjectUsers(projectSpecificUsers)
        }
      } else {
        // Si la respuesta incluye los datos del usuario, usarla directamente
        setProjectUsers((prev) => [...prev, newProjectUser])
      }

      showNotification("Usuario agregado al proyecto correctamente", "success")
      setTeamMemberSelectOpen(false)
    } catch (error: unknown) {
      console.error("Error al agregar usuario:", error)
      let errorMessage = "Error al agregar el usuario al proyecto"
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = "El usuario ya es miembro del proyecto"
        } else if (error.response?.status === 404) {
          errorMessage = "Usuario no encontrado"
        }
      }
      showNotification(errorMessage, "error")
    }
  }

  // Modificar handleRemoveMaterial para notificar cambios
  const handleRemoveMaterial = async (projectMaterialId: number) => {
    if (!session?.accessToken) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/project-materials/${projectMaterialId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      setProjectMaterials((prev) => prev.filter((pm) => pm.id !== projectMaterialId))
      showNotification("Material removido del proyecto", "success")

      // Notificar cambio en el contador de materiales
      notifyMaterialCountChange()
    } catch (error: unknown) {
      console.error("Error al remover material:", error)
      showNotification("Error al remover el material del proyecto", "error")
    }
  }

  // Función para remover usuario del proyecto
  const handleRemoveTeamMember = async (projectUserId: number) => {
    if (!session?.accessToken) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/project-users/${projectUserId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      setProjectUsers((prev) => prev.filter((pu) => pu.id !== projectUserId))
      showNotification("Usuario removido del proyecto", "success")
    } catch (error: unknown) {
      console.error("Error al remover usuario:", error)
      showNotification("Error al remover el usuario del proyecto", "error")
    }
  }

  // Obtener icono según tipo de proyecto
  const getProjectTypeIcon = (type: ProjectType) => {
    switch (type) {
      case ProjectType.FILM:
        return <Movie />
      case ProjectType.TV:
        return <Tv />
      case ProjectType.ADVERTISING:
        return <Campaign />
      case ProjectType.OTHER:
      default:
        return <Work />
    }
  }

  // Obtener color según estado del proyecto
  const getStatusColor = (status: string): "primary" | "success" | "warning" | "danger" | "neutral" => {
    switch (status) {
      case "completed":
        return "success"
      case "in_progress":
        return "primary"
      case "planning":
        return "warning"
      case "cancelled":
        return "danger"
      case "draft":
      default:
        return "neutral"
    }
  }

  // Obtener texto según estado del proyecto
  const getStatusText = (status: string): string => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in_progress":
        return "En progreso"
      case "planning":
        return "Planificación"
      case "cancelled":
        return "Cancelado"
      case "draft":
      default:
        return "Borrador"
    }
  }

  // Obtener icono según estado del proyecto
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle />
      case "in_progress":
        return <PlayArrow />
      case "planning":
        return <Schedule />
      case "cancelled":
        return <Cancel />
      case "draft":
      default:
        return <Pause />
    }
  }

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No definida"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Formatear fecha relativa
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de una hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    if (diffInHours < 48) return "Hace 1 día"
    return `Hace ${Math.floor(diffInHours / 24)} días`
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Obtener icono según tipo de archivo
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Movie sx={{ color: "#ff6b6b" }} />
      case "audio":
        return <Folder sx={{ color: "#4ecdc4" }} />
      case "document":
        return <Folder sx={{ color: "#45b7d1" }} />
      default:
        return <Folder sx={{ color: "#96ceb4" }} />
    }
  }

  // Calcular progreso del proyecto
  const calculateProgress = () => {
    if (!project) return 0
    switch (project.status) {
      case "draft":
        return 10
      case "planning":
        return 25
      case "in_progress":
        return 60
      case "completed":
        return 100
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  // Eliminar proyecto con mejor manejo de errores
  const handleDeleteProject = async () => {
    if (!session?.accessToken) return

    setDeleting(true)
    try {
      // Intentar eliminar el proyecto
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      showNotification("Proyecto eliminado correctamente", "success")
      router.push("/project")
    } catch (error: unknown) {
      console.error("Error al eliminar proyecto:", error)

      let errorMessage = "Error al eliminar el proyecto"

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const responseData = error.response?.data

        switch (status) {
          case 401:
            errorMessage = "No tienes permisos para eliminar este proyecto"
            break
          case 403:
            errorMessage = "No tienes autorización para eliminar este proyecto"
            break
          case 404:
            errorMessage = "El proyecto no existe o ya fue eliminado"
            break
          case 409:
            errorMessage = "No se puede eliminar el proyecto porque tiene dependencias activas"
            break
          case 500:
            // Error del servidor - probablemente problema con eliminación en cascada
            if (responseData?.message) {
              errorMessage = `Error del servidor: ${responseData.message}`
            } else {
              errorMessage =
                "Error interno del servidor. El proyecto tiene relaciones que impiden su eliminación. Contacta al administrador."
            }

            // Log adicional para debugging
            console.error("Detalles del error 500:", {
              projectId,
              materialsCount: projectMaterials.length,
              usersCount: projectUsers.length,
              error: responseData,
            })
            break
          default:
            if (responseData?.message) {
              errorMessage = responseData.message
            }
        }
      }

      showNotification(errorMessage, "error")
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
    }
  }

  // Obtener iniciales del usuario
  const getUserInitials = (user: { name: string; lastname: string }) => {
    return `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
  }

  // Mostrar loading
  if (loading) {
    return (
      <ColumnLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
          <CircularProgress
            size="lg"
            sx={{
              "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
              "--CircularProgress-progressColor": "#ffbc62",
            }}
          />
        </Box>
      </ColumnLayout>
    )
  }

  // Mostrar error
  if (error || !project) {
    return (
      <ColumnLayout>
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
          <Alert variant="soft" color="danger" sx={{ mb: 2 }}>
            {error || "No se pudo cargar el proyecto"}
          </Alert>
          <Button variant="outlined" onClick={() => router.push("/project")} startDecorator={<ArrowBackIos />}>
            Volver a proyectos
          </Button>
        </Box>
      </ColumnLayout>
    )
  }

  // Opciones para las pestañas del proyecto
  const projectTabOptions = [
    {
      value: "0",
      label: "Actividad",
      shortLabel: "Act.",
      icon: <Timeline />,
    },
    {
      value: "1",
      label: "Materiales",
      shortLabel: "Mat.",
      icon: <Folder />,
      badge: projectMaterials.length,
    },
    {
      value: "2",
      label: "Equipo",
      shortLabel: "Eq.",
      icon: <People />,
      badge: projectUsers.length,
    },
    {
      value: "3",
      label: "Configuración",
      shortLabel: "Conf.",
      icon: <Settings />,
    },
  ]

  return (
    <ColumnLayout>
      <Box sx={{ mb: 3 }}>
        {/* Header del proyecto */}
        <Card
          variant="outlined"
          sx={{
            mb: 3,
            background:
              mode === "dark"
                ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            position: "relative",
          }}
        >
          {/* Menú móvil - posicionado absolutamente */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "absolute",
              top: 14,
              right: 16,
              zIndex: 10,
            }}
          >
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                  root: {
                    variant: "plain",
                    size: "sm",
                    color: "neutral",
                  },
                }}
              >
                <MoreVert />
              </MenuButton>
              <Menu placement="bottom-end">
                <MenuItem onClick={() => setIsFavorite(!isFavorite)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isFavorite ? <Star sx={{ color: "#ffbc62" }} /> : <StarBorder />}
                    {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                  </Box>
                </MenuItem>
                <MenuItem>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Share fontSize="small" />
                    Compartir
                  </Box>
                </MenuItem>
                <MenuItem>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Download fontSize="small" />
                    Descargar
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => router.push(`/project/edit/${project.id}`)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Edit fontSize="small" />
                    Editar
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => setDeleteConfirmOpen(true)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "danger.500" }}>
                    <Delete fontSize="small" />
                    Eliminar
                  </Box>
                </MenuItem>
              </Menu>
            </Dropdown>
          </Box>

          <CardContent sx={{ p: { xs: 1.5, sm: 1 } }}>
            <Grid container spacing={3}>
              {/* Columna izquierda - Información principal */}
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  {/* Header con navegación y título */}
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <IconButton
                      variant="soft"
                      size="sm"
                      color="neutral"
                      onClick={() => router.push("/project")}
                      sx={{
                        padding: "6px",
                        borderRadius: "50%",
                        backdropFilter: "blur(4px)",
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                      }}
                    >
                      <ArrowBackIos fontSize="small" sx={{ marginRight: -1 }} />
                    </IconButton>

                    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, pr: { xs: 5, md: 0 } }}>
                      <Typography
                        level="h3"
                        sx={{
                          color: "#ffbc62",
                          fontSize: { xs: "1.25rem", sm: "1.5rem" },
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Business sx={{ color: "#ffbc62", fontSize: 20 }} />
                        <Typography level="body-sm" color="neutral">
                          {project.company.name}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Sheet con tipo de proyecto y descripción */}
                  <Sheet
                    variant="soft"
                    sx={{
                      p: 2,
                      borderRadius: "md",
                      bgcolor: "background.level1",
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Tipo de proyecto */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "lg",
                            bgcolor: "rgba(255, 188, 98, 0.2)",
                            color: "#ffbc62",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                          }}
                        >
                          {getProjectTypeIcon(project.type)}
                        </Box>
                        <Box>
                          <Typography level="body-sm" color="neutral">
                            Tipo de proyecto
                          </Typography>
                          <Typography level="body-md" fontWeight="xs">
                            {project.type === "film"
                              ? "Cine"
                              : project.type === "tv"
                                ? "TV"
                                : project.type === "advertising"
                                  ? "Publicidad"
                                  : "Otro"}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: "auto" }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              variant="soft"
                              color={getStatusColor(project.status)}
                              size="sm"
                              startDecorator={getStatusIcon(project.status)}
                            >
                              {getStatusText(project.status)}
                            </Chip>
                            {project.is_collaborative && (
                              <Chip
                                variant="soft"
                                color="primary"
                                size="sm"
                                sx={{ bgcolor: "rgba(255, 188, 98, 0.2)", color: "#ffbc62" }}
                              >
                                Colaborativo
                              </Chip>
                            )}
                          </Stack>
                        </Box>
                      </Box>

                      {/* Divider */}
                      <Divider />

                      {/* Descripción */}
                      {project.description ? (
                        <Typography level="body-sm" color="neutral">
                          {project.description}
                        </Typography>
                      ) : (
                        <Typography level="body-sm" color="neutral" sx={{ fontStyle: "italic" }}>
                          Sin descripción
                        </Typography>
                      )}

                      <Divider />
                    </Stack>

                    {/* Contadores */}
                    <Stack spacing={1} direction="row" sx={{ mt: 2, gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Group sx={{ color: "#ffbc62", fontSize: 20 }} />
                        <Typography level="body-sm" fontWeight="md">
                          {projectUsers.length} miembros del equipo
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Folder sx={{ color: "#ffbc62", fontSize: 20 }} />
                        <Typography level="body-sm" fontWeight="md">
                          {projectMaterials.length} materiales asignados
                        </Typography>
                      </Box>
                    </Stack>
                  </Sheet>
                </Stack>
              </Grid>

              {/* Columna derecha - Acciones y progreso */}
              <Grid xs={12} md={4}>
                <Stack spacing={2}>
                  {/* Acciones - Solo desktop */}
                  <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "flex-end", gap: 1, mb: 6 }}>
                    <IconButton variant="plain" size="sm" color="neutral" onClick={() => setIsFavorite(!isFavorite)}>
                      {isFavorite ? <Star sx={{ color: "#ffbc62" }} /> : <StarBorder />}
                    </IconButton>
                    <IconButton variant="plain" size="sm" color="neutral">
                      <Share />
                    </IconButton>
                    <Dropdown>
                      <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: {
                            variant: "plain",
                            size: "sm",
                            color: "neutral",
                          },
                        }}
                      >
                        <MoreVert />
                      </MenuButton>
                      <Menu placement="bottom-end">
                        <MenuItem>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Download fontSize="small" />
                            Descargar
                          </Box>
                        </MenuItem>
                        <MenuItem onClick={() => router.push(`/project/edit/${project.id}`)}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Edit fontSize="small" />
                            Editar
                          </Box>
                        </MenuItem>
                        <MenuItem onClick={() => setDeleteConfirmOpen(true)}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "danger.500" }}>
                            <Delete fontSize="small" />
                            Eliminar
                          </Box>
                        </MenuItem>
                      </Menu>
                    </Dropdown>
                  </Box>

                  {/* Progreso del proyecto - Alineado con el sheet */}
                  <Stack sx={{ mt: { xs: 0, md: 2 } }}>
                    <Box>
                      <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
                        Progreso del proyecto
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <LinearProgress
                          determinate
                          value={calculateProgress()}
                          sx={{
                            flex: 1,
                            "--LinearProgress-progressColor": "#ffbc62",
                            "--LinearProgress-trackColor": "rgba(255, 188, 98, 0.2)",
                          }}
                        />
                        <Typography level="body-sm" fontWeight="md">
                          {calculateProgress()}%
                        </Typography>
                      </Box>
                    </Box>

                    {/* Cronograma */}
                    <Box sx={{ mt: 2 }}>
                      <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
                        Cronograma
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography level="body-xs">Inicio:</Typography>
                          <Typography level="body-xs" fontWeight="md">
                            {formatDate(project.start_date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography level="body-xs">Fin:</Typography>
                          <Typography level="body-xs" fontWeight="md">
                            {formatDate(project.end_date)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs de contenido */}
        <CustomTabs
          options={projectTabOptions}
          defaultValue={activeTab.toString()}
          onChange={(value) => setActiveTab(Number(value))}
        />

        {/* Contenido de los tabs */}
        <Box sx={{ mt: 3 }}>
          {/* Panel de Actividad */}
          {activeTab === 0 && (
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography level="title-md" sx={{ mb: 2 }}>
                  Actividad reciente
                </Typography>
                <Stack spacing={2}>
                  {activities.map((activity) => (
                    <Box key={activity.id} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Avatar size="sm" sx={{ bgcolor: "#ffbc62", color: "white" }}>
                        {activity.user.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-sm">
                          <strong>
                            {activity.user.name} {activity.user.lastname}
                          </strong>{" "}
                          {activity.description}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          {formatRelativeDate(activity.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Panel de Materiales */}
          {activeTab === 1 && (
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography level="title-md">Materiales del proyecto</Typography>
                  <Button
                    variant="outlined"
                    size="sm"
                    startDecorator={<Add />}
                    onClick={() => setMaterialSelectOpen(true)}
                    sx={{
                      color: "#ffbc62",
                      borderColor: "#ffbc62",
                      "&:hover": {
                        borderColor: "#ff9b44",
                        bgcolor: "rgba(255, 188, 98, 0.1)",
                      },
                    }}
                  >
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>Agregar material</Box>
                    <Box sx={{ display: { xs: "block", sm: "none" } }}>Agregar</Box>
                  </Button>
                </Box>

                {loadingMaterials ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size="sm" />
                  </Box>
                ) : projectMaterials.length === 0 ? (
                  <Sheet
                    variant="soft"
                    sx={{
                      p: 4,
                      borderRadius: "md",
                      textAlign: "center",
                      bgcolor: "background.level1",
                    }}
                  >
                    <Folder sx={{ fontSize: 48, color: "text.tertiary", mb: 2 }} />
                    <Typography level="title-md" sx={{ mb: 1 }}>
                      No hay materiales asignados
                    </Typography>
                    <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
                      Agrega materiales a este proyecto para comenzar a trabajar
                    </Typography>
                    <Button
                      variant="outlined"
                      startDecorator={<Add />}
                      onClick={() => setMaterialSelectOpen(true)}
                      sx={{
                        color: "#ffbc62",
                        borderColor: "#ffbc62",
                        "&:hover": {
                          borderColor: "#ff9b44",
                          bgcolor: "rgba(255, 188, 98, 0.1)",
                        },
                      }}
                    >
                      Agregar primer material
                    </Button>
                  </Sheet>
                ) : (
                  <Stack spacing={2}>
                    {projectMaterials.map((projectMaterial) => (
                      <Sheet
                        key={projectMaterial.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: "md",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          "&:hover": {
                            bgcolor: "background.level1",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "md",
                            bgcolor: "rgba(255, 188, 98, 0.2)",
                            color: "#ffbc62",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Folder />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            level="body-sm"
                            fontWeight="md"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {projectMaterial.material.name}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            {projectMaterial.material.category && `${projectMaterial.material.category} • `}
                            Cantidad asignada: {projectMaterial.quantity_assigned}
                            {projectMaterial.material.location && ` • ${projectMaterial.material.location}`}
                          </Typography>
                          {projectMaterial.material.description && (
                            <Typography
                              level="body-xs"
                              color="neutral"
                              sx={{
                                mt: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {projectMaterial.material.description}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          variant="soft"
                          size="sm"
                          color={projectMaterial.material.is_consumible ? "warning" : "primary"}
                        >
                          {projectMaterial.material.is_consumible ? "Consumible" : "Reutilizable"}
                        </Chip>
                        <IconButton
                          variant="plain"
                          size="sm"
                          color="danger"
                          onClick={() => handleRemoveMaterial(projectMaterial.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Sheet>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          )}

          {/* Panel de Equipo */}
          {activeTab === 2 && (
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography level="title-md">Miembros del equipo</Typography>
                  <Button
                    variant="outlined"
                    size="sm"
                    startDecorator={<Add />}
                    onClick={() => setTeamMemberSelectOpen(true)}
                    sx={{
                      color: "#ffbc62",
                      borderColor: "#ffbc62",
                      "&:hover": {
                        borderColor: "#ff9b44",
                        bgcolor: "rgba(255, 188, 98, 0.1)",
                      },
                    }}
                  >
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>Invitar miembro</Box>
                    <Box sx={{ display: { xs: "block", sm: "none" } }}>Invitar</Box>
                  </Button>
                </Box>

                {loadingTeamMembers ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size="sm" />
                  </Box>
                ) : projectUsers.length === 0 ? (
                  <Sheet
                    variant="soft"
                    sx={{
                      p: 4,
                      borderRadius: "md",
                      textAlign: "center",
                      bgcolor: "background.level1",
                    }}
                  >
                    <People sx={{ fontSize: 48, color: "text.tertiary", mb: 2 }} />
                    <Typography level="title-md" sx={{ mb: 1 }}>
                      No hay miembros en el equipo
                    </Typography>
                    <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
                      Invita usuarios para colaborar en este proyecto
                    </Typography>
                    <Button
                      variant="outlined"
                      startDecorator={<Add />}
                      onClick={() => setTeamMemberSelectOpen(true)}
                      sx={{
                        color: "#ffbc62",
                        borderColor: "#ffbc62",
                        "&:hover": {
                          borderColor: "#ff9b44",
                          bgcolor: "rgba(255, 188, 98, 0.1)",
                        },
                      }}
                    >
                      Invitar primer miembro
                    </Button>
                  </Sheet>
                ) : (
                  <Grid container spacing={2}>
                    {projectUsers.map((projectUser) => (
                      <Grid key={projectUser.id} xs={12} sm={6} md={4}>
                        <Sheet
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: "md",
                            position: "relative",
                            "&:hover": {
                              bgcolor: "background.level1",
                            },
                          }}
                        >
                          <IconButton
                            variant="plain"
                            size="sm"
                            color="danger"
                            onClick={() => handleRemoveTeamMember(projectUser.id)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              zIndex: 1,
                            }}
                          >
                            <PersonRemove fontSize="small" />
                          </IconButton>

                          <Box sx={{ textAlign: "center" }}>
                            <Avatar
                              size="lg"
                              src={projectUser.user.avatar_url}
                              sx={{
                                bgcolor: "#ffbc62",
                                color: "white",
                                mx: "auto",
                                mb: 1,
                              }}
                            >
                              {!projectUser.user.avatar_url && getUserInitials(projectUser.user)}
                            </Avatar>
                            <Typography level="body-sm" fontWeight="md">
                              {projectUser.user.name} {projectUser.user.lastname}
                            </Typography>
                            <Typography level="body-xs" color="neutral">
                              @{projectUser.user.username}
                            </Typography>
                            <Typography level="body-xs" color="neutral" sx={{ mb: 1 }}>
                              {projectUser.user.email}
                            </Typography>
                            <Chip variant="soft" size="sm" color="primary" sx={{ mb: 1 }}>
                              Miembro
                            </Chip>
                            <Typography level="body-xs" color="neutral">
                              Desde {formatDate(projectUser.created_at)}
                            </Typography>
                          </Box>
                        </Sheet>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          )}

          {/* Panel de Configuración */}
          {activeTab === 3 && (
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography level="title-md" sx={{ mb: 2 }}>
                  Configuración del proyecto
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography level="body-sm" fontWeight="md" sx={{ mb: 1 }}>
                      Información general
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography level="body-xs">Creado por:</Typography>
                        <Typography level="body-xs">
                          {project.creator.name} {project.creator.lastname}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography level="body-xs">Fecha de creación:</Typography>
                        <Typography level="body-xs">{formatDate(project.created_at)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography level="body-xs">Última actualización:</Typography>
                        <Typography level="body-xs">{formatDate(project.updated_at)}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography level="body-sm" fontWeight="md" sx={{ mb: 1 }}>
                      Acciones del proyecto
                    </Typography>
                    <Stack spacing={1}>
                      <Button
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        startDecorator={<Edit />}
                        onClick={() => router.push(`/project/edit/${project.id}`)}
                      >
                        Editar proyecto
                      </Button>
                      <Button variant="outlined" color="neutral" size="sm" startDecorator={<Download />}>
                        Exportar datos
                      </Button>
                      <Button
                        variant="outlined"
                        color="danger"
                        size="sm"
                        startDecorator={<Delete />}
                        onClick={() => setDeleteConfirmOpen(true)}
                      >
                        Eliminar proyecto
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Modal para seleccionar materiales */}
      <MaterialSelectModal
        open={materialSelectOpen}
        onClose={() => setMaterialSelectOpen(false)}
        onAddMaterial={handleAddMaterial}
        projectId={Number(projectId)}
      />

      {/* Modal para seleccionar miembros del equipo */}
      <TeamMemberSelectModal
        open={teamMemberSelectOpen}
        onClose={() => setTeamMemberSelectOpen(false)}
        onAddMember={handleAddTeamMember}
        projectId={Number(projectId)}
        existingMemberIds={projectUsers.map((pu) => pu.user.id)}
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteProjectModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteProject}
        projectName={project.name}
        loading={deleting}
      />
    </ColumnLayout>
  )
}
