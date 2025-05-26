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
  CircularProgress,
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
import { useRouter, useParams } from "next/navigation"
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
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [project, setProject] = useState<Project | null>(null)

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

      setSaving(true)
      setError(null)

      try {
        const projectData = {
          name: values.name,
          description: values.description || null,
          type: values.type,
          company_cif: values.company_cif,
          start_date: values.start_date || null,
          end_date: values.end_date || null,
          status: values.status,
          is_collaborative: values.is_collaborative,
        }

        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${projectId}`, projectData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        })

        setSuccessMessage("Proyecto actualizado correctamente")
        showNotification("Proyecto actualizado correctamente", "success")

        // Pequeña pausa para mostrar el mensaje de éxito antes de redirigir
        setTimeout(() => {
          router.push("/project")
        }, 1500)
      } catch (err: unknown) {
        console.error("Error al actualizar proyecto:", err)

        let errorMessage = "No se pudo actualizar el proyecto. Por favor, verifica los datos e intenta nuevamente."

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object" &&
          (err as { response?: unknown }).response !== null
        ) {
          const response = (err as { response: { data?: { message?: string | string[] }, status?: number } }).response
          if (response.data?.message) {
            // Si el backend devuelve un array de mensajes de validación
            if (Array.isArray(response.data.message)) {
              errorMessage = response.data.message.join(", ")
            } else {
              errorMessage = response.data.message
            }
          } else if (response.status === 401) {
            errorMessage = "No tienes permisos para realizar esta acción"
          } else if (response.status === 404) {
            errorMessage = "El proyecto no existe"
          } else if (response.status === 400) {
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

  // Cargar datos del proyecto y empresas
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) return

      setLoading(true)
      try {
        // Cargar proyecto y empresas en paralelo
        const [projectResponse, companiesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${projectId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }),
        ])

        const projectData = projectResponse.data.data || projectResponse.data
        const companiesData = companiesResponse.data.data || companiesResponse.data

        setProject(projectData)
        setCompanies(companiesData)

        // Formatear fechas para los inputs de tipo date
        const formatDateForInput = (dateString?: string) => {
          if (!dateString) return ""
          const date = new Date(dateString)
          return date.toISOString().split("T")[0]
        }

        // Establecer valores iniciales del formulario
        formik.setValues({
          name: projectData.name || "",
          description: projectData.description || "",
          type: projectData.type || ProjectType.OTHER,
          company_cif: projectData.company_cif || "",
          start_date: formatDateForInput(projectData.start_date),
          end_date: formatDateForInput(projectData.end_date),
          status: projectData.status || "draft",
          is_collaborative: projectData.is_collaborative || false,
        })
      } catch (error: unknown) {
        console.error("Error al cargar datos:", error)

        let errorMessage = "Error al cargar el proyecto"
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: unknown }).response === "object" &&
          (error as { response?: unknown }).response !== null
        ) {
          const response = (error as { response: { status?: number } }).response
          if (response.status === 401) {
            errorMessage = "No tienes permisos para ver este proyecto"
          } else if (response.status === 404) {
            errorMessage = "El proyecto no existe"
          }
        }

        setError(errorMessage)
        showNotification(errorMessage, "error")
      } finally {
        setLoading(false)
        setLoadingCompanies(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, projectId])

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
    if (!project) return

    const hasChanges =
      formik.values.name !== (project.name || "") ||
      formik.values.description !== (project.description || "") ||
      formik.values.type !== (project.type || ProjectType.OTHER) ||
      formik.values.company_cif !== (project.company_cif || "") ||
      formik.values.start_date !==
      (project.start_date ? new Date(project.start_date).toISOString().split("T")[0] : "") ||
      formik.values.end_date !== (project.end_date ? new Date(project.end_date).toISOString().split("T")[0] : "") ||
      formik.values.status !== (project.status || "draft") ||
      formik.values.is_collaborative !== (project.is_collaborative || false)

    setIsFormDirty(hasChanges)
  }, [formik.values, project])

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

  // Mostrar loading mientras carga
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

  // Mostrar error si no se pudo cargar el proyecto
  if (error && !project) {
    return (
      <ColumnLayout>
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
          <Alert variant="soft" color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={() => router.push("/project")} startDecorator={<ArrowBackIos />}>
            Volver a proyectos
          </Button>
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
                      Editar Proyecto
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      Modifica los datos del proyecto {project?.name}
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
                        // loading={loadingCompanies}
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
                      >
                        {companies.map((company) => (
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
                      <FormLabel>Estado *</FormLabel>
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
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </Stack>
          </form>
        </Box>
      </ColumnLayout>
    </>
  )
}
