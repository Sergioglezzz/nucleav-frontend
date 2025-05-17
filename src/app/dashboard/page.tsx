"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import {
  Typography,
  Card,
  Box,
  Grid,
  Chip,
  Avatar,
  AspectRatio,
  Divider,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  IconButton,
  Button,
  CircularProgress,
  LinearProgress,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy"
import {
  Movie,
  Videocam,
  Business,
  Group,
  CalendarMonth,
  Notifications,
  Folder,
  MoreVert,
  ArrowForward,
  CheckCircle,
  Schedule,
  Warning,
  PlayArrow,
  AccessTime,
  Add,
  Refresh,
} from "@mui/icons-material"

// Tipos de datos
interface Project {
  id: number
  title: string
  status: "completed" | "in_progress" | "pending" | "delayed"
  progress: number
  dueDate: string
  thumbnail?: string
  team: { id: number; name: string; avatar?: string }[]
}

interface Material {
  id: number
  name: string
  type: string
  size: string
  lastModified: string
  thumbnail?: string
}

interface Activity {
  id: number
  user: { id: number; name: string; avatar?: string }
  action: string
  target: string
  timestamp: string
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  type: "shooting" | "meeting" | "deadline" | "other"
}

interface Stats {
  projects: { total: number; completed: number; inProgress: number; pending: number }
  materials: { total: number; videos: number; images: number; audio: number; documents: number }
  companies: number
  team: number
}

// Datos de ejemplo
const mockProjects: Project[] = [
  {
    id: 1,
    title: "Documental Naturaleza Extrema",
    status: "in_progress",
    progress: 65,
    dueDate: "2023-12-15",
    thumbnail: "/placeholder.svg?height=120&width=200",
    team: [
      { id: 1, name: "Ana García", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 2, name: "Carlos López", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 3, name: "Elena Martín", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 2,
    title: "Spot Publicitario Verano 2023",
    status: "completed",
    progress: 100,
    dueDate: "2023-06-30",
    thumbnail: "/placeholder.svg?height=120&width=200",
    team: [
      { id: 2, name: "Carlos López", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 4, name: "David Sánchez", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 3,
    title: "Serie Web Episodio 5",
    status: "delayed",
    progress: 40,
    dueDate: "2023-11-10",
    thumbnail: "/placeholder.svg?height=120&width=200",
    team: [
      { id: 1, name: "Ana García", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 5, name: "Laura Pérez", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 4,
    title: "Cortometraje 'Amanecer'",
    status: "pending",
    progress: 0,
    dueDate: "2024-02-28",
    thumbnail: "/placeholder.svg?height=120&width=200",
    team: [
      { id: 3, name: "Elena Martín", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 6, name: "Miguel Rodríguez", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
]

const mockMaterials: Material[] = [
  {
    id: 1,
    name: "Entrevista_Director_Final.mp4",
    type: "video",
    size: "1.2 GB",
    lastModified: "2023-11-05",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 2,
    name: "Localizaciones_Montaña.zip",
    type: "images",
    size: "450 MB",
    lastModified: "2023-11-02",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 3,
    name: "Guion_V3_Revisado.pdf",
    type: "document",
    size: "2.5 MB",
    lastModified: "2023-10-28",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 4,
    name: "Banda_Sonora_Tema1.wav",
    type: "audio",
    size: "85 MB",
    lastModified: "2023-10-25",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
]

const mockActivities: Activity[] = [
  {
    id: 1,
    user: { id: 1, name: "Ana García", avatar: "/placeholder.svg?height=40&width=40" },
    action: "subió un nuevo archivo",
    target: "Entrevista_Director_Final.mp4",
    timestamp: "Hace 2 horas",
  },
  {
    id: 2,
    user: { id: 2, name: "Carlos López", avatar: "/placeholder.svg?height=40&width=40" },
    action: "completó la tarea",
    target: "Edición preliminar",
    timestamp: "Hace 5 horas",
  },
  {
    id: 3,
    user: { id: 3, name: "Elena Martín", avatar: "/placeholder.svg?height=40&width=40" },
    action: "comentó en",
    target: "Guion_V3_Revisado.pdf",
    timestamp: "Ayer",
  },
  {
    id: 4,
    user: { id: 4, name: "David Sánchez", avatar: "/placeholder.svg?height=40&width=40" },
    action: "creó un nuevo proyecto",
    target: "Cortometraje 'Amanecer'",
    timestamp: "Hace 2 días",
  },
  {
    id: 5,
    user: { id: 5, name: "Laura Pérez", avatar: "/placeholder.svg?height=40&width=40" },
    action: "actualizó el estado de",
    target: "Serie Web Episodio 5",
    timestamp: "Hace 3 días",
  },
]

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Rodaje escenas exteriores",
    date: "2023-11-15",
    time: "08:00 - 18:00",
    type: "shooting",
  },
  {
    id: 2,
    title: "Reunión con productores",
    date: "2023-11-12",
    time: "10:30 - 12:00",
    type: "meeting",
  },
  {
    id: 3,
    title: "Entrega primer corte",
    date: "2023-11-20",
    time: "23:59",
    type: "deadline",
  },
  {
    id: 4,
    title: "Casting actores secundarios",
    date: "2023-11-18",
    time: "15:00 - 19:00",
    type: "other",
  },
]

const mockStats: Stats = {
  projects: { total: 12, completed: 5, inProgress: 4, pending: 3 },
  materials: { total: 156, videos: 42, images: 78, audio: 15, documents: 21 },
  companies: 8,
  team: 24,
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showNotification } = useNotification()

  // Función para cargar los datos
  const fetchData = async () => {
    setLoading(true)
    try {
      // Simulamos la carga de datos de una API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En un caso real, aquí harías las llamadas a la API
      setStats(mockStats)
      setProjects(mockProjects)
      setMaterials(mockMaterials)
      setActivities(mockActivities)
      setEvents(mockEvents)

      showNotification("Dashboard actualizado correctamente", "success")
    } catch (error) {
      console.error("Error fetching dashboard data", error)
      showNotification("Error al cargar los datos del dashboard", "error")
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos cuando la sesión esté autenticada
  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // Obtener el color según el estado del proyecto
  const getStatusColor = (status: Project["status"]): "success" | "primary" | "warning" | "danger" => {
    switch (status) {
      case "completed":
        return "success"
      case "in_progress":
        return "primary"
      case "pending":
        return "warning"
      case "delayed":
        return "danger"
      default:
        return "primary"
    }
  }

  // Obtener el icono según el estado del proyecto
  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle />
      case "in_progress":
        return <PlayArrow />
      case "pending":
        return <Schedule />
      case "delayed":
        return <Warning />
      default:
        return <Schedule />
    }
  }

  // Obtener el texto según el estado del proyecto
  const getStatusText = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in_progress":
        return "En progreso"
      case "pending":
        return "Pendiente"
      case "delayed":
        return "Retrasado"
      default:
        return "Desconocido"
    }
  }

  // Obtener el icono según el tipo de evento
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "shooting":
        return <Videocam />
      case "meeting":
        return <Group />
      case "deadline":
        return <AccessTime />
      case "other":
        return <CalendarMonth />
      default:
        return <CalendarMonth />
    }
  }

  // Obtener el color según el tipo de evento
  const getEventColor = (type: Event["type"]): "primary" | "success" | "warning" | "danger" => {
    switch (type) {
      case "shooting":
        return "primary"
      case "meeting":
        return "success"
      case "deadline":
        return "danger"
      case "other":
        return "warning"
      default:
        return "primary"
    }
  }

  // Obtener el icono según el tipo de material
  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <Movie />
      case "images":
        return <Folder />
      case "document":
        return <Folder />
      case "audio":
        return <Folder />
      default:
        return <Folder />
    }
  }

  // Renderizar el estado de carga inicial
  if (status === "loading") {
    return (
      <>
        <ColumnLayout>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size="lg" />
          </Box>
        </ColumnLayout>
      </>
    )
  }

  return (
    <>
      <ColumnLayout>
        {/* Encabezado del Dashboard */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography level="h2" sx={{ color: "#ffbc62" }} >Dashboard</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<Refresh />}
              onClick={fetchData}
              loading={loading}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {loading ? (
          // Estado de carga
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "50%",
                        bgcolor: "primary.softBg",
                        color: "primary.solidBg",
                        mr: 2,
                      }}
                    >
                      <Movie />
                    </Box>
                    <Typography level="title-md">Proyectos</Typography>
                  </Box>
                  <Typography level="h2" sx={{ mb: 1 }}>
                    {stats?.projects.total || 0}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip size="sm" variant="soft" color="success" startDecorator={<CheckCircle fontSize="small" />}>
                      {stats?.projects.completed || 0} Completados
                    </Chip>
                    <Chip size="sm" variant="soft" color="primary" startDecorator={<PlayArrow fontSize="small" />}>
                      {stats?.projects.inProgress || 0} En progreso
                    </Chip>
                    <Chip size="sm" variant="soft" color="warning" startDecorator={<Schedule fontSize="small" />}>
                      {stats?.projects.pending || 0} Pendientes
                    </Chip>
                  </Box>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "50%",
                        bgcolor: "success.softBg",
                        color: "success.solidBg",
                        mr: 2,
                      }}
                    >
                      <Folder />
                    </Box>
                    <Typography level="title-md">Materiales</Typography>
                  </Box>
                  <Typography level="h2" sx={{ mb: 1 }}>
                    {stats?.materials.total || 0}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip size="sm" variant="soft" color="primary">
                      {stats?.materials.videos || 0} Videos
                    </Chip>
                    <Chip size="sm" variant="soft" color="success">
                      {stats?.materials.images || 0} Imágenes
                    </Chip>
                    <Chip size="sm" variant="soft" color="warning">
                      {stats?.materials.audio || 0} Audio
                    </Chip>
                    <Chip size="sm" variant="soft" color="neutral">
                      {stats?.materials.documents || 0} Documentos
                    </Chip>
                  </Box>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "50%",
                        bgcolor: "warning.softBg",
                        color: "warning.solidBg",
                        mr: 2,
                      }}
                    >
                      <Business />
                    </Box>
                    <Typography level="title-md">Empresas</Typography>
                  </Box>
                  <Typography level="h2" sx={{ mb: 1 }}>
                    {stats?.companies || 0}
                  </Typography>
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    endDecorator={<ArrowForward />}
                    onClick={() => router.push("/empresa")}
                  >
                    Ver empresas
                  </Button>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "50%",
                        bgcolor: "neutral.softBg",
                        color: "neutral.solidBg",
                        mr: 2,
                      }}
                    >
                      <Group />
                    </Box>
                    <Typography level="title-md">Equipo</Typography>
                  </Box>
                  <Typography level="h2" sx={{ mb: 1 }}>
                    {stats?.team || 0}
                  </Typography>
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    endDecorator={<ArrowForward />}
                    onClick={() => router.push("/red")}
                  >
                    Ver red de contactos
                  </Button>
                </Card>
              </Grid>
            </Grid>

            {/* Proyectos recientes y próximos eventos */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Proyectos recientes */}
              <Grid xs={12} md={8}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography level="title-lg">Proyectos recientes</Typography>
                    <Button
                      size="sm"
                      variant="plain"
                      color="neutral"
                      endDecorator={<ArrowForward />}
                      onClick={() => router.push("/proyecto")}
                    >
                      Ver todos
                    </Button>
                  </Box>
                  <Divider />
                  <Box sx={{ mt: 2 }}>
                    {projects.slice(0, 3).map((project) => (
                      <Card
                        key={project.id}
                        variant="outlined"
                        sx={{ mb: 2, overflow: "hidden" }}
                        onClick={() => router.push(`/proyecto/${project.id}`)}
                      >
                        <Grid container spacing={0}>
                          <Grid xs={12} sm={4}>
                            <AspectRatio ratio="16/9" objectFit="cover">
                              <Image
                                src={project.thumbnail || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 600px) 100vw, 33vw"
                                priority={false}
                              />
                            </AspectRatio>
                          </Grid>
                          <Grid xs={12} sm={8}>
                            <Box sx={{ p: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Box>
                                  <Typography level="title-md">{project.title}</Typography>
                                  <Chip
                                    size="sm"
                                    variant="soft"
                                    color={getStatusColor(project.status)}
                                    startDecorator={getStatusIcon(project.status)}
                                    sx={{ mt: 0.5, mb: 1 }}
                                  >
                                    {getStatusText(project.status)}
                                  </Chip>
                                </Box>
                                <IconButton variant="plain" color="neutral" size="sm">
                                  <MoreVert />
                                </IconButton>
                              </Box>
                              <Box sx={{ mb: 1 }}>
                                <Typography level="body-xs" sx={{ mb: 0.5 }}>
                                  Progreso: {project.progress}%
                                </Typography>
                                <LinearProgress
                                  determinate
                                  value={project.progress}
                                  color={getStatusColor(project.status)}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Typography level="body-xs" sx={{ mr: 1 }}>
                                    Equipo:
                                  </Typography>
                                  <Box sx={{ display: "flex" }}>
                                    {project.team.slice(0, 3).map((member, index) => (
                                      <Avatar
                                        key={member.id}
                                        src={member.avatar}
                                        size="sm"
                                        sx={{
                                          ml: index > 0 ? -0.5 : 0,
                                          border: "1px solid",
                                          borderColor: "background.surface",
                                        }}
                                      />
                                    ))}
                                    {project.team.length > 3 && (
                                      <Avatar
                                        size="sm"
                                        sx={{
                                          ml: -0.5,
                                          border: "1px solid",
                                          borderColor: "background.surface",
                                        }}
                                      >
                                        +{project.team.length - 3}
                                      </Avatar>
                                    )}
                                  </Box>
                                </Box>
                                <Typography level="body-xs">
                                  Fecha límite: {new Date(project.dueDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startDecorator={<Add />}
                        onClick={() => router.push("/proyecto/new")}
                        sx={{
                          bgcolor: "#ffbc62",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#ff9b44",
                          },
                        }}
                      >
                        Nuevo proyecto
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Próximos eventos */}
              <Grid xs={12} md={4}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography level="title-lg">Próximos eventos</Typography>
                    <IconButton variant="plain" color="neutral" size="sm">
                      <CalendarMonth />
                    </IconButton>
                  </Box>
                  <Divider />
                  <List sx={{ "--ListItem-paddingY": "0.75rem" }}>
                    {events.map((event) => (
                      <ListItem
                        key={event.id}
                        sx={{
                          borderRadius: "sm",
                          "&:hover": { bgcolor: "background.level1" },
                        }}
                      >
                        <ListItemDecorator>
                          <Avatar color={getEventColor(event.type)} variant="soft" size="sm">
                            {getEventIcon(event.type)}
                          </Avatar>
                        </ListItemDecorator>
                        <ListItemContent>
                          <Typography level="title-sm">{event.title}</Typography>
                          <Typography level="body-xs">
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </Typography>
                        </ListItemContent>
                        <IconButton variant="plain" color="neutral" size="sm">
                          <MoreVert />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <Button
                      variant="plain"
                      color="neutral"
                      endDecorator={<ArrowForward />}
                      onClick={() => router.push("/calendario")}
                    >
                      Ver calendario completo
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Actividad reciente y materiales */}
            <Grid container spacing={3}>
              {/* Actividad reciente */}
              <Grid xs={12} md={6}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography level="title-lg">Actividad reciente</Typography>
                    <IconButton variant="plain" color="neutral" size="sm">
                      <Notifications />
                    </IconButton>
                  </Box>
                  <Divider />
                  <List sx={{ "--ListItem-paddingY": "0.75rem" }}>
                    {activities.map((activity) => (
                      <ListItem
                        key={activity.id}
                        sx={{
                          borderRadius: "sm",
                          "&:hover": { bgcolor: "background.level1" },
                        }}
                      >
                        <ListItemDecorator>
                          <Avatar src={activity.user.avatar} size="sm" />
                        </ListItemDecorator>
                        <ListItemContent>
                          <Typography level="body-sm">
                            <Typography fontWeight="lg" component="span">
                              {activity.user.name}
                            </Typography>{" "}
                            {activity.action}{" "}
                            <Typography fontWeight="lg" component="span">
                              {activity.target}
                            </Typography>
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            {activity.timestamp}
                          </Typography>
                        </ListItemContent>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <Button
                      variant="plain"
                      color="neutral"
                      endDecorator={<ArrowForward />}
                      onClick={() => router.push("/actividad")}
                    >
                      Ver toda la actividad
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Materiales recientes */}
              <Grid xs={12} md={6}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography level="title-lg">Materiales recientes</Typography>
                    <Button
                      size="sm"
                      variant="plain"
                      color="neutral"
                      endDecorator={<ArrowForward />}
                      onClick={() => router.push("/material")}
                    >
                      Ver todos
                    </Button>
                  </Box>
                  <Divider />
                  <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)} sx={{ mt: 2 }}>
                    <TabList variant="plain" sx={{ "--Tabs-gap": "0.5rem" }}>
                      <Tab>Todos</Tab>
                      <Tab>Videos</Tab>
                      <Tab>Imágenes</Tab>
                      <Tab>Documentos</Tab>
                    </TabList>
                    <TabPanel value={0}>
                      <List sx={{ "--ListItem-paddingY": "0.75rem" }}>
                        {materials.map((material) => (
                          <ListItem
                            key={material.id}
                            sx={{
                              borderRadius: "sm",
                              "&:hover": { bgcolor: "background.level1" },
                            }}
                          >
                            <ListItemDecorator>
                              {material.thumbnail ? (
                                <AspectRatio ratio="1" sx={{ width: 40, height: 40, borderRadius: "sm" }}>
                                  <Image
                                    src={material.thumbnail || "/placeholder.svg"}
                                    alt={material.name}
                                    fill
                                    sizes="40px"
                                    style={{ objectFit: "cover", borderRadius: "inherit" }}
                                    priority={false}
                                  />
                                </AspectRatio>

                              ) : (
                                <Avatar variant="soft" size="sm">
                                  {getMaterialIcon(material.type)}
                                </Avatar>
                              )}
                            </ListItemDecorator>
                            <ListItemContent>
                              <Typography level="body-sm">{material.name}</Typography>
                              <Typography level="body-xs" color="neutral">
                                {material.size} • {new Date(material.lastModified).toLocaleDateString()}
                              </Typography>
                            </ListItemContent>
                            <IconButton variant="plain" color="neutral" size="sm">
                              <MoreVert />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </TabPanel>
                    <TabPanel value={1}>
                      <List sx={{ "--ListItem-paddingY": "0.75rem" }}>
                        {materials
                          .filter((m) => m.type === "video")
                          .map((material) => (
                            <ListItem
                              key={material.id}
                              sx={{
                                borderRadius: "sm",
                                "&:hover": { bgcolor: "background.level1" },
                              }}
                            >
                              <ListItemDecorator>
                                {material.thumbnail ? (
                                  <AspectRatio ratio="1" sx={{ width: 40, height: 40, borderRadius: "sm" }}>
                                    <Image
                                      src={material.thumbnail || "/placeholder.svg"}
                                      alt={material.name}
                                      fill
                                      sizes="40px"
                                      style={{ objectFit: "cover", borderRadius: "inherit" }}
                                      priority={false}
                                    />
                                  </AspectRatio>

                                ) : (
                                  <Avatar variant="soft" size="sm">
                                    <Movie />
                                  </Avatar>
                                )}
                              </ListItemDecorator>
                              <ListItemContent>
                                <Typography level="body-sm">{material.name}</Typography>
                                <Typography level="body-xs" color="neutral">
                                  {material.size} • {new Date(material.lastModified).toLocaleDateString()}
                                </Typography>
                              </ListItemContent>
                              <IconButton variant="plain" color="neutral" size="sm">
                                <MoreVert />
                              </IconButton>
                            </ListItem>
                          ))}
                      </List>
                    </TabPanel>
                    <TabPanel value={2}>
                      <List sx={{ "--ListItem-paddingY": "0.75rem" }}>
                        {materials
                          .filter((m) => m.type === "images")
                          .map((material) => (
                            <ListItem
                              key={material.id}
                              sx={{
                                borderRadius: "sm",
                                "&:hover": { bgcolor: "background.level1" },
                              }}
                            >
                              <ListItemDecorator>
                                {material.thumbnail ? (
                                  <AspectRatio ratio="1" sx={{ width: 40, height: 40, borderRadius: "sm" }}>
                                    <Image
                                      src={material.thumbnail || "/placeholder.svg"}
                                      alt={material.name}
                                      fill
                                      sizes="40px"
                                      style={{ objectFit: "cover", borderRadius: "inherit" }}
                                      priority={false}
                                    />
                                  </AspectRatio>

                                ) : (
                                  <Avatar variant="soft" size="sm">
                                    <Folder />
                                  </Avatar>
                                )}
                              </ListItemDecorator>
                              <ListItemContent>
                                <Typography level="body-sm">{material.name}</Typography>
                                <Typography level="body-xs" color="neutral">
                                  {material.size} • {new Date(material.lastModified).toLocaleDateString()}
                                </Typography>
                              </ListItemContent>
                              <IconButton variant="plain" color="neutral" size="sm">
                                <MoreVert />
                              </IconButton>
                            </ListItem>
                          ))}
                      </List>
                    </TabPanel>
                    <TabPanel value={3}>
                      <List sx={{ "--ListItem-paddingY": "0.75rem" }}>
                        {materials
                          .filter((m) => m.type === "document")
                          .map((material) => (
                            <ListItem
                              key={material.id}
                              sx={{
                                borderRadius: "sm",
                                "&:hover": { bgcolor: "background.level1" },
                              }}
                            >
                              <ListItemDecorator>
                                {material.thumbnail ? (
                                  <AspectRatio ratio="1" sx={{ width: 40, height: 40, borderRadius: "sm" }}>
                                    <Image
                                      src={material.thumbnail || "/placeholder.svg"}
                                      alt={material.name}
                                      fill
                                      sizes="40px"
                                      style={{ objectFit: "cover", borderRadius: "inherit" }}
                                      priority={false}
                                    />
                                  </AspectRatio>

                                ) : (
                                  <Avatar variant="soft" size="sm">
                                    <Folder />
                                  </Avatar>
                                )}
                              </ListItemDecorator>
                              <ListItemContent>
                                <Typography level="body-sm">{material.name}</Typography>
                                <Typography level="body-xs" color="neutral">
                                  {material.size} • {new Date(material.lastModified).toLocaleDateString()}
                                </Typography>
                              </ListItemContent>
                              <IconButton variant="plain" color="neutral" size="sm">
                                <MoreVert />
                              </IconButton>
                            </ListItem>
                          ))}
                      </List>
                    </TabPanel>
                  </Tabs>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startDecorator={<Add />}
                      onClick={() => router.push("/material/new")}
                      sx={{
                        bgcolor: "#ffbc62",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#ff9b44",
                        },
                      }}
                    >
                      Subir material
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </ColumnLayout>
    </>
  )
}
