"use client"

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  LinearProgress,
} from "@mui/joy"
import {
  Business,
  Folder,
  Group,
  TrendingUp,
  Refresh,
  ArrowForward,
  Movie,
  Image as ImageIcon,
  AudioFile,
  Description,
  Upload,
  Assignment,
} from "@mui/icons-material"
import { useState, useEffect } from "react"
import ColumnLayout from "@/components/ColumnLayout"
import { useDashboardData } from "@/hooks/UseDashboardData"
import StatsChart from "../../components/charts/StatsCharts"
import DonutChart from "../../components/charts/DonutChart"
import { useRouter } from "next/navigation"
import { useColorScheme } from "@mui/joy/styles"

// Añadir después de las importaciones y antes del componente
import { useSession } from "next-auth/react"
import axios from "axios"

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stats, companies, materials, activities, loading, error, refetch } = useDashboardData()
  const router = useRouter()
  const { mode } = useColorScheme()

  // Añadir después de la línea const { mode } = useColorScheme()
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  // Función para obtener proyectos reales
  const fetchProjects = async () => {
    if (!session?.accessToken) return

    try {
      setProjectsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      const projectsData = response.data.data || response.data
      const projectsArray = Array.isArray(projectsData) ? projectsData : [projectsData]
      setProjects(projectsArray)
    } catch (err) {
      console.error("Error al cargar proyectos:", err)
    } finally {
      setProjectsLoading(false)
    }
  }

  // useEffect para cargar proyectos
  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken])

  // Reemplazar la sección de datos simulados con:
  // Calcular estadísticas reales de proyectos
  const projectStats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active" || p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    pending: projects.filter((p) => p.status === "pending" || p.status === "draft").length,
    recentlyCreated: projects.filter((p) => {
      const createdDate = new Date(p.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate >= weekAgo
    }).length,
  }

  // Datos para el gráfico de proyectos basados en datos reales
  const projectChartData = [
    { label: "Activos", value: projectStats.active, color: "#4CAF50" },
    { label: "Completados", value: projectStats.completed, color: "#2196F3" },
    { label: "Pendientes", value: projectStats.pending, color: "#FF9800" },
  ]

  // Proyectos recientes reales (últimos 5)
  const recentProjects = projects
    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
    .slice(0, 5)
    .map((project) => ({
      ...project,
      progress: project.progress || Math.floor(Math.random() * 100), // Si no hay progress en la API, usar valor aleatorio temporal
    }))

  if (loading) {
    return (
      <ColumnLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
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

  if (error) {
    return (
      <ColumnLayout>
        <Alert color="danger" variant="soft" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </ColumnLayout>
    )
  }

  const companyChartData = [
    { label: "Activas", value: stats?.companies.myCompanies || 0, color: "#4CAF50" },
    { label: "Nuevas (7 días)", value: stats?.companies.recentlyCreated || 0, color: "#ffbc62" },
    { label: "Total", value: (stats?.companies.total || 0) - (stats?.companies.myCompanies || 0), color: "#9E9E9E" },
  ]

  // Función para crear el estilo de tarjeta consistente
  const getCardStyle = () => ({
    background:
      mode === "dark"
        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
        : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
    backdropFilter: "blur(10px)",
    border: "1px solid",
    borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    height: "100%", // Asegura que todas las tarjetas tengan la misma altura en su contenedor
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "sm",
      transform: "translateY(-2px)",
    },
  })

  // Actualizar la función para obtener el color según el estado del proyecto
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return "success"
      case "completed":
        return "primary"
      case "pending":
      case "draft":
        return "warning"
      default:
        return "neutral"
    }
  }

  // Función para obtener el texto del estado en español
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return "Activo"
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "draft":
        return "Borrador"
      default:
        return "Desconocido"
    }
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  // Modificar la función refetch para incluir proyectos
  const handleRefresh = () => {
    refetch()
    fetchProjects()
  }

  return (
    <ColumnLayout>
      {/* Header mejorado */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            level="h1"
            sx={{
              color: "#ffbc62",
              mb: 0.5,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              fontWeight: 700,
            }}
          >
            Dashboard
          </Typography>
          <Typography level="body-lg" color="neutral">
            Resumen de tu actividad y recursos audiovisuales
          </Typography>
        </Box>
        <IconButton
          variant="outlined"
          color="neutral"
          onClick={handleRefresh}
          sx={{
            borderColor: "#ffbc62",
            color: "#ffbc62",
            "&:hover": {
              borderColor: "#ff9b44",
              bgcolor: "rgba(255, 188, 98, 0.1)",
            },
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* Main Stats Cards - Redistribuidos para mejor balance */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {/* Proyectos Card */}
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: "rgba(33, 150, 243, 0.2)",
                      color: "#2196F3",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Assignment />
                  </Box>
                  <Typography level="title-md">Proyectos</Typography>
                </Box>
                <Typography level="h2" sx={{ fontWeight: 700 }}>
                  {projectStats.total}
                </Typography>
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  startDecorator={<TrendingUp fontSize="small" />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {projectStats.recentlyCreated} nuevos esta semana
                </Chip>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Empresa Card */}
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 188, 98, 0.2)",
                      color: "#ffbc62",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Business />
                  </Box>
                  <Typography level="title-md">Empresas</Typography>
                </Box>
                <Typography level="h2" sx={{ fontWeight: 700 }}>
                  {stats?.companies.total || 0}
                </Typography>
                <Chip
                  size="sm"
                  variant="soft"
                  color="success"
                  startDecorator={<TrendingUp fontSize="small" />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {stats?.companies.recentlyCreated || 0} nuevas esta semana
                </Chip>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Materiales Card */}
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: "rgba(76, 175, 80, 0.2)",
                      color: "#4CAF50",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Folder />
                  </Box>
                  <Typography level="title-md">Materiales</Typography>
                </Box>
                <Typography level="h2" sx={{ fontWeight: 700 }}>
                  {stats?.materials.total || 0}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  {stats?.materials.totalSize || "0 MB"} total
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Red de Contactos Card */}
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: "rgba(156, 39, 176, 0.2)",
                      color: "#9C27B0",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Group />
                  </Box>
                  <Typography level="title-md">Red de Contactos</Typography>
                </Box>
                <Typography level="h2" sx={{ fontWeight: 700 }}>
                  {stats?.activity.activeUsers || 0}
                </Typography>
                <Button
                  size="sm"
                  variant="plain"
                  color="neutral"
                  endDecorator={<ArrowForward />}
                  onClick={() => router.push("/network")}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Ver contactos
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts - Redistribuidos para mejor balance */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {/* Gráfico de Proyectos */}
        <Grid xs={12} md={6}>
          <DonutChart
            title="Distribución de Proyectos"
            data={projectChartData}
            centerText="Total"
            centerValue={projectStats.total}
          />
        </Grid>

        {/* Gráfico de Empresas */}
        <Grid xs={12} md={6}>
          <StatsChart title="Estado de Empresas" data={companyChartData} total={stats?.companies.total || 0} />
        </Grid>
      </Grid>

      {/* Proyectos y Actividad Reciente */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {/* Proyectos Recientes */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  gap: 1,
                }}
              >
                <Typography
                  level="title-lg"
                  sx={{
                    color: "#ffbc62",
                    fontWeight: 600,
                  }}
                >
                  Proyectos Recientes
                </Typography>
                <Button
                  size="sm"
                  variant="plain"
                  color="neutral"
                  endDecorator={<ArrowForward />}
                  onClick={() => router.push("/project")}
                >
                  Ver todos
                </Button>
              </Box>
              <Divider />
              <List
                sx={{
                  mt: 2,
                  "--ListItem-paddingY": "12px",
                  maxHeight: { xs: "300px", md: "350px" },
                  overflow: "auto",
                }}
              >
                {projectsLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress size="sm" />
                  </Box>
                ) : recentProjects.length === 0 ? (
                  <Box sx={{ textAlign: "center", p: 3 }}>
                    <Typography level="body-sm" color="neutral">
                      No hay proyectos recientes
                    </Typography>
                  </Box>
                ) : (
                  recentProjects.map((project) => (
                    <ListItem key={project.id}>
                      <ListItemContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography
                            level="body-sm"
                            fontWeight="lg"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: { xs: "180px", sm: "250px", md: "200px", lg: "250px" },
                            }}
                          >
                            {project.name || project.title}
                          </Typography>
                          <Chip
                            size="sm"
                            variant="soft"
                            color={getStatusColor(project.status)}
                            sx={{ ml: 1, minWidth: 80, justifyContent: "center" }}
                          >
                            {getStatusText(project.status)}
                          </Chip>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Typography level="body-xs" color="neutral">
                            {project.company_name || project.client || "Sin empresa"}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            • {formatDate(project.updated_at || project.created_at)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LinearProgress
                            determinate
                            value={project.progress || 0}
                            sx={{
                              flex: 1,
                              "--LinearProgress-radius": "4px",
                              "--LinearProgress-progressThickness": "8px",
                              "--LinearProgress-trackThickness": "8px",
                              "--LinearProgress-progressColor":
                                project.status === "active" || project.status === "in_progress"
                                  ? "#4CAF50"
                                  : project.status === "completed"
                                    ? "#2196F3"
                                    : "#FF9800",
                            }}
                          />
                          <Typography level="body-xs" fontWeight="lg">
                            {project.progress || 0}%
                          </Typography>
                        </Box>
                      </ListItemContent>
                    </ListItem>
                  ))
                )}
              </List>
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="solid"
                  startDecorator={<Assignment />}
                  onClick={() => router.push("/project/create")}
                  sx={{
                    bgcolor: "#ffbc62",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 188, 98, 0.8)",
                    },
                  }}
                >
                  Nuevo Proyecto
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Actividad Reciente */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  gap: 1,
                }}
              >
                <Typography
                  level="title-lg"
                  sx={{
                    color: "#ffbc62",
                    fontWeight: 600,
                  }}
                >
                  Actividad Reciente
                </Typography>
                <Button size="sm" variant="plain" color="neutral" endDecorator={<ArrowForward />}>
                  Ver todo
                </Button>
              </Box>
              <Divider />
              <List
                sx={{
                  mt: 2,
                  "--ListItem-paddingY": "8px",
                  maxHeight: { xs: "300px", md: "350px" },
                  overflow: "auto",
                }}
              >
                {activities.slice(0, 6).map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemDecorator>
                      <Avatar
                        size="sm"
                        src={activity.user.avatar}
                        sx={{
                          border: "1px solid",
                          borderColor: "rgba(0,0,0,0.1)",
                        }}
                      />
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Materiales Recientes */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid xs={12}>
          <Card variant="outlined" sx={getCardStyle()}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  gap: 1,
                }}
              >
                <Typography
                  level="title-lg"
                  sx={{
                    color: "#ffbc62",
                    fontWeight: 600,
                  }}
                >
                  Materiales Recientes
                </Typography>
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
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {materials.slice(0, 6).map((material) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case "video":
                        return <Movie />
                      case "image":
                        return <ImageIcon />
                      case "audio":
                        return <AudioFile />
                      case "document":
                        return <Description />
                      default:
                        return <Folder />
                    }
                  }

                  const formatFileSize = (bytes: number) => {
                    if (bytes === 0) return "0 Bytes"
                    const k = 1024
                    const sizes = ["Bytes", "KB", "MB", "GB"]
                    const i = Math.floor(Math.log(bytes) / Math.log(k))
                    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
                  }

                  return (
                    <Grid xs={12} sm={6} md={4} key={material.id}>
                      <Card
                        variant="soft"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          bgcolor:
                            material.type === "video"
                              ? "rgba(33, 150, 243, 0.1)"
                              : material.type === "image"
                                ? "rgba(76, 175, 80, 0.1)"
                                : material.type === "audio"
                                  ? "rgba(255, 152, 0, 0.1)"
                                  : "rgba(156, 39, 176, 0.1)",
                        }}
                      >
                        <Avatar
                          variant="soft"
                          size="lg"
                          sx={{
                            bgcolor:
                              material.type === "video"
                                ? "rgba(33, 150, 243, 0.2)"
                                : material.type === "image"
                                  ? "rgba(76, 175, 80, 0.2)"
                                  : material.type === "audio"
                                    ? "rgba(255, 152, 0, 0.2)"
                                    : "rgba(156, 39, 176, 0.2)",
                            color:
                              material.type === "video"
                                ? "#2196F3"
                                : material.type === "image"
                                  ? "#4CAF50"
                                  : material.type === "audio"
                                    ? "#FF9800"
                                    : "#9C27B0",
                          }}
                        >
                          {getIcon(material.type)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            level="body-sm"
                            fontWeight="lg"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {material.name}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            {formatFileSize(material.file_size || 0)} •{" "}
                            {new Date(material.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="solid"
                  startDecorator={<Upload />}
                  onClick={() => router.push("/material/create")}
                  sx={{
                    bgcolor: "#ffbc62",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 188, 98, 0.8)",
                    },
                  }}
                >
                  Subir Material
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ColumnLayout>
  )
}

