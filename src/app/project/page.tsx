"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  IconButton,
  Input,
  Chip,
  Sheet,
  Divider,
  Stack,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Select,
  Option,
  Textarea,
  CircularProgress,
  FormHelperText,
} from "@mui/joy"
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Movie,
  Tv,
  Campaign,
  Work,
  Business,
  Person,
  Check,
  Close,
  Refresh,
  Sort,
  Group,
  Folder,
  Save,
} from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import CustomTabs from "@/components/CustomTabs"

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

// Interfaz para el formulario
interface ProjectFormData {
  name: string
  description: string
  type: ProjectType
  start_date: string
  end_date: string
  status: string
  is_collaborative: boolean
  company_cif: string
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
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [openModal, setOpenModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    type: ProjectType.OTHER,
    start_date: "",
    end_date: "",
    status: "draft",
    is_collaborative: false,
    company_cif: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated") return

      setLoading(true)

      try {
        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Datos de ejemplo para empresas
        const mockCompanies: Company[] = [
          {
            cif: "B12345678",
            name: "Producciones Creativas",
            logo_url: "https://picsum.photos/seed/company1/200/200",
          },
          {
            cif: "B87654321",
            name: "Visual Media",
            logo_url: "https://picsum.photos/seed/company2/200/200",
          },
          {
            cif: "B23456789",
            name: "Sonido Profesional",
            logo_url: "https://picsum.photos/seed/company3/200/200",
          },
        ]

        // Datos de ejemplo para proyectos
        const mockProjects: Project[] = [
          {
            id: 1,
            company_cif: "B12345678",
            company: {
              name: "Producciones Creativas",
              logo_url: "https://picsum.photos/seed/company1/200/200",
            },
            created_by: 1,
            creator: {
              name: "Juan",
              lastname: "Pérez",
              username: "juanperez",
            },
            name: "Documental sobre cambio climático",
            description: "Documental que explora el impacto del cambio climático en ecosistemas marinos.",
            type: ProjectType.FILM,
            start_date: "2023-06-15",
            end_date: "2023-12-20",
            status: "in_progress",
            is_collaborative: true,
            created_at: "2023-05-10T10:30:00Z",
            updated_at: "2023-06-01T14:45:00Z",
            materials_count: 45,
            team_members: 8,
          },
          {
            id: 2,
            company_cif: "B87654321",
            company: {
              name: "Visual Media",
              logo_url: "https://picsum.photos/seed/company2/200/200",
            },
            created_by: 2,
            creator: {
              name: "María",
              lastname: "López",
              username: "marialopez",
            },
            name: "Serie web sobre gastronomía",
            description: "Serie de 10 episodios sobre gastronomía tradicional española.",
            type: ProjectType.TV,
            start_date: "2023-07-01",
            end_date: "2023-10-30",
            status: "planning",
            is_collaborative: false,
            created_at: "2023-05-20T09:15:00Z",
            updated_at: "2023-05-25T11:30:00Z",
            materials_count: 12,
            team_members: 5,
          },
          {
            id: 3,
            company_cif: "B12345678",
            company: {
              name: "Producciones Creativas",
              logo_url: "https://picsum.photos/seed/company1/200/200",
            },
            created_by: 1,
            creator: {
              name: "Juan",
              lastname: "Pérez",
              username: "juanperez",
            },
            name: "Spot publicitario para marca deportiva",
            description: "Anuncio de 30 segundos para nueva línea de zapatillas deportivas.",
            type: ProjectType.ADVERTISING,
            start_date: "2023-08-10",
            end_date: "2023-09-15",
            status: "completed",
            is_collaborative: true,
            created_at: "2023-07-05T14:20:00Z",
            updated_at: "2023-09-20T16:45:00Z",
            materials_count: 28,
            team_members: 12,
          },
          {
            id: 4,
            company_cif: "B23456789",
            company: {
              name: "Sonido Profesional",
              logo_url: "https://picsum.photos/seed/company3/200/200",
            },
            created_by: 3,
            creator: {
              name: "Carlos",
              lastname: "Rodríguez",
              username: "carlosrodriguez",
            },
            name: "Podcast sobre historia del cine",
            description: "Serie de podcasts educativos sobre la historia del cine español.",
            type: ProjectType.OTHER,
            start_date: "2023-09-01",
            end_date: "2024-03-30",
            status: "planning",
            is_collaborative: false,
            created_at: "2023-08-15T11:10:00Z",
            updated_at: "2023-08-20T09:30:00Z",
            materials_count: 5,
            team_members: 3,
          },
          {
            id: 5,
            company_cif: "B87654321",
            company: {
              name: "Visual Media",
              logo_url: "https://picsum.photos/seed/company2/200/200",
            },
            created_by: 2,
            creator: {
              name: "María",
              lastname: "López",
              username: "marialopez",
            },
            name: "Cortometraje de animación",
            description: "Cortometraje animado para festival internacional de cine.",
            type: ProjectType.FILM,
            start_date: "2023-10-15",
            end_date: "2024-02-28",
            status: "in_progress",
            is_collaborative: true,
            created_at: "2023-09-10T16:20:00Z",
            updated_at: "2023-10-05T13:45:00Z",
            materials_count: 34,
            team_members: 7,
          },
        ]

        setCompanies(mockCompanies)
        setProjects(mockProjects)
        setFilteredProjects(mockProjects)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        showNotification("Error al cargar los proyectos", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status, showNotification])

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

  // Abrir modal para crear proyecto
  const handleCreateProject = () => {
    setFormData({
      name: "",
      description: "",
      type: ProjectType.OTHER,
      start_date: "",
      end_date: "",
      status: "draft",
      is_collaborative: false,
      company_cif: companies.length > 0 ? companies[0].cif : "",
    })
    setModalMode("create")
    setOpenModal(true)
  }

  // Abrir modal para editar proyecto
  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setFormData({
      name: project.name,
      description: project.description || "",
      type: project.type,
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      status: project.status,
      is_collaborative: project.is_collaborative,
      company_cif: project.company_cif,
    })
    setModalMode("edit")
    setOpenModal(true)
  }

  // Abrir modal para ver proyecto
  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setModalMode("view")
    setOpenModal(true)
  }

  // Abrir confirmación para eliminar proyecto
  const handleDeleteConfirm = (projectId: number) => {
    setProjectToDelete(projectId)
    setDeleteConfirmOpen(true)
  }

  // Eliminar proyecto
  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    setDeleting(true)

    try {
      // Simular eliminación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar estado
      setProjects(projects.filter((project) => project.id !== projectToDelete))

      showNotification("Proyecto eliminado correctamen", "success")

      setDeleteConfirmOpen(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error("Error al eliminar proyecto:", error)
      showNotification("Error al eliminar el proyecto", "error")
    } finally {
      setDeleting(false)
    }
  }

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en selects
  const handleSelectChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Enviar formulario
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      // Validar campos obligatorios
      if (!formData.name || !formData.company_cif) {
        showNotification("Por favor, completa los campos obligatorios", "warning")
        setFormSubmitting(false)
        return
      }

      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (modalMode === "create") {
        // Crear nuevo proyecto
        const newProject: Project = {
          id: Math.max(...projects.map((p) => p.id), 0) + 1,
          company_cif: formData.company_cif,
          company: companies.find((c) => c.cif === formData.company_cif) || {
            name: "Empresa desconocida",
          },
          created_by: Number(session?.user?.id) || 1,
          creator: {
            name: session?.user?.name || "Usuario",
            lastname: "",
            username: "usuario",
          },
          name: formData.name,
          description: formData.description,
          type: formData.type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: formData.status,
          is_collaborative: formData.is_collaborative,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          materials_count: 0,
          team_members: 0,
        }

        setProjects([...projects, newProject])
        showNotification("Proyecto creado correctamente", "success")
      } else if (modalMode === "edit" && selectedProject) {
        // Actualizar proyecto existente
        const updatedProjects = projects.map((project) =>
          project.id === selectedProject.id
            ? {
              ...project,
              name: formData.name,
              description: formData.description,
              type: formData.type,
              start_date: formData.start_date,
              end_date: formData.end_date,
              status: formData.status,
              is_collaborative: formData.is_collaborative,
              company_cif: formData.company_cif,
              company: companies.find((c) => c.cif === formData.company_cif) || project.company,
              updated_at: new Date().toISOString(),
            }
            : project,
        )

        setProjects(updatedProjects)
        showNotification("Proyecto actualizado correctamente", "success")
      }

      // Cerrar modal
      setOpenModal(false)
    } catch (error) {
      console.error("Error al guardar proyecto:", error)
      showNotification("Error al guardar el proyecto", "error")
    } finally {
      setFormSubmitting(false)
    }
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

        {/* Tabs para filtrar proyectos */}
        <CustomTabs options={projectTabOptions} defaultValue={activeTab} onChange={(value) => setActiveTab(value)} />

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
          </Box>
        </Sheet>

        {/* Botón para crear nuevo proyecto */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="solid"
            color="primary"
            startDecorator={<Add />}
            onClick={handleCreateProject}
            sx={{
              bgcolor: "#ffbc62",
              "&:hover": {
                bgcolor: "#ff9b44",
              },
            }}
          >
            Nuevo Proyecto
          </Button>
        </Box>

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

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Business sx={{ color: "#ffbc62", fontSize: 18 }} />
                        <Typography level="body-sm" color="neutral">
                          {project.company.name}
                        </Typography>
                      </Box>

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
                        }}
                      >
                        Ver más
                      </Button>
                      <IconButton
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        sx={{ flex: { xs: 1, sm: "0 0 auto" } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteConfirm(project.id)}
                        sx={{ flex: { xs: 1, sm: "0 0 auto" } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {/* Modal para crear/editar proyecto */}
        <Modal open={openModal} onClose={() => modalMode !== "view" && !formSubmitting && setOpenModal(false)}>
          <ModalDialog
            variant="outlined"
            sx={{
              maxWidth: 600,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose disabled={formSubmitting} />
            <Typography level="h4" sx={{ mb: 2 }}>
              {modalMode === "create"
                ? "Crear nuevo proyecto"
                : modalMode === "edit"
                  ? "Editar proyecto"
                  : "Detalles del proyecto"}
            </Typography>

            {modalMode === "view" && selectedProject ? (
              // Vista de detalles
              <Box>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Typography level="title-lg" sx={{ color: "#ffbc62" }}>
                      {selectedProject.name}
                    </Typography>
                    <Chip variant="soft" color={getStatusColor(selectedProject.status)} size="sm" sx={{ ml: 1 }}>
                      {getStatusText(selectedProject.status)}
                    </Chip>
                    {selectedProject.is_collaborative && (
                      <Chip
                        variant="soft"
                        color="primary"
                        size="sm"
                        sx={{ ml: 1, bgcolor: "rgba(255, 188, 98, 0.2)", color: "#ffbc62" }}
                      >
                        Colaborativo
                      </Chip>
                    )}
                  </Grid>

                  <Grid xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">
                      Tipo de proyecto
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      {getProjectTypeIcon(selectedProject.type)}
                      <Typography level="body-md">
                        {selectedProject.type === ProjectType.FILM
                          ? "Cine"
                          : selectedProject.type === ProjectType.TV
                            ? "TV"
                            : selectedProject.type === ProjectType.ADVERTISING
                              ? "Publicidad"
                              : "Otro"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">
                      Empresa
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Business />
                      <Typography level="body-md">{selectedProject.company.name}</Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">
                      Fecha de inicio
                    </Typography>
                    <Typography level="body-md">{formatDate(selectedProject.start_date)}</Typography>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">
                      Fecha de finalización
                    </Typography>
                    <Typography level="body-md">{formatDate(selectedProject.end_date)}</Typography>
                  </Grid>

                  <Grid xs={12}>
                    <Typography level="body-sm" color="neutral">
                      Descripción
                    </Typography>
                    <Typography level="body-md">{selectedProject.description || "Sin descripción"}</Typography>
                  </Grid>

                  <Grid xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">
                      Creado por
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Person />
                      <Typography level="body-md">
                        {selectedProject.creator.name} {selectedProject.creator.lastname}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">
                      Fecha de creación
                    </Typography>
                    <Typography level="body-md">{formatDate(selectedProject.created_at)}</Typography>
                  </Grid>

                  <Grid xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Folder sx={{ color: "#ffbc62" }} />
                      <Typography level="body-md">{selectedProject.materials_count} materiales</Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Group sx={{ color: "#ffbc62" }} />
                      <Typography level="body-md">{selectedProject.team_members} miembros en el equipo</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="plain" color="neutral" onClick={() => setOpenModal(false)}>
                    Cerrar
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                      setOpenModal(false)
                      router.push(`/proyecto/${selectedProject.id}`)
                    }}
                    sx={{
                      bgcolor: "#ffbc62",
                      "&:hover": {
                        bgcolor: "#ff9b44",
                      },
                    }}
                  >
                    Gestionar proyecto
                  </Button>
                </Box>
              </Box>
            ) : (
              // Formulario para crear/editar
              <form onSubmit={handleSubmitForm}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <FormControl required>
                      <FormLabel>Nombre del proyecto</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Nombre del proyecto"
                      />
                    </FormControl>
                  </Grid>

                  <Grid xs={12}>
                    <FormControl>
                      <FormLabel>Descripción</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Descripción del proyecto"
                        minRows={3}
                      />
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl required>
                      <FormLabel>Tipo de proyecto</FormLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={(_, value) => handleSelectChange("type", value)}
                      >
                        <Option value={ProjectType.FILM}>Cine</Option>
                        <Option value={ProjectType.TV}>TV</Option>
                        <Option value={ProjectType.ADVERTISING}>Publicidad</Option>
                        <Option value={ProjectType.OTHER}>Otro</Option>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl required>
                      <FormLabel>Empresa</FormLabel>
                      <Select
                        name="company_cif"
                        value={formData.company_cif}
                        onChange={(_, value) => handleSelectChange("company_cif", value)}
                      >
                        {companies.map((company) => (
                          <Option key={company.cif} value={company.cif}>
                            {company.name}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl>
                      <FormLabel>Fecha de inicio</FormLabel>
                      <Input type="date" name="start_date" value={formData.start_date} onChange={handleFormChange} />
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl>
                      <FormLabel>Fecha de finalización</FormLabel>
                      <Input type="date" name="end_date" value={formData.end_date} onChange={handleFormChange} />
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl required>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={(_, value) => handleSelectChange("status", value)}
                      >
                        <Option value="draft">Borrador</Option>
                        <Option value="planning">Planificación</Option>
                        <Option value="in_progress">En progreso</Option>
                        <Option value="completed">Completado</Option>
                        <Option value="cancelled">Cancelado</Option>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl>
                      <FormLabel>Colaborativo</FormLabel>
                      <Select
                        name="is_collaborative"
                        value={formData.is_collaborative}
                        onChange={(_, value) => handleSelectChange("is_collaborative", value)}
                      >
                        <Option value={true}>Sí</Option>
                        <Option value={false}>No</Option>
                      </Select>
                      <FormHelperText>
                        Los proyectos colaborativos permiten que varios usuarios trabajen juntos
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="plain" color="neutral" onClick={() => setOpenModal(false)} disabled={formSubmitting}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={formSubmitting}
                    loadingPosition="start"
                    startDecorator={<Save />}
                    variant="solid"
                    color="primary"
                    sx={{
                      bgcolor: "#ffbc62",
                      "&:hover": {
                        bgcolor: "#ff9b44",
                      },
                    }}
                  >
                    {modalMode === "create" ? "Crear proyecto" : "Guardar cambios"}
                  </Button>
                </Box>
              </form>
            )}
          </ModalDialog>
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <Modal open={deleteConfirmOpen} onClose={() => !deleting && setDeleteConfirmOpen(false)}>
          <ModalDialog variant="outlined" role="alertdialog">
            <Typography level="h4" sx={{ mb: 2 }}>
              Confirmar eliminación
            </Typography>
            <Typography sx={{ mb: 3 }}>
              ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button variant="plain" color="neutral" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
                Cancelar
              </Button>
              <Button variant="solid" color="danger" onClick={handleDeleteProject} loading={deleting}>
                Eliminar
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </ColumnLayout>
    </>
  )
}
