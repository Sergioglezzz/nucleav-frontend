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
  CheckCircle,
} from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useDashboardData } from "@/hooks/UseDashboardData"
import StatsChart from "../../components/charts/StatsCharts"
import DonutChart from "../../components/charts/DonutChart"
import QuickActions from "../../components/dashboard/QuickActions"
import { useRouter } from "next/navigation"
import { useColorScheme } from "@mui/joy/styles"

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stats, companies, materials, activities, loading, error, refetch } = useDashboardData()
  const router = useRouter()
  const { mode } = useColorScheme()

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

  const materialChartData = [
    { label: "Videos", value: stats?.materials.videos || 0, color: "#2196F3" },
    { label: "Imágenes", value: stats?.materials.images || 0, color: "#4CAF50" },
    { label: "Audio", value: stats?.materials.audio || 0, color: "#FF9800" },
    { label: "Documentos", value: stats?.materials.documents || 0, color: "#9C27B0" },
  ]

  const companyChartData = [
    { label: "Activas", value: stats?.companies.myCompanies || 0, color: "#4CAF50" },
    { label: "Nuevas (7 días)", value: stats?.companies.recentlyCreated || 0, color: "#ffbc62" },
    { label: "Total", value: (stats?.companies.total || 0) - (stats?.companies.myCompanies || 0), color: "#9E9E9E" },
  ]

  return (
    <ColumnLayout>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography level="h1" sx={{ color: "#ffbc62", mb: 1 }}>
            Dashboard
          </Typography>
          <Typography level="body-lg" color="neutral">
            Resumen de tu actividad y recursos audiovisuales
          </Typography>
        </Box>
        <IconButton
          variant="outlined"
          color="neutral"
          onClick={refetch}
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

      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 188, 98, 0.2)",
                    color: "#ffbc62",
                    mr: 2,
                  }}
                >
                  <Business />
                </Box>
                <Typography level="title-md">Empresas</Typography>
              </Box>
              <Typography level="h2" sx={{ mb: 1 }}>
                {stats?.companies.total || 0}
              </Typography>
              <Chip size="sm" variant="soft" color="success" startDecorator={<TrendingUp fontSize="small" />}>
                {stats?.companies.recentlyCreated || 0} nuevas esta semana
              </Chip>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(76, 175, 80, 0.2)",
                    color: "#4CAF50",
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
              <Typography level="body-sm" color="neutral">
                {stats?.materials.totalSize || "0 MB"} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(33, 150, 243, 0.2)",
                    color: "#2196F3",
                    mr: 2,
                  }}
                >
                  <Upload />
                </Box>
                <Typography level="title-md">Subidas Hoy</Typography>
              </Box>
              <Typography level="h2" sx={{ mb: 1 }}>
                {stats?.activity.uploadsToday || 0}
              </Typography>
              <Chip size="sm" variant="soft" color="primary" startDecorator={<CheckCircle fontSize="small" />}>
                Archivos nuevos
              </Chip>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(156, 39, 176, 0.2)",
                    color: "#9C27B0",
                    mr: 2,
                  }}
                >
                  <Group />
                </Box>
                <Typography level="title-md">Red de Contactos</Typography>
              </Box>
              <Typography level="h2" sx={{ mb: 1 }}>
                {stats?.activity.activeUsers || 0}
              </Typography>
              <Button
                size="sm"
                variant="plain"
                color="neutral"
                endDecorator={<ArrowForward />}
                onClick={() => router.push("/red")}
              >
                Ver contactos
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <DonutChart
            title="Distribución de Materiales"
            data={materialChartData}
            centerText="Total"
            centerValue={stats?.materials.total || 0}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <StatsChart title="Materiales por Tipo" data={materialChartData} total={stats?.materials.total || 0} />
        </Grid>

        <Grid xs={12} md={4}>
          <StatsChart title="Estado de Empresas" data={companyChartData} total={stats?.companies.total || 0} />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <QuickActions title={""} data={[]} total={0} />
      </Box>

      {/* Recent Activity and Materials */}
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography level="title-lg" sx={{ color: "#ffbc62" }}>
                  Actividad Reciente
                </Typography>
                <Button size="sm" variant="plain" color="neutral" endDecorator={<ArrowForward />}>
                  Ver todo
                </Button>
              </Box>
              <Divider />
              <List sx={{ mt: 2 }}>
                {activities.slice(0, 6).map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemDecorator>
                      <Avatar size="sm" src={activity.user.avatar} />
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

        <Grid xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography level="title-lg" sx={{ color: "#ffbc62" }}>
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
              <List sx={{ mt: 2 }}>
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
                    <ListItem key={material.id}>
                      <ListItemDecorator>
                        <Avatar variant="soft" size="sm">
                          {getIcon(material.type)}
                        </Avatar>
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="body-sm">{material.name}</Typography>
                        <Typography level="body-xs" color="neutral">
                          {formatFileSize(material.file_size || 0)} •{" "}
                          {new Date(material.created_at).toLocaleDateString()}
                        </Typography>
                      </ListItemContent>
                    </ListItem>
                  )
                })}
              </List>
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
