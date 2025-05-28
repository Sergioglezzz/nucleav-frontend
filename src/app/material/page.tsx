"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Input,
  IconButton,
  Grid,
  Select,
  Option,
  Stack,
  Button,
  Sheet,
  CircularProgress,
} from "@mui/joy"
import { Search, FilterList, SortByAlpha, CalendarMonth, Add } from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"
import { useRouter } from "next/navigation"
import CustomTabs from "@/components/CustomTabs"
import MaterialCard, { type MaterialCardProps } from "./components/MaterialCard"

// Añadir axios a las importaciones
import axios from "axios"
import { useSession } from "next-auth/react"

// Reemplazar el tipo Material para que coincida con la API
type Material = Omit<MaterialCardProps, "onToggleFavorite" | "onEdit" | "onDelete" | "onView"> & {
  id: string
  name: string
  description: string | null
  category: string | null
  quantity: number
  is_consumable: boolean
  location: string | null
  serial_number: string | null
  created_at: string // Nota: la API probablemente usa snake_case
  updated_at: string
  isFavorite?: boolean // Mantenemos esto para la funcionalidad de favoritos en el frontend
}

const tabOptions = [
  { value: "my-materials", label: "Mis Materiales" },
  { value: "company-materials", label: "Materiales de la Empresa" },
]

// Reemplazar la función MaterialPage con la siguiente implementación
export default function MaterialPage() {
  const { mode } = useColorScheme()
  const { data: session } = useSession()

  // Estados para gestionar la interfaz
  const [activeTab, setActiveTab] = useState<string>("my-materials")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  // Función para cargar materiales desde la API
  const fetchMaterials = async (pageNum = 1, append = false) => {
    if (!session?.accessToken) {
      setError("Debes iniciar sesión para ver los materiales")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        params: {
          page: pageNum,
          // Aquí puedes añadir más parámetros según la API
          // limit: 10,
          // sort: sortBy,
          // category: selectedType !== 'all' ? selectedType : undefined,
          // search: searchQuery || undefined,
        },
      })

      // Transformar los datos si es necesario para que coincidan con nuestro tipo Material
      const apiMaterials = response.data.data || response.data || []

      // Mapear los datos de la API a nuestro formato
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedMaterials = apiMaterials.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        is_consumable: item.is_consumable,
        location: item.location,
        serial_number: item.serial_number,
        createdAt: item.created_at, // Convertimos snake_case a camelCase
        // Añadir campos que podrían no venir de la API pero necesitamos para el componente
        type: "equipment",
        thumbnail: item.image_url || null, // Usar la imagen de la API si existe
        tags: item.tags || [],
        isFavorite: false, // Por defecto no es favorito
      }))

      if (append) {
        setMaterials((prev) => [...prev, ...formattedMaterials])
      } else {
        setMaterials(formattedMaterials)
      }

    } catch (err) {
      console.error("Error al cargar materiales:", err)
      setError("No se pudieron cargar los materiales. Por favor, intenta de nuevo más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar materiales cuando el componente se monta o cambian los filtros
  useEffect(() => {
    if (session?.accessToken) {
      fetchMaterials(1, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, selectedType, sortBy, activeTab])

  // Función para filtrar materiales localmente (para búsqueda en tiempo real)
  const filteredMaterials = materials.filter((material) => {
    if (!searchQuery) return true

    // Filtrar por búsqueda
    return (
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      material.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      material.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      false
    )
  })

  // Función para ordenar materiales localmente
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  // Navegar a la página de creación de Materiales
  const handleCreateMaterial = () => {
    router.push("/material/create")
  }

  // Función para manejar el toggle de favorito
  const handleToggleFavorite = (id: string) => {
    setMaterials(
      materials.map((material) => (material.id === id ? { ...material, isFavorite: !material.isFavorite } : material)),
    )
  }

  // Funciones para manejar acciones en las tarjetas
  const handleEditMaterial = (id: string) => {
    router.push(`/material/edit/${id}`)
  }

  // Función para manejar la eliminación desde el modal
  const handleDeleteMaterial = (id: string) => {
    // Actualizar el estado local eliminando el material
    setMaterials(materials.filter((material) => material.id !== id))
  }

  const handleViewMaterial = (id: string) => {
    router.push(`/material/${id}`)
  }

  // Reemplazar la sección de carga de datos mock con un mensaje de error si existe
  useEffect(() => {
    // Este efecto está vacío porque ya tenemos fetchMaterials
    // que se ejecuta en otro useEffect
  }, [])

  return (
    <>
      <ColumnLayout>
        <Box sx={{ mb: 4 }}>
          <Typography level="h1" sx={{ mb: 1, color: "#ffbc62" }}>
            Materiales y Equipos
          </Typography>
          <Typography level="body-lg" color="neutral">
            Gestiona y explora todos los recursos disponibles para tus producciones
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

          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              placeholder="Categoría"
              value={selectedType}
              onChange={(_, value) => setSelectedType(value)}
              startDecorator={<FilterList />}
              size="sm"
              sx={{ minWidth: 120 }}
            >
              <Option value="all">Todas</Option>
              <Option value="Cámaras">Cámaras</Option>
              <Option value="Audio">Audio</Option>
              <Option value="Iluminación">Iluminación</Option>
              <Option value="Soportes">Soportes</Option>
              <Option value="Accesorios">Accesorios</Option>
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
            <Stack justifyContent={"flex-end"} direction={"row"} mb={3}>
              <Button
                variant="solid"
                startDecorator={<Add />}
                onClick={handleCreateMaterial}
                sx={{
                  bgcolor: "#ffbc62",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 188, 98, 0.8)",
                  },
                }}
              >
                Nuevo
              </Button>
            </Stack>
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

            <Select placeholder="Ubicación" size="sm" sx={{ minWidth: 150 }}>
              <Option value="all">Todas</Option>
              <Option value="almacen">Almacén principal</Option>
              <Option value="estudio">Estudios</Option>
              <Option value="caja">Caja fuerte</Option>
            </Select>

            <Select placeholder="Estado" size="sm" sx={{ minWidth: 150 }}>
              <Option value="all">Todos</Option>
              <Option value="disponible">Disponible</Option>
              <Option value="prestado">Prestado</Option>
              <Option value="mantenimiento">En mantenimiento</Option>
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

        <CustomTabs options={tabOptions} defaultValue={activeTab} onChange={(value) => setActiveTab(value)} />

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
            {error ? (
              <Typography level="h3" sx={{ mb: 2 }}>
                {error}
              </Typography>
            ) : (
              <>
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
              </>
            )}
          </Sheet>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {sortedMaterials.map((material) => (
              <Grid key={material.id} xs={12} sm={6} md={4}>
                <MaterialCard
                  {...material}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditMaterial}
                  onDelete={handleDeleteMaterial}
                  onView={handleViewMaterial}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mostrar mensaje de error si existe */}
        {error && (
          <Sheet
            variant="soft"
            color="danger"
            sx={{
              p: 3,
              borderRadius: "lg",
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography level="body-lg" sx={{ mb: 1 }}>
              {error}
            </Typography>
            <Button variant="soft" color="danger" onClick={() => fetchMaterials(1, false)} sx={{ mt: 1 }}>
              Reintentar
            </Button>
          </Sheet>
        )}
      </ColumnLayout>
    </>
  )
}
