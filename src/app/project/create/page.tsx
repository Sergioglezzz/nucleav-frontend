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
  Select,
  Option,
} from "@mui/joy"
import {
  Save,
  ArrowBackIos,
  HelpOutline,
  Movie,
  Tv,
  Campaign,
  Work,
  Business,
  CalendarToday,
  Description,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import { useState, useEffect } from "react"
import React from "react"

// Enumeración para tipos de proyecto
enum ProjectType {
  FILM = "film",
  TV = "tv",
  ADVERTISING = "advertising",
  OTHER = "other",
}

// Interfaz para empresas
interface Company {
  cif: string
  name: string
  logo_url?: string | null
}

export default function CreateProjectPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    description: Yup.string().nullable(),
    type: Yup.string().required("El tipo de proyecto es obligatorio"),
    company_cif: Yup.string().required("La empresa es obligatoria"),
    start_date: Yup.string().nullable(),
    end_date: Yup.string().nullable(),
    status: Yup.string().required("El estado es obligatorio"),
    is_collaborative: Yup.boolean(),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      type: ProjectType.OTHER,
      company_cif: "",
      start_date: "",
      end_date: "",
      status: "draft",
      is_collaborative: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!session?.accessToken) {
        showNotification("Debes iniciar sesión para realizar esta acción", "error")
        return
      }

      if (!session.user?.id) {
        showNotification("No se pudo obtener la información del usuario", "error")
        return
      }

      setSaving(true)
      setError(null)

      try {
        const projectData = {
          name: values.name,
          description: values.description || null,
          type: values.type,
          company_cif: values.company_cif,
          created_by: Number(session.user?.id), // Agregar el created_by del usuario autenticado
          start_date: values.start_date || null,
          end_date: values.end_date || null,
          status: values.status,
          is_collaborative: values.is_collaborative,
        }

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects`, projectData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        })

        setSuccessMessage("Proyecto creado correctamente")
        showNotification("Proyecto creado correctamente", "success")

        // Pequeña pausa para mostrar el mensaje de éxito antes de redirigir
        setTimeout(() => {
          router.push("/project")
        }, 1500)
      } catch (err: unknown) {
        console.error("Error al crear proyecto:", err)

        let errorMessage = "No se pudo crear el proyecto. Por favor, verifica los datos e intenta nuevamente."

        if (typeof err === "object" && err !== null && "response" in err) {
          const response = (err as { response?: { data?: any; status?: number } }).response

          if (response?.data?.message) {
            if (Array.isArray(response.data.message)) {
              errorMessage = response.data.message.join(", ")
            } else {
              errorMessage = response.data.message
            }
          } else if (response?.status === 401) {
            errorMessage = "No tienes permisos para realizar esta acción"
          } else if (response?.status === 400) {
            errorMessage = "Los datos proporcionados no son válidos"
          }
        }

        setError(errorMessage)
        showNotification(errorMessage, "error")
      } finally {
        setSaving(false)
      }
    },
  })

  // Cargar empresas desde la API
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!session?.accessToken) return

      setLoadingCompanies(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const companiesData = response.data.data || response.data
        setCompanies(companiesData)

        // Establecer la primera empresa como predeterminada
        if (companiesData.length > 0) {
          formik.setFieldValue("company_cif", companiesData[0].cif)
        }
      } catch (error: unknown) {
        console.error("Error al cargar empresas:", error)

        let errorMessage = "Error al cargar las empresas"

        if (typeof error === "object" && error !== null && "response" in error) {
          const response = (error as { response?: { status?: number } }).response

          if (response?.status === 401) {
            errorMessage = "No tienes permisos para ver las empresas"
          }
        }

        setError(errorMessage)
        showNotification(errorMessage, "error")
      } finally {
        setLoadingCompanies(false)
      }
    }

    fetchCompanies()
  }, [session?.accessToken])

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

  // Detectar cambios en el formulario
  React.useEffect(() => {
    if (
      formik.values.name !== "" ||
      formik.values.description !== "" ||
      formik.values.type !== ProjectType.OTHER ||
      formik.values.company_cif !== (companies[0]?.cif || "") ||
      formik.values.start_date !== "" ||
      formik.values.end_date !== "" ||
      formik.values.status !== "draft" ||
      formik.values.is_collaborative !== false
    ) {
      setIsFormDirty(true)
    } else {
      setIsFormDirty(false)
    }
  }, [formik, companies])
  

  // Confirmar antes de cancelar si hay cambios
  const handleCancel = () => {
    if (isFormDirty) {
      if (window.confirm("¿Estás seguro que deseas cancelar? Los cambios no guardados se perderán.")) {
        router.push("/project")
      }
    } else {
      router.push("/project")
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
                      Crear Nuevo Proyecto
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      Completa los datos para crear un nuevo proyecto audiovisual
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
                  <FormControl error={formik.touched.name && Boolean(formik.errors.name)}>
                    <FormLabel>Nombre del proyecto *</FormLabel>
                    <Input
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ej: Documental sobre cambio climático"
                      startDecorator={<Description sx={{ color: "text.tertiary" }} />}
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
                    <FormHelperText>
                      {formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : "Introduce un nombre descriptivo para tu proyecto"}
                    </FormHelperText>
                  </FormControl>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <FormControl error={formik.touched.type && Boolean(formik.errors.type)}>
                      <FormLabel>Tipo de proyecto *</FormLabel>
                      <Select
                        name="type"
                        value={formik.values.type}
                        onChange={(_, value) => formik.setFieldValue("type", value)}
                        startDecorator={getProjectTypeIcon(formik.values.type as ProjectType)}
                        sx={{
                          "--Select-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                        }}
                      >
                        <Option value={ProjectType.FILM}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Movie />
                            Cine
                          </Box>
                        </Option>
                        <Option value={ProjectType.TV}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Tv />
                            TV
                          </Box>
                        </Option>
                        <Option value={ProjectType.ADVERTISING}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Campaign />
                            Publicidad
                          </Box>
                        </Option>
                        <Option value={ProjectType.OTHER}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Work />
                            Otro
                          </Box>
                        </Option>
                      </Select>
                      <FormHelperText>
                        {formik.touched.type && formik.errors.type
                          ? formik.errors.type
                          : "Selecciona el tipo que mejor describa tu proyecto"}
                      </FormHelperText>
                    </FormControl>

                    <FormControl error={formik.touched.company_cif && Boolean(formik.errors.company_cif)}>
                      <FormLabel>Empresa *</FormLabel>
                      <Select
                        name="company_cif"
                        value={formik.values.company_cif}
                        onChange={(_, value) => formik.setFieldValue("company_cif", value)}
                        startDecorator={<Business sx={{ color: "text.tertiary" }} />}
                        placeholder={loadingCompanies ? "Cargando empresas..." : "Selecciona una empresa"}
                        sx={{
                          "--Select-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                        }}
                        disabled={loadingCompanies}
                      >
                        {!loadingCompanies &&
                          companies.map((company) => (
                            <Option key={company.cif} value={company.cif}>
                              {company.name}
                            </Option>
                          ))}
                      </Select>
                      <FormHelperText>
                        {formik.touched.company_cif && formik.errors.company_cif
                          ? formik.errors.company_cif
                          : "Selecciona la empresa responsable del proyecto"}
                      </FormHelperText>
                    </FormControl>
                  </Box>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Describe brevemente de qué trata tu proyecto..."
                      minRows={3}
                      maxRows={6}
                      sx={{
                        "--Textarea-focusedThickness": "var(--joy-palette-primary-solidBg)",
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
                    <FormHelperText>Proporciona una descripción detallada del proyecto (opcional)</FormHelperText>
                  </FormControl>

                  <Divider sx={{ my: 1 }}>
                    <Chip size="sm" variant="soft" color="neutral">
                      Planificación y configuración
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
                      <FormLabel>Fecha de inicio</FormLabel>
                      <Input
                        type="date"
                        name="start_date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        startDecorator={<CalendarToday sx={{ color: "text.tertiary" }} />}
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
                      <FormHelperText>Fecha prevista de inicio del proyecto</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Fecha de finalización</FormLabel>
                      <Input
                        type="date"
                        name="end_date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        startDecorator={<CalendarToday sx={{ color: "text.tertiary" }} />}
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
                      <FormHelperText>Fecha prevista de finalización del proyecto</FormHelperText>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <FormControl error={formik.touched.status && Boolean(formik.errors.status)}>
                      <FormLabel>Estado inicial *</FormLabel>
                      <Select
                        name="status"
                        value={formik.values.status}
                        onChange={(_, value) => formik.setFieldValue("status", value)}
                        sx={{
                          "--Select-focusedThickness": "var(--joy-palette-primary-solidBg)",
                          "&:hover": {
                            borderColor: "primary.solidBg",
                          },
                          "&:focus-within": {
                            borderColor: "primary.solidBg",
                            boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                          },
                        }}
                      >
                        <Option value="draft">Borrador</Option>
                        <Option value="planning">Planificación</Option>
                        <Option value="in_progress">En progreso</Option>
                        <Option value="completed">Completado</Option>
                        <Option value="cancelled">Cancelado</Option>
                      </Select>
                      <FormHelperText>
                        {formik.touched.status && formik.errors.status
                          ? formik.errors.status
                          : "Estado actual del proyecto"}
                      </FormHelperText>
                    </FormControl>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FormControl sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                        <FormLabel sx={{ m: 0 }}>Proyecto colaborativo</FormLabel>
                        <Switch
                          checked={formik.values.is_collaborative}
                          onChange={(e) => formik.setFieldValue("is_collaborative", e.target.checked)}
                          style={
                            {
                              "--Switch-trackBackground": formik.values.is_collaborative ? "#ffbc62" : undefined,
                              "--Switch-thumbBackground": formik.values.is_collaborative ? "#fff" : undefined,
                            } as React.CSSProperties
                          }
                        />
                        <Tooltip title="Los proyectos colaborativos permiten que varios usuarios trabajen juntos" arrow>
                          <HelpOutline fontSize="small" sx={{ color: "text.tertiary", ml: 0.5 }} />
                        </Tooltip>
                      </FormControl>
                    </Box>
                  </Box>
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
                disabled={!formik.isValid || !isFormDirty || loadingCompanies}
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
                {saving ? "Creando..." : "Crear Proyecto"}
              </Button>
            </Stack>
          </form>
        </Box>
      </ColumnLayout>
    </>
  )
}
