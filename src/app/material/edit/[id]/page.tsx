"use client"

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Input,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  Stack,
  IconButton,
  Alert,
  Divider,
  Chip,
  Tooltip,
  LinearProgress,
  AspectRatio,
  CircularProgress,
} from "@mui/joy"
import {
  Save,
  ArrowBackIos,
  InfoOutlined,
  HelpOutline,
  CloudUpload,
  Delete as DeleteIcon,
  PhotoCamera,
  Edit,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import { useState, useRef, useEffect } from "react"
import React from "react"
import Image from "next/image"

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
}

export default function EditMaterialPage() {
  const router = useRouter()
  const params = useParams()
  const materialId = params.id as string
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [, setImageFile] = useState<File | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    description: Yup.string().nullable(),
    category: Yup.string().nullable(),
    quantity: Yup.number().min(1, "Debe ser al menos 1").required("La cantidad es obligatoria"),
    is_consumable: Yup.boolean(),
    location: Yup.string().nullable(),
    serial_number: Yup.string().nullable(),
    image_url: Yup.string().nullable(),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      quantity: 1,
      is_consumable: false,
      location: "",
      serial_number: "",
      image_url: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!session?.accessToken) {
        showNotification("Debes iniciar sesión para realizar esta acción", "error")
        return
      }

      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      try {
        // Preparar los datos para enviar
        const materialData = {
          name: values.name,
          description: values.description || null,
          category: values.category || null,
          quantity: Number(values.quantity),
          is_consumable: Boolean(values.is_consumable),
          image_url: imagePreview || null,
          // location: values.location || null,
          // serial_number: values.serial_number || null,
        }

        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/materials/${materialId}`,
          materialData,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          },
        )

        console.log("Respuesta del servidor:", response.data)

        setSuccessMessage("Material actualizado correctamente")
        showNotification("Material actualizado correctamente", "success")

        // Pequeña pausa para mostrar el mensaje de éxito antes de redirigir
        setTimeout(() => {
          router.push("/material")
        }, 1500)
      } catch (err: unknown) {
        console.error("Error completo:", err)
        let errorMessage = "No se pudo actualizar el material."

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object"
        ) {
          const response = (err as { response?: { data?: { message?: string }; status?: number } }).response
          console.error("Respuesta del error:", response?.data)
          console.error("Status del error:", response?.status)

          if (response?.data?.message) {
            errorMessage = response.data.message
          } else if (response?.status === 500) {
            errorMessage = "Error interno del servidor. Por favor, contacta al administrador."
          } else if (response?.status === 404) {
            errorMessage = "Material no encontrado."
          } else if (response?.status === 403) {
            errorMessage = "No tienes permisos para editar este material."
          } else if (response?.status === 422) {
            errorMessage = "Datos inválidos. Verifica los campos e intenta nuevamente."
          }
        }

        setError(errorMessage)
        showNotification(errorMessage, "error")
      } finally {
        setSaving(false)
      }
    },
    enableReinitialize: true,
  })

  // Cargar datos del material
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!session?.accessToken || !materialId || hasInitialized) return

      setLoading(true)
      setError(null)

      try {
        console.log("Cargando material con ID:", materialId)

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials/${materialId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        console.log("Material cargado:", response.data)
        const material: Material = response.data

        // Llenar el formulario con los datos existentes
        formik.setValues({
          name: material.name || "",
          description: material.description || "",
          category: material.category || "",
          quantity: material.quantity || 1,
          is_consumable: material.is_consumable || false,
          location: material.location || "",
          serial_number: material.serial_number || "",
          image_url: material.image_url || "",
        })

        // Establecer la imagen original
        if (material.image_url) {
          setOriginalImageUrl(material.image_url)
          setImagePreview(material.image_url)
        }

        setHasInitialized(true)
        setError(null)
      } catch (err: unknown) {
        console.error("Error al cargar el material:", err)
        // Type guard for error with response property
        let errorMessage = "No se pudo cargar el material."

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object"
        ) {
          const response = (err as { response?: { data?: { message?: string }; status?: number } }).response
          console.error("Respuesta del error:", response?.data)

          if (response?.status === 404) {
            errorMessage = "Material no encontrado. Verifica que el ID sea correcto."
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
  }, [session?.accessToken, materialId, hasInitialized])

  // Manejar cambio de imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar el tipo de archivo
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        setError("El archivo debe ser una imagen (JPEG, PNG, WEBP o GIF)")
        return
      }

      // Validar el tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Result = reader.result as string
        setImagePreview(base64Result)
        console.log("Nueva imagen cargada:", base64Result.substring(0, 100) + "...")
        showNotification("Imagen cargada correctamente", "success")
      }
      reader.readAsDataURL(file)
    }
  }

  // Eliminar imagen
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    formik.setFieldValue("image_url", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    console.log("Imagen eliminada")
  }

  // Restaurar imagen original
  const handleRestoreOriginalImage = () => {
    setImageFile(null)
    setImagePreview(originalImageUrl)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Abrir selector de archivos
  const handleSelectImage = () => {
    fileInputRef.current?.click()
  }

  // Detectar cambios en el formulario
  React.useEffect(() => {
    if (loading) return // No detectar cambios mientras se cargan los datos

    const hasFormChanges =
      formik.values.name !== formik.initialValues.name ||
      formik.values.description !== formik.initialValues.description ||
      formik.values.category !== formik.initialValues.category ||
      formik.values.quantity !== formik.initialValues.quantity ||
      formik.values.is_consumable !== formik.initialValues.is_consumable ||
      formik.values.location !== formik.initialValues.location ||
      formik.values.serial_number !== formik.initialValues.serial_number

    const hasImageChanges = imagePreview !== originalImageUrl

    setIsFormDirty(hasFormChanges || hasImageChanges)
  }, [formik.values, formik.initialValues, imagePreview, originalImageUrl, loading])

  // Confirmar antes de cancelar si hay cambios
  const handleCancel = () => {
    if (isFormDirty) {
      if (window.confirm("¿Estás seguro que deseas cancelar? Los cambios no guardados se perderán.")) {
        router.push("/material")
      }
    } else {
      router.push("/material")
    }
  }

  // Mostrar loading mientras se cargan los datos
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

  return (
    <>
      {saving && <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }} />}

      {error && (
        <Alert
          variant="soft"
          color="danger"
          sx={{ mb: 2 }}
          endDecorator={
            <Button variant="soft" color="danger" size="sm" onClick={() => setError(null)}>
              Cerrar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="soft"
          color="success"
          sx={{ mb: 2 }}
          endDecorator={
            <Button variant="soft" color="success" size="sm" onClick={() => setSuccessMessage(null)}>
              Cerrar
            </Button>
          }
        >
          {successMessage}
        </Alert>
      )}

      <ColumnLayout>
        <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 0.3, sm: 3 } }}>
          <form onSubmit={formik.handleSubmit}>
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                overflow: "visible",
                position: "relative",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2, mt: -1 }}>
                  {/* Botón de retroceso */}
                  <IconButton
                    variant="soft"
                    size="sm"
                    color="neutral"
                    onClick={handleCancel}
                    sx={{
                      padding: "6px",
                      borderRadius: "50%",
                      backdropFilter: "blur(4px)",
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <ArrowBackIos fontSize="small" sx={{ marginRight: -1 }} />
                  </IconButton>
                  {/* Texto */}
                  <Box>
                    <Typography level="title-lg" sx={{ color: "#ffbc62", mb: 0.5, fontWeight: 600 }}>
                      Editar Material
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      Modifica los datos del material en el inventario
                    </Typography>
                  </Box>
                </Stack>

                {/* Sección de imagen */}
                <Divider sx={{ my: 1 }}>
                  <Chip size="sm" variant="soft" color="neutral">
                    Imagen del material
                  </Chip>
                </Divider>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, alignItems: "center" }}>
                  {/* Vista previa de la imagen */}
                  <Box sx={{ width: { xs: "100%", sm: "40%" }, position: "relative" }}>
                    <AspectRatio
                      ratio="1"
                      sx={{
                        width: "100%",
                        borderRadius: "lg",
                        bgcolor: "background.level2",
                        overflow: "hidden",
                        border: "2px dashed",
                        borderColor: isHovering ? "#ffbc62" : "divider",
                        transition: "all 0.2s ease",
                        cursor: imagePreview ? "default" : "pointer",
                        "&:hover": {
                          borderColor: "#ffbc62",
                          bgcolor: imagePreview ? "background.level2" : "rgba(255, 188, 98, 0.05)",
                        },
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      onClick={!imagePreview ? handleSelectImage : undefined}
                    >
                      {imagePreview ? (
                        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Vista previa del material"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                          {/* Overlay con acciones al hacer hover */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              bgcolor: "rgba(0,0,0,0.5)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 1,
                              opacity: isHovering ? 1 : 0,
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            <IconButton
                              variant="solid"
                              color="neutral"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectImage()
                              }}
                              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "black" }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              variant="solid"
                              color="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage()
                              }}
                              sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#d32f2f" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            textAlign: "center",
                            p: 3,
                            height: "100%",
                          }}
                        >
                          <PhotoCamera
                            sx={{
                              fontSize: 48,
                              color: isHovering ? "#ffbc62" : "text.tertiary",
                              mb: 2,
                              transition: "color 0.2s ease",
                            }}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              color: isHovering ? "#ffbc62" : "text.tertiary",
                              transition: "color 0.2s ease",
                              fontWeight: isHovering ? 500 : 400,
                            }}
                          >
                            Haz clic para seleccionar una imagen
                          </Typography>
                          <Typography level="body-xs" sx={{ color: "text.tertiary", mt: 0.5 }}>
                            JPEG, PNG, WEBP, GIF (máx. 5MB)
                          </Typography>
                        </Box>
                      )}
                    </AspectRatio>
                  </Box>

                  {/* Controles de imagen */}
                  <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
                    <Stack spacing={2}>
                      <Typography level="body-sm">
                        {originalImageUrl
                          ? "Puedes cambiar la imagen actual o eliminarla completamente."
                          : "Sube una imagen para identificar fácilmente el material."}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Button
                          variant="outlined"
                          color="neutral"
                          startDecorator={<CloudUpload />}
                          onClick={handleSelectImage}
                          sx={{
                            flexGrow: 1,
                            minWidth: "fit-content",
                            "&:hover": {
                              borderColor: "#ffbc62",
                              color: "#ffbc62",
                            },
                          }}
                        >
                          {imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}
                        </Button>

                        {imagePreview && (
                          <Button
                            variant="soft"
                            color="danger"
                            startDecorator={<DeleteIcon />}
                            onClick={handleRemoveImage}
                            sx={{ minWidth: "fit-content" }}
                          >
                            Eliminar
                          </Button>
                        )}

                        {originalImageUrl && imagePreview !== originalImageUrl && (
                          <Button
                            variant="soft"
                            color="neutral"
                            onClick={handleRestoreOriginalImage}
                            sx={{ minWidth: "fit-content" }}
                          >
                            Restaurar original
                          </Button>
                        )}
                      </Box>

                      {imagePreview && (
                        <Typography level="body-xs" sx={{ color: "success.500" }}>
                          ✓ Imagen cargada correctamente
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Box>

                {/* Input oculto para seleccionar archivos */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/gif"
                  hidden
                  onChange={handleImageChange}
                />

                <Divider sx={{ my: 1 }}>
                  <Chip size="sm" variant="soft" color="neutral">
                    Información básica
                  </Chip>
                </Divider>

                {/* Mejora de composición de campos */}
                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <FormControl error={formik.touched.name && Boolean(formik.errors.name)}>
                      <FormLabel>Nombre *</FormLabel>
                      <Input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Nombre del material"
                        sx={{
                          "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                          width: "100%",
                        }}
                      />
                      <FormHelperText>{formik.touched.name && formik.errors.name}</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Categoría</FormLabel>
                      <Input
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ej: Cámara, Audio, Iluminación..."
                        endDecorator={
                          <Tooltip title="Categoriza tus materiales para una mejor organización" arrow>
                            <InfoOutlined fontSize="small" sx={{ color: "text.tertiary" }} />
                          </Tooltip>
                        }
                        sx={{
                          "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                          width: "100%",
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <FormControl error={formik.touched.quantity && Boolean(formik.errors.quantity)}>
                      <FormLabel>Cantidad *</FormLabel>
                      <Input
                        name="quantity"
                        type="number"
                        slotProps={{ input: { min: 1 } }}
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{
                          "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                          width: "100%",
                        }}
                      />
                      <FormHelperText>{formik.touched.quantity && formik.errors.quantity}</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Número de serie</FormLabel>
                      <Input
                        name="serial_number"
                        value={formik.values.serial_number || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Número de serie (opcional)"
                        sx={{
                          "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                          width: "100%",
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Divider sx={{ my: 1 }}>
                    <Chip size="sm" variant="soft" color="neutral">
                      Detalles adicionales
                    </Chip>
                  </Divider>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <FormControl>
                      <FormLabel>Ubicación</FormLabel>
                      <Input
                        name="location"
                        value={formik.values.location || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ej: Almacén principal, Estantería B..."
                        sx={{
                          "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                          width: "100%",
                        }}
                      />
                    </FormControl>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FormControl sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                        <FormLabel sx={{ m: 0 }}>Material fungible</FormLabel>
                        <Switch
                          checked={formik.values.is_consumable}
                          onChange={(e) => formik.setFieldValue("is_consumable", e.target.checked)}
                          style={{
                            "--Switch-trackBackground": formik.values.is_consumable ? "#ffbc62" : undefined,
                            "--Switch-thumbBackground": formik.values.is_consumable ? "#fff" : undefined,
                          } as React.CSSProperties}
                        />
                        <Tooltip
                          title="Los materiales fungibles son aquellos que se consumen con el uso (ej: baterías, papel)"
                          arrow
                        >
                          <HelpOutline fontSize="small" sx={{ color: "text.tertiary", ml: 0.5 }} />
                        </Tooltip>
                      </FormControl>
                    </Box>
                  </Box>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Describe el material, sus características, estado, etc. (opcional)"
                      minRows={3}
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                        width: "100%",
                      }}
                    />
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" justifyContent="space-between" gap={2} sx={{ mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                color="neutral"
                onClick={handleCancel}
                startDecorator={<ArrowBackIos fontSize="small" />}
              >
                Volver
              </Button>
              <Button
                type="submit"
                startDecorator={<Save />}
                loading={saving}
                loadingPosition="start"
                disabled={!formik.isValid || !isFormDirty}
                sx={{
                  bgcolor: "#ffbc62",
                  color: "black",
                  "&:hover": {
                    bgcolor: "rgba(255, 188, 98, 0.8)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(255, 188, 98, 0.4)",
                    color: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                {saving ? "Guardando..." : "Actualizar Material"}
              </Button>
            </Stack>
          </form>
        </Box>
      </ColumnLayout>
    </>
  )
}
