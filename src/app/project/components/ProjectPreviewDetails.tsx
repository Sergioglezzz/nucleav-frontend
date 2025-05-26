"use client"

import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/joy"
import {
  Movie,
  Tv,
  Campaign,
  Work,
  Business,
  Group,
  Folder,
  CalendarToday,
  Person,
  Visibility,
  CheckCircle,
  PlayArrow,
  Schedule,
  Cancel,
  Pause,
} from "@mui/icons-material"

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
  materials_count?: number
  team_members?: number
}

interface ProjectPreviewDetailsProps {
  open: boolean
  onClose: () => void
  onEdit: () => void
  onView: () => void
  project: Project | null
}

export default function ProjectPreviewDetails({ open, onClose, onView, project }: ProjectPreviewDetailsProps) {
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

  // Calcular progreso del proyecto
  const calculateProgress = (status: string) => {
    switch (status) {
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

  if (!project) return null

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: { xs: "95vw", sm: 700 },
          width: "100%",
          maxHeight: { xs: "90vh", sm: "85vh" },
          overflow: "auto",
          mx: { xs: 1, sm: 2 },
          my: { xs: 1, sm: 2 },
        }}
      >
        <ModalClose />

        {/* Header del modal */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {getProjectTypeIcon(project.type)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                level="h4"
                sx={{
                  color: "#ffbc62",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
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

          {/* Progreso */}
          <Card variant="soft" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography level="body-sm" fontWeight="md">
                  Progreso del proyecto
                </Typography>
                <Typography level="body-sm" fontWeight="md">
                  {calculateProgress(project.status)}%
                </Typography>
              </Box>
              <LinearProgress
                determinate
                value={calculateProgress(project.status)}
                sx={{
                  "--LinearProgress-progressColor": "#ffbc62",
                  "--LinearProgress-trackColor": "rgba(255, 188, 98, 0.2)",
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Contenido principal */}
        <Stack spacing={3}>
          {/* Información básica */}
          <Box>
            <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
              Información básica
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Business sx={{ color: "#ffbc62", fontSize: 20 }} />
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Empresa
                    </Typography>
                    <Typography level="body-sm" fontWeight="md">
                      {project.company.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Person sx={{ color: "#ffbc62", fontSize: 20 }} />
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Creado por
                    </Typography>
                    <Typography level="body-sm" fontWeight="md">
                      {project.creator.name} {project.creator.lastname}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <CalendarToday sx={{ color: "#ffbc62", fontSize: 20 }} />
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Fecha de inicio
                    </Typography>
                    <Typography level="body-sm" fontWeight="md">
                      {formatDate(project.start_date)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <CalendarToday sx={{ color: "#ffbc62", fontSize: 20 }} />
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Fecha de finalización
                    </Typography>
                    <Typography level="body-sm" fontWeight="md">
                      {formatDate(project.end_date)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Descripción */}
          {project.description && (
            <Box>
              <Typography level="title-sm" sx={{ mb: 1, color: "#ffbc62" }}>
                Descripción
              </Typography>
              <Typography level="body-sm" color="neutral">
                {project.description}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Estadísticas */}
          <Box>
            <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
              Estadísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={6} sm={4}>
                <Card variant="soft" sx={{ textAlign: "center", p: 2 }}>
                  <Folder sx={{ color: "#ffbc62", fontSize: 32, mb: 1 }} />
                  <Typography level="h4" fontWeight="bold">
                    {project.materials_count || 0}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    Materiales
                  </Typography>
                </Card>
              </Grid>

              <Grid xs={6} sm={4}>
                <Card variant="soft" sx={{ textAlign: "center", p: 2 }}>
                  <Group sx={{ color: "#ffbc62", fontSize: 32, mb: 1 }} />
                  <Typography level="h4" fontWeight="bold">
                    {project.team_members || 0}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    Miembros
                  </Typography>
                </Card>
              </Grid>

              <Grid xs={12} sm={4}>
                <Card variant="soft" sx={{ textAlign: "center", p: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#ffbc62",
                      color: "white",
                      width: 32,
                      height: 32,
                      fontSize: "1rem",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    {project.creator.name.charAt(0)}
                  </Avatar>
                  <Typography level="body-sm" fontWeight="bold">
                    Propietario
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    @{project.creator.username}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Stack>

        {/* Acciones */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="solid"
            onClick={onView}
            startDecorator={<Visibility />}
            sx={{
              bgcolor: "#ffbc62",
              color: "white",
              "&:hover": {
                bgcolor: "#ff9b44",
              },
              flex: { xs: 1, sm: "0 0 auto" },
              order: { xs: 1, sm: 3 },
            }}
          >
            Ver proyecto
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
