"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Input,
  Chip,
  Sheet,
  Stack,
  Select,
  Option,
  CircularProgress,
} from "@mui/joy"
import {
  Search,
  FilterList,
  Add,
  Movie,
  Tv,
  Campaign,
  Work,
  Business,
  Check,
  Close,
  Refresh,
  Sort,
  Group,
  Folder,
} from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import CustomTabs from "@/components/CustomTabs"
import ProjectPreviewDetails from "./components/ProjectPreviewDetails"
import axios from "axios"

// Enumeración para tipos de proyecto
enum ProjectType {
  FILM = "film",
  TV = "tv",
  ADVERTISING = "advertising",
  OTHER = "other",
}

// Interfaz para el proyecto
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
  // Campos adicionales para la UI
  materials_count?: number
  team_members?: number
}

// Interfaz para empresas
interface Company {
  cif: string
  name: string
  logo_url?: string | null
}

// Opciones para las pestañas de proyectos
const projectTabOptions = [
  { value: "all", label: "Todos los proyectos" },
  { value: "my", label: "Mis proyectos" },
  { value: "collaborative", label: "Colaborativos" },
]

export default function ProjectsPage() {
  const { mode } = useColorScheme()
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showNotification } = useNotification()

  // Estados
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [openModal, setOpenModal] = useState(false) // Declare openModal variable

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated" || !session?.accessToken) return

      setLoading(true)

      try {
        // Cargar proyectos y empresas en paralelo
        const [projectsResponse, companiesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }),
        ])

        const projectsData = projectsResponse.data.data || projectsResponse.data
        const companiesData = companiesResponse.data.data || companiesResponse.data

        setCompanies(companiesData)
        setProjects(projectsData)
        setFilteredProjects(projectsData)
      } catch (error: unknown) {
        console.error("Error al cargar datos:", error)

        let errorMessage = "Error al cargar los proyectos"
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { status?: number } }).response === "object" &&
          (error as { response?: { status?: number } }).response !== null &&
          "status" in (error as { response?: { status?: number } }).response!
        ) {
          if ((error as { response: { status: number } }).response.status === 401) {
            errorMessage = "No tienes permisos para ver los proyectos"
          }
        }

        showNotification(errorMessage, "error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status, session?.accessToken, showNotification])

  // Filtrar proyectos
  useEffect(() => {
    if (!projects.length) return

    let filtered = [...projects]

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.company.name.toLowerCase().includes(query) ||
          project.creator.username.toLowerCase().includes(query),
      )
    }

    // Filtrar por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((project) => project.type === typeFilter)
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    // Filtrar por pestaña
    if (activeTab === "my") {
      filtered = filtered.filter((project) => project.created_by === Number(session?.user?.id))
    } else if (activeTab === "collaborative") {
      filtered = filtered.filter((project) => project.is_collaborative)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "date-desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchQuery, typeFilter, statusFilter, activeTab, sortBy, session?.user?.id])

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

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No definida"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Redirigir a la página de crear proyecto
  const handleCreateProject = () => {
    router.push("/project/create")
  }

  // Abrir modal para ver proyecto
  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setOpenModal(true)
  }

  return (
    <>
      <ColumnLayout>
        <Box sx={{ mb: 4 }}>
          <Typography level="h1" sx={{ mb: 1, color: "#ffbc62" }}>
            Proyectos
          </Typography>
          <Typography level="body-lg" color="neutral">
            Gestiona todos los proyectos audiovisuales de tu empresa
          </Typography>
        </Box>

        {/* Barra de búsqueda y filtros */}
        <Sheet
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "lg",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            background:
              mode === "dark"
                ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          {/* Barra de búsqueda - siempre ocupa el ancho completo */}
          <Input
            placeholder="Buscar proyectos..."
            startDecorator={<Search />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "100%",
              flexGrow: 1,
              "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
              "&:hover": {
                borderColor: "primary.solidBg",
              },
              "&:focus-within": {
                borderColor: "primary.solidBg",
                boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
              },
            }}
          />

          {/* Filtros - se adaptan según el tamaño de pantalla */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "stretch",
              gap: { xs: 1, sm: 1 },
              width: "100%",
            }}
          >
            <Select
              placeholder="Tipo"
              value={typeFilter}
              onChange={(_, value) => setTypeFilter(value as string)}
              startDecorator={<FilterList />}
              size="sm"
              sx={{
                flex: { xs: "1", sm: "0 0 120px" },
                minWidth: { xs: "auto", sm: "120px" },
              }}
            >
              <Option value="all">Todos</Option>
              <Option value={ProjectType.FILM}>Cine</Option>
              <Option value={ProjectType.TV}>TV</Option>
              <Option value={ProjectType.ADVERTISING}>Publicidad</Option>
              <Option value={ProjectType.OTHER}>Otros</Option>
            </Select>

            <Select
              placeholder="Estado"
              value={statusFilter}
              onChange={(_, value) => setStatusFilter(value as string)}
              startDecorator={<FilterList />}
              size="sm"
              sx={{
                flex: { xs: "1", sm: "0 0 120px" },
                minWidth: { xs: "auto", sm: "120px" },
              }}
            >
              <Option value="all">Todos</Option>
              <Option value="draft">Borrador</Option>
              <Option value="planning">Planificación</Option>
              <Option value="in_progress">En progreso</Option>
              <Option value="completed">Completado</Option>
              <Option value="cancelled">Cancelado</Option>
            </Select>

            <Select
              placeholder="Ordenar"
              value={sortBy}
              onChange={(_, value) => setSortBy(value as string)}
              startDecorator={<Sort />}
              size="sm"
              sx={{
                flex: { xs: "1", sm: "0 0 140px" },
                minWidth: { xs: "auto", sm: "140px" },
              }}
            >
              <Option value="date-desc">Más recientes</Option>
              <Option value="date-asc">Más antiguos</Option>
              <Option value="name-asc">A-Z</Option>
              <Option value="name-desc">Z-A</Option>
            </Select>

            <IconButton
              variant="outlined"
              color="neutral"
              onClick={() => {
                setSearchQuery("")
                setTypeFilter("all")
                setStatusFilter("all")
                setSortBy("date-desc")
              }}
              size="sm"
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                minHeight: { xs: "40px", sm: "auto" },
              }}
            >
              <Refresh />
            </IconButton>

            {/* Botón Nuevo Proyecto - responsive */}
            <Button
              variant="solid"
              startDecorator={<Add />}
              onClick={handleCreateProject}
              size="sm"
              sx={{
                bgcolor: "#ffbc62",
                color: "white",
                fontWeight: "600",
                flex: { xs: "1", sm: "0 0 auto" },
                minWidth: { xs: "auto", sm: "140px" },
                minHeight: { xs: "40px", sm: "auto" },
                fontSize: { xs: "0.875rem", sm: "0.875rem" },
                "&:hover": {
                  bgcolor: "#ff9b44",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: { xs: "none", sm: "inline" },
                }}
              >
                Nuevo
              </Box>
              <Box
                component="span"
                sx={{
                  display: { xs: "inline", sm: "none" },
                }}
              >
                Nuevo
              </Box>
            </Button>
          </Box>
        </Sheet>

        <CustomTabs options={projectTabOptions} defaultValue={activeTab} onChange={(value) => setActiveTab(value)} />

        {/* Lista de proyectos */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <CircularProgress
              size="lg"
              sx={{
                "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
                "--CircularProgress-progressColor": "#ffbc62",
              }}
            />
          </Box>
        ) : filteredProjects.length === 0 ? (
          <Sheet
            variant="soft"
            sx={{
              p: 4,
              borderRadius: "lg",
              textAlign: "center",
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.4) 0%, rgba(35,35,35,0.2) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.6) 0%, rgba(240,240,240,0.3) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            }}
          >
            <Typography level="h3" sx={{ mb: 2 }}>
              No se encontraron proyectos
            </Typography>
            <Typography level="body-md" sx={{ mb: 3 }}>
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Intenta con otros términos de búsqueda o filtros"
                : activeTab === "my"
                  ? "No has creado ningún proyecto todavía"
                  : activeTab === "collaborative"
                    ? "No hay proyectos colaborativos disponibles"
                    : "No hay proyectos disponibles"}
            </Typography>
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleCreateProject}
              startDecorator={<Add />}
              sx={{
                color: "#ffbc62",
                borderColor: "#ffbc62",
                "&:hover": {
                  borderColor: "#ff9b44",
                  bgcolor: "rgba(255, 188, 98, 0.1)",
                },
              }}
            >
              Crear primer proyecto
            </Button>
          </Sheet>
        ) : (
          <Stack spacing={2}>
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                variant="outlined"
                sx={{
                  background:
                    mode === "dark"
                      ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                      : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid",
                  borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                    borderColor: "#ffbc62",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: { xs: 1.5, sm: 2 },
                  }}
                >
                  {/* Header del proyecto */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Box
                      sx={{
                        width: { xs: 48, sm: 56 },
                        height: { xs: 48, sm: 56 },
                        borderRadius: "lg",
                        bgcolor: "rgba(255, 188, 98, 0.2)",
                        color: "#ffbc62",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {getProjectTypeIcon(project.type)}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        level="title-md"
                        sx={{
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: { xs: "0.95rem", sm: "1.1rem" },
                        }}
                      >
                        {project.name}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                        <Chip
                          variant="soft"
                          color={getStatusColor(project.status)}
                          size="sm"
                          startDecorator={
                            project.status === "completed" ? (
                              <Check />
                            ) : project.status === "cancelled" ? (
                              <Close />
                            ) : null
                          }
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
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 1, sm: 0 } }}>
                        <Business sx={{ color: "#ffbc62", fontSize: 18 }} />
                        <Typography level="body-sm" color="neutral">
                          {project.company.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Descripción - solo en pantallas más grandes */}
                  {project.description && (
                    <Typography
                      level="body-sm"
                      color="neutral"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: { xs: 2, sm: 1 },
                        WebkitBoxOrient: "vertical",
                        display: { xs: "block", sm: "-webkit-box" },
                      }}
                    >
                      {project.description}
                    </Typography>
                  )}

                  {/* Información secundaria y acciones */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between",
                      gap: { xs: 2, sm: 1 },
                    }}
                  >
                    {/* Fechas y estadísticas */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 3 },
                      }}
                    >
                      {/* Fechas */}
                      <Box sx={{ display: "flex", gap: { xs: 3, sm: 2 }, alignItems: "center" }}>
                        <Box>
                          <Typography level="body-xs" color="neutral">
                            Inicio
                          </Typography>
                          <Typography
                            level="body-sm"
                            fontWeight="md"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                          >
                            {formatDate(project.start_date)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography level="body-xs" color="neutral">
                            Fin
                          </Typography>
                          <Typography
                            level="body-sm"
                            fontWeight="md"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                          >
                            {formatDate(project.end_date)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Estadísticas */}
                      <Box sx={{ display: "flex", gap: { xs: 3, sm: 2 }, alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Folder sx={{ color: "#ffbc62", fontSize: 16 }} />
                          <Typography level="body-xs">{project.materials_count || 0} materiales</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Group sx={{ color: "#ffbc62", fontSize: 16 }} />
                          <Typography level="body-xs">{project.team_members || 0} miembros</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Acciones */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexShrink: 0,
                        justifyContent: { xs: "stretch", sm: "flex-end" },
                      }}
                    >
                      <Button
                        variant="solid"
                        color="primary"
                        size="sm"
                        onClick={() => handleViewProject(project)}
                        sx={{
                          flex: { xs: 1, sm: "0 0 auto" },
                          minWidth: { xs: "auto", sm: "60px" },
                          color: "white",
                        }}
                      >
                        Ver
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {/* Modal para ver proyecto */}
        <ProjectPreviewDetails
          open={openModal}
          onClose={() => setOpenModal(false)}
          onEdit={() => {
            if (selectedProject) {
              setOpenModal(false)
              router.push(`/project/edit/${selectedProject.id}`)
            }
          }}
          onView={() => {
            if (selectedProject) {
              setOpenModal(false)
              router.push(`/project/${selectedProject.id}`)
            }
          }}
          project={selectedProject}
        />
      </ColumnLayout>
    </>
  )
}
