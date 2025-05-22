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
} from "@mui/joy"
import { Save, ArrowBackIos, InfoOutlined, HelpOutline } from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import { useState } from "react"
import React from "react"

export default function CreateMaterialPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isFormDirty, setIsFormDirty] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    description: Yup.string().nullable(),
    category: Yup.string().nullable(),
    quantity: Yup.number().min(1, "Debe ser al menos 1").required("La cantidad es obligatoria"),
    is_consumable: Yup.boolean(),
    location: Yup.string().nullable(),
    serial_number: Yup.string().nullable(),
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
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!session?.accessToken) {
        showNotification("Debes iniciar sesión para realizar esta acción", "error")
        return
      }

      setSaving(true)
      setError(null)

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials`, values, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        setSuccessMessage("Material creado correctamente")
        showNotification("Material creado correctamente", "success")

        // Pequeña pausa para mostrar el mensaje de éxito antes de redirigir
        setTimeout(() => {
          router.push("/material")
        }, 1500)
      } catch (err) {
        console.error(err)
        setError("No se pudo crear el material. Por favor, verifica los datos e intenta nuevamente.")
        showNotification("No se pudo crear el material", "error")
      } finally {
        setSaving(false)
      }
    },
  })

  // Detectar cambios en el formulario
  React.useEffect(() => {
    if (
      formik.values.name !== "" ||
      formik.values.description !== "" ||
      formik.values.category !== "" ||
      formik.values.quantity !== 1 ||
      formik.values.is_consumable !== false ||
      formik.values.location !== "" ||
      formik.values.serial_number !== ""
    ) {
      setIsFormDirty(true)
    } else {
      setIsFormDirty(false)
    }
  }, [formik.values])

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
                      Crear Nuevo Material
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      Completa los datos para crear un nuevo material en el inventario
                    </Typography>
                  </Box>
                </Stack>

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
                {saving ? "Guardando..." : "Crear Material"}
              </Button>
            </Stack>
          </form>
        </Box>
      </ColumnLayout>
    </>
  )
}
