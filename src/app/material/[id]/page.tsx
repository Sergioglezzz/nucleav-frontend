"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Button,
  Chip,
  AspectRatio,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from "@mui/joy"
import {
  ArrowBackIos,
  Edit,
  Delete as DeleteIcon,
  Share,
  Favorite,
  FavoriteBorder,
  LocationOn,
  Category,
  Numbers,
  CalendarToday,
  Person,
  Description,
  QrCode,
  PhotoCamera,
  ConstructionOutlined,
} from "@mui/icons-material"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useColorScheme } from "@mui/joy/styles"
import axios from "axios"
import Image from "next/image"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import DeleteMaterialModal from "../components/DeleteMaterialModal"

interface Material {
  id: string
  name: string
  description: string | null
  category: string | null
  quantity: number
  is_consumable: boolean
  location: string | null
  serial_number: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  // Campos adicionales que podrían venir de la API
  owner?: string
  status?: string
  tags?: string[]
}

export default function MaterialDetailPage() {
  const router = useRouter()
  const params = useParams()
  const materialId = params.id as string
  const { data: session } = useSession()
  const { mode } = useColorScheme()
  const { showNotification } = useNotification()

  const [material, setMaterial] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Cargar datos del material
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!session?.accessToken || !materialId) return

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials/${materialId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        setMaterial(response.data)
      } catch (err: unknown) {
        console.error("Error al cargar el material:", err)

        let errorMessage = "No se pudo cargar el material."
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { status?: number } }).response === "object"
        ) {
          const response = (err as { response?: { status?: number } }).response
          if (response?.status === 404) {
            errorMessage = "Material no encontrado."
          } else if (response?.status === 403) {
            errorMessage = "No tienes permisos para ver este material."
          }
        }

        setError(errorMessage)
        showNotification(errorMessage, "error")
      } finally {
        setLoading(false)
      }
    }

    fetchMaterial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, materialId])

  const handleBack = () => {
    router.push("/material")
  }

  const handleEdit = () => {
    router.push(`/material/edit/${materialId}`)
  }

  const handleDelete = () => {
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    showNotification(`Material "${material?.name}" eliminado correctamente`, "success")
    router.push("/material")
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    showNotification(isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos", isFavorite ? "warning" : "success")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: material?.name,
          text: material?.description || `Material: ${material?.name}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      showNotification("URL copiada al portapapeles", "success")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  if (error || !material) {
    return (
      <ColumnLayout>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Alert variant="soft" color="danger" sx={{ mb: 3 }}>
            <Typography level="title-md">{error || "Material no encontrado"}</Typography>
            <Typography level="body-sm">El material que buscas no existe o no tienes permisos para verlo.</Typography>
          </Alert>
          <Button variant="outlined" onClick={handleBack} startDecorator={<ArrowBackIos />}>
            Volver a materiales
          </Button>
        </Box>
      </ColumnLayout>
    )
  }

  return (
    <>
      <ColumnLayout>
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 0.3, sm: 3 } }}>
          {/* Header con navegación y acciones */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1, mt: -1 }}>
              <IconButton
                variant="soft"
                size="sm"
                color="neutral"
                onClick={handleBack}
                sx={{
                  padding: "6px",
                  borderRadius: "50%",
                  backdropFilter: "blur(4px)",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                }}
              >
                <ArrowBackIos fontSize="small" sx={{ marginRight: -1 }} />
              </IconButton>
              <Box>
                <Typography level="h3" sx={{ color: "#ffbc62", mb: 0.3, mt: -0.5, fontWeight: 600 }}>
                  {material.name}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Detalles del material
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                "@media (max-width:600px)": {
                  flexDirection: "column",
                  alignItems: "flex-start",
                },
              }}
            >
              <Tooltip title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"} arrow>
                <IconButton
                  variant="soft"
                  color={isFavorite ? "danger" : "neutral"}
                  onClick={handleToggleFavorite}
                  sx={{
                    "&:hover": {
                      bgcolor: isFavorite ? "danger.100" : "neutral.100",
                    },
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Compartir" arrow>
                <IconButton variant="soft" color="neutral" onClick={handleShare}>
                  <Share />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Grid container spacing={3}>
            {/* Columna izquierda - Imagen y información básica */}
            <Grid xs={12} md={5}>
              <Stack spacing={3}>
                {/* Imagen del material */}
                <Card
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <AspectRatio ratio="1" sx={{ minHeight: 300 }}>
                    {material.image_url ? (
                      <Image
                        src={material.image_url || "/placeholder.svg"}
                        alt={material.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          bgcolor: mode === "dark" ? "rgba(45,45,45,0.3)" : "rgba(250,250,250,0.8)",
                          color: mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
                          gap: 2,
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 64 }} />
                        <Typography level="body-sm">Sin imagen</Typography>
                      </Box>
                    )}
                  </AspectRatio>
                </Card>

                {/* Estado y disponibilidad */}
                <Card
                  variant="outlined"
                  sx={{
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent>
                    <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
                      Estado y Disponibilidad
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography level="body-sm">Estado:</Typography>
                        <Chip variant="soft" color="success" size="sm">
                          Disponible
                        </Chip>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography level="body-sm">Cantidad:</Typography>
                        <Chip
                          variant="soft"
                          color={material.quantity > 5 ? "success" : material.quantity > 1 ? "warning" : "danger"}
                          size="sm"
                        >
                          {material.quantity} unidades
                        </Chip>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography level="body-sm">Tipo:</Typography>
                        <Chip variant="soft" color={material.is_consumable ? "warning" : "primary"} size="sm">
                          {material.is_consumable ? "Fungible" : "No fungible"}
                        </Chip>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Columna derecha - Información detallada */}
            <Grid xs={12} md={7}>
              <Stack spacing={3}>
                {/* Información general */}
                <Card
                  variant="outlined"
                  sx={{
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent>
                    <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
                      Información General
                    </Typography>
                    <Stack spacing={2}>
                      {material.description && (
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                            <Description sx={{ fontSize: 18, color: "text.tertiary", mt: 0.2 }} />
                            <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                              Descripción:
                            </Typography>
                          </Stack>
                          <Typography level="body-sm" sx={{ ml: 3, color: "text.secondary" }}>
                            {material.description}
                          </Typography>
                        </Box>
                      )}

                      {material.category && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Category sx={{ fontSize: 18, color: "text.tertiary" }} />
                          <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                            Categoría:
                          </Typography>
                          <Chip variant="soft" color="primary" size="sm">
                            {material.category}
                          </Chip>
                        </Box>
                      )}

                      {material.location && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: "text.tertiary" }} />
                          <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                            Ubicación:
                          </Typography>
                          <Typography level="body-sm" color="neutral">
                            {material.location}
                          </Typography>
                        </Box>
                      )}

                      {material.serial_number && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <QrCode sx={{ fontSize: 18, color: "text.tertiary" }} />
                          <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                            Número de serie:
                          </Typography>
                          <Typography level="body-sm" color="neutral" sx={{ fontFamily: "monospace" }}>
                            {material.serial_number}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Información técnica */}
                <Card
                  variant="outlined"
                  sx={{
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent>
                    <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
                      Información Técnica
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        <Box sx={{ textAlign: "center", p: 2 }}>
                          <Numbers sx={{ fontSize: 32, color: "#ffbc62", mb: 1 }} />
                          <Typography level="title-lg" sx={{ fontWeight: 600 }}>
                            {material.quantity}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            Cantidad
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={6}>
                        <Box sx={{ textAlign: "center", p: 2 }}>
                          <ConstructionOutlined sx={{ fontSize: 32, color: "#ffbc62", mb: 1 }} />
                          <Typography level="title-lg" sx={{ fontWeight: 600 }}>
                            {material.is_consumable ? "Sí" : "No"}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            Fungible
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Historial y fechas */}
                <Card
                  variant="outlined"
                  sx={{
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent>
                    <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
                      Historial
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 18, color: "text.tertiary" }} />
                        <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                          Creado:
                        </Typography>
                        <Typography level="body-sm" color="neutral">
                          {formatDate(material.created_at)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 18, color: "text.tertiary" }} />
                        <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                          Última actualización:
                        </Typography>
                        <Typography level="body-sm" color="neutral">
                          {formatDate(material.updated_at)}
                        </Typography>
                      </Box>
                      {material.owner && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Person sx={{ fontSize: 18, color: "text.tertiary" }} />
                          <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                            Propietario:
                          </Typography>
                          <Typography level="body-sm" color="neutral">
                            {material.owner}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Acciones principales */}
                <Card
                  variant="outlined"
                  sx={{
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent>
                    <Typography level="title-sm" sx={{ mb: 2, color: "#ffbc62" }}>
                      Acciones
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Button
                        variant="solid"
                        startDecorator={<Edit />}
                        onClick={handleEdit}
                        sx={{
                          bgcolor: "#ffbc62",
                          color: "black",
                          "&:hover": {
                            bgcolor: "rgba(255, 188, 98, 0.8)",
                          },
                          flexGrow: 1,
                          minWidth: "fit-content",
                        }}
                      >
                        Editar Material
                      </Button>
                      <Button
                        variant="outlined"
                        color="danger"
                        startDecorator={<DeleteIcon />}
                        onClick={handleDelete}
                        sx={{ flexGrow: 1, minWidth: "fit-content" }}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </ColumnLayout>

      {/* Modal de eliminación */}
      <DeleteMaterialModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        material={
          deleteModalOpen
            ? {
              id: material.id,
              name: material.name,
              category: material.category,
              quantity: material.quantity,
            }
            : null
        }
        onDeleted={handleDeleteConfirm}
      />
    </>
  )
}
