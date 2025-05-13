"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Tabs,
  TabList,
  Tab,
  Input,
  IconButton,
  Card,
  AspectRatio,
  Chip,
  Grid,
  Select,
  Option,
  Stack,
  Button,
  Divider,
  Sheet,
  CircularProgress,
} from "@mui/joy"
import {
  Search,
  FilterList,
  VideoLibrary,
  Image as ImageIcon,
  AudioFile,
  Description,
  Favorite,
  FavoriteBorder,
  MoreVert,
  SortByAlpha,
  CalendarMonth,
} from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"

// Tipos para los materiales
type MaterialType = "video" | "image" | "audio" | "document" | "other"

interface Material {
  id: string
  title: string
  type: MaterialType
  thumbnail: string
  createdAt: string
  owner: string
  duration?: string // Para videos y audios
  resolution?: string // Para imágenes y videos
  fileSize: string
  tags: string[]
  isFavorite: boolean
}

// Datos de ejemplo para mostrar en el boceto
const MOCK_MATERIALS: Material[] = [
  {
    id: "1",
    title: "Entrevista CEO - Proyecto Alpha",
    type: "video",
    thumbnail: "https://picsum.photos/seed/video1/300/200",
    createdAt: "2023-10-15",
    owner: "Juan Pérez",
    duration: "12:34",
    resolution: "1920x1080",
    fileSize: "1.2 GB",
    tags: ["entrevista", "corporativo"],
    isFavorite: true,
  },
  {
    id: "2",
    title: "Fotografías evento anual",
    type: "image",
    thumbnail: "https://picsum.photos/seed/image1/300/200",
    createdAt: "2023-09-22",
    owner: "María López",
    resolution: "4000x3000",
    fileSize: "8.5 MB",
    tags: ["evento", "fotografía"],
    isFavorite: false,
  },
  {
    id: "3",
    title: "Música para spot publicitario",
    type: "audio",
    thumbnail: "https://picsum.photos/seed/audio1/300/200",
    createdAt: "2023-11-05",
    owner: "Carlos Ruiz",
    duration: "03:45",
    fileSize: "6.8 MB",
    tags: ["música", "publicidad"],
    isFavorite: true,
  },
  {
    id: "4",
    title: "Guión documental histórico",
    type: "document",
    thumbnail: "https://picsum.photos/seed/doc1/300/200",
    createdAt: "2023-08-30",
    owner: "Ana Martínez",
    fileSize: "1.5 MB",
    tags: ["guión", "documental"],
    isFavorite: false,
  },
  {
    id: "5",
    title: "Tomas aéreas ciudad",
    type: "video",
    thumbnail: "https://picsum.photos/seed/video2/300/200",
    createdAt: "2023-10-28",
    owner: "Roberto Sánchez",
    duration: "08:22",
    resolution: "3840x2160",
    fileSize: "4.7 GB",
    tags: ["aéreo", "ciudad", "4K"],
    isFavorite: false,
  },
  {
    id: "6",
    title: "Fotografías producto nuevo",
    type: "image",
    thumbnail: "https://picsum.photos/seed/image2/300/200",
    createdAt: "2023-11-10",
    owner: "Laura Gómez",
    resolution: "5000x3000",
    fileSize: "12.3 MB",
    tags: ["producto", "estudio"],
    isFavorite: true,
  },
  {
    id: "7",
    title: "Efectos sonoros para animación",
    type: "audio",
    thumbnail: "https://picsum.photos/seed/audio2/300/200",
    createdAt: "2023-09-15",
    owner: "David Torres",
    duration: "15:30",
    fileSize: "22.5 MB",
    tags: ["efectos", "animación"],
    isFavorite: false,
  },
  {
    id: "8",
    title: "Storyboard campaña verano",
    type: "document",
    thumbnail: "https://picsum.photos/seed/doc2/300/200",
    createdAt: "2023-07-20",
    owner: "Elena Castro",
    fileSize: "3.8 MB",
    tags: ["storyboard", "campaña"],
    isFavorite: true,
  },
  {
    id: "9",
    title: "Grabación evento corporativo",
    type: "video",
    thumbnail: "https://picsum.photos/seed/video3/300/200",
    createdAt: "2023-10-05",
    owner: "Miguel Ángel",
    duration: "45:12",
    resolution: "1920x1080",
    fileSize: "8.3 GB",
    tags: ["evento", "corporativo"],
    isFavorite: false,
  },
]

export default function MaterialPage() {
  const { mode } = useColorScheme()

  // Estados para gestionar la interfaz
  const [activeTab, setActiveTab] = useState<string>("my-materials")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [isLoading, setIsLoading] = useState(true)
  const [materials, setMaterials] = useState<Material[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(MOCK_MATERIALS)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para filtrar materiales
  const filteredMaterials = materials.filter((material) => {
    // Filtrar por búsqueda
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filtrar por tipo
    const matchesType = selectedType === "all" || material.type === selectedType

    // Filtrar por pestaña
    const matchesTab = activeTab === "my-materials" ? material.owner === "Juan Pérez" : true

    return matchesSearch && matchesType && matchesTab
  })

  // Función para ordenar materiales
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "name-asc":
        return a.title.localeCompare(b.title)
      case "name-desc":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  // Función para obtener el icono según el tipo de material
  const getMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case "video":
        return <VideoLibrary />
      case "image":
        return <ImageIcon />
      case "audio":
        return <AudioFile />
      case "document":
        return <Description />
      default:
        return <Description />
    }
  }

  // Función para obtener el color del chip según el tipo de material
  const getMaterialColor = (type: MaterialType): "primary" | "success" | "warning" | "neutral" | "danger" => {
    switch (type) {
      case "video":
        return "primary"
      case "image":
        return "success"
      case "audio":
        return "warning"
      case "document":
        return "neutral"
      default:
        return "neutral"
    }
  }

  // Función para manejar el toggle de favorito
  const handleToggleFavorite = (id: string) => {
    setMaterials(
      materials.map((material) => (material.id === id ? { ...material, isFavorite: !material.isFavorite } : material)),
    )
  }

  return (
    <>
      <ColumnLayout>
        <Box sx={{ mb: 4 }}>
          <Typography level="h1" sx={{ mb: 1 }}>
            Materiales Audiovisuales
          </Typography>
          <Typography level="body-lg" color="neutral">
            Gestiona y explora todos los recursos audiovisuales disponibles
          </Typography>
        </Box>

        {/* Tabs para alternar entre mis materiales y materiales de la empresa */}
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as string)} sx={{ mb: 3 }}>
          <TabList>
            <Tab value="my-materials">Mis Materiales</Tab>
            <Tab value="company-materials">Materiales de la Empresa</Tab>
          </TabList>
        </Tabs>

        {/* Barra de búsqueda y filtros */}
        <Sheet
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "lg",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
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
          <Input
            placeholder="Buscar materiales..."
            startDecorator={<Search />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              placeholder="Tipo"
              value={selectedType}
              onChange={(_, value) => setSelectedType(value)}
              startDecorator={<FilterList />}
              size="sm"
              sx={{ minWidth: 120 }}
            >
              <Option value="all">Todos</Option>
              <Option value="video">Videos</Option>
              <Option value="image">Imágenes</Option>
              <Option value="audio">Audio</Option>
              <Option value="document">Documentos</Option>
            </Select>

            <Select
              placeholder="Ordenar"
              value={sortBy}
              onChange={(_, value) => setSortBy(value as string)}
              startDecorator={sortBy.startsWith("date") ? <CalendarMonth /> : <SortByAlpha />}
              size="sm"
              sx={{ minWidth: 140 }}
            >
              <Option value="date-desc">Más recientes</Option>
              <Option value="date-asc">Más antiguos</Option>
              <Option value="name-asc">A-Z</Option>
              <Option value="name-desc">Z-A</Option>
            </Select>

            <IconButton
              variant="outlined"
              color="neutral"
              onClick={() => setShowFilters(!showFilters)}
              size="sm"
              sx={{
                bgcolor: showFilters ? "rgba(255, 188, 98, 0.2)" : undefined,
                borderColor: showFilters ? "#ffbc62" : undefined,
                color: showFilters ? "#ffbc62" : undefined,
              }}
            >
              <FilterList />
            </IconButton>
          </Stack>
        </Sheet>

        {/* Filtros adicionales (expandibles) */}
        {showFilters && (
          <Sheet
            variant="soft"
            sx={{
              p: 2,
              mb: 3,
              borderRadius: "lg",
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.4) 0%, rgba(35,35,35,0.2) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.6) 0%, rgba(240,240,240,0.3) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            }}
          >
            <Typography level="body-sm" sx={{ width: "100%", mb: 1 }}>
              Filtros avanzados
            </Typography>

            <Select placeholder="Propietario" size="sm" sx={{ minWidth: 150 }}>
              <Option value="all">Todos</Option>
              <Option value="juan">Juan Pérez</Option>
              <Option value="maria">María López</Option>
            </Select>

            <Select placeholder="Fecha" size="sm" sx={{ minWidth: 150 }}>
              <Option value="all">Cualquier fecha</Option>
              <Option value="today">Hoy</Option>
              <Option value="week">Esta semana</Option>
              <Option value="month">Este mes</Option>
            </Select>

            <Select placeholder="Etiquetas" size="sm" sx={{ minWidth: 150 }}>
              <Option value="all">Todas</Option>
              <Option value="evento">Evento</Option>
              <Option value="corporativo">Corporativo</Option>
              <Option value="publicidad">Publicidad</Option>
            </Select>

            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              sx={{
                color: "#ffbc62",
                borderColor: "#ffbc62",
                "&:hover": {
                  borderColor: "#ff9b44",
                  bgcolor: "rgba(255, 188, 98, 0.1)",
                },
              }}
            >
              Limpiar filtros
            </Button>
          </Sheet>
        )}

        {/* Grid de materiales */}
        {isLoading ? (
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
        ) : sortedMaterials.length === 0 ? (
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
              No se encontraron materiales
            </Typography>
            <Typography level="body-md" sx={{ mb: 3 }}>
              Intenta con otros términos de búsqueda o filtros
            </Typography>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => {
                setSearchQuery("")
                setSelectedType("all")
              }}
              sx={{
                color: "#ffbc62",
                borderColor: "#ffbc62",
                "&:hover": {
                  borderColor: "#ff9b44",
                  bgcolor: "rgba(255, 188, 98, 0.1)",
                },
              }}
            >
              Limpiar búsqueda
            </Button>
          </Sheet>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {sortedMaterials.map((material) => (
              <Grid key={material.id} xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "md",
                      cursor: "pointer",
                    },
                    overflow: "hidden",
                    borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <AspectRatio ratio="16/9">
                      <img
                        src={material.thumbnail || "/placeholder.svg"}
                        alt={material.title}
                        style={{ objectFit: "cover" }}
                      />
                    </AspectRatio>

                    {/* Overlay con tipo de material */}
                    <Chip
                      variant="soft"
                      color={getMaterialColor(material.type)}
                      startDecorator={getMaterialIcon(material.type)}
                      size="sm"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                      }}
                    >
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </Chip>

                    {/* Duración para videos y audios */}
                    {material.duration && (
                      <Chip
                        variant="soft"
                        color="neutral"
                        size="sm"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                        }}
                      >
                        {material.duration}
                      </Chip>
                    )}
                  </Box>

                  <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography level="title-md" sx={{ mb: 0.5 }}>
                      {material.title}
                    </Typography>

                    <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
                      {material.owner} • {new Date(material.createdAt).toLocaleDateString()}
                    </Typography>

                    <Box sx={{ mb: 1.5, flexGrow: 1 }}>
                      {material.tags.map((tag) => (
                        <Chip
                          key={tag}
                          size="sm"
                          variant="soft"
                          color="neutral"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            bgcolor: "rgba(255, 188, 98, 0.2)",
                            color: mode === "dark" ? "#ffbc62" : "#ff9b44",
                          }}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography level="body-xs" color="neutral">
                        {material.fileSize}
                        {material.resolution && ` • ${material.resolution}`}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          variant="plain"
                          color={material.isFavorite ? "danger" : "neutral"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(material.id)
                          }}
                        >
                          {material.isFavorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>

                        <IconButton variant="plain" color="neutral" size="sm">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Botón para cargar más (en lugar de paginación) */}
        {!isLoading && sortedMaterials.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<FilterList />}
              sx={{
                color: "#ffbc62",
                borderColor: "#ffbc62",
                "&:hover": {
                  borderColor: "#ff9b44",
                  bgcolor: "rgba(255, 188, 98, 0.1)",
                },
              }}
            >
              Cargar más materiales
            </Button>
          </Box>
        )}
      </ColumnLayout>
    </>
  )
}
