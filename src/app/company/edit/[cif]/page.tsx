"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Input,
  Avatar,
  IconButton,
  Textarea,
  Stack,
  Divider,
  Alert,
  FormHelperText,
  Dropdown,
  Menu,
  MenuItem,
  MenuButton,
} from "@mui/joy"
import {
  Business,
  LocationOn,
  Phone,
  Email,
  Language,
  Badge,
  Cancel,
  Save,
  Edit,
  ArrowBackIos,
  Description,
  Delete,
  MoreVert,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Company } from "@/components/company/CompanyProfile"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import DeleteCompanyModal from "../../DeleteCompanyModal"

// Esquema de validación
const validationSchema = Yup.object({
  cif: Yup.string()
    .required("El CIF es obligatorio")
    .matches(/^[A-Z0-9]{9}$/, "El CIF debe tener 9 caracteres alfanuméricos"),
  name: Yup.string().required("El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  description: Yup.string().nullable(),
  address: Yup.string().nullable(),
  phone: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^\+?[0-9]{8,15}$/, "Formato de teléfono inválido"),
  email: Yup.string().required("El email es obligatorio").email("Formato de email inválido"),
  website: Yup.string()
    .nullable()
    .matches(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/, "Formato de URL inválido"),
})

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const cif = params.cif as string
  const { data: session } = useSession()
  const { showNotification } = useNotification()

  const [company, setCompany] = useState<Company | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Cargar datos de la empresa
  useEffect(() => {
    const fetchCompany = async () => {
      if (!session?.accessToken) {
        setLoading(false)
        setError("No se ha encontrado información de sesión")
        return
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${cif}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const companyData = response.data
        setCompany(companyData)
        setLogoPreview(companyData.logo_url)

        formik.setValues({
          cif: companyData.cif || "",
          name: companyData.name || "",
          description: companyData.description || "",
          address: companyData.address || "",
          phone: companyData.phone || "",
          email: companyData.email || "",
          website: companyData.website || "",
          logo_url: companyData.logo_url || null,
        })

        setError(null)
      } catch (error) {
        console.error("Error al cargar la empresa:", error)
        setError("No se pudo cargar la información de la empresa")
      } finally {
        setLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchCompany()
    }
  }, [cif, session])

  // Inicializar formik
  const formik = useFormik({
    initialValues: {
      cif: "",
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo_url: null,
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
        const companyData = {
          ...values,
          description: values.description || null,
          address: values.address || null,
          website: values.website || null,
          logo_url: logoPreview,
        }

        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${cif}`, companyData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        setSuccessMessage("Empresa actualizada correctamente")
        showNotification("Empresa actualizada correctamente", "success")

        // Redirigir después de un breve retraso
        setTimeout(() => {
          router.push("/company")
        }, 1500)
      } catch (error) {
        console.error("Error al actualizar empresa:", error)
        setError("No se pudo actualizar la empresa")
        showNotification("No se pudo actualizar la empresa", "error")
      } finally {
        setSaving(false)
      }
    },
    enableReinitialize: true,
  })

  // Manejar cambio de logo
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Eliminar logo
  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  // Eliminar empresa
  const handleDeleteCompany = async () => {
    if (!session?.accessToken) {
      showNotification("Debes iniciar sesión para realizar esta acción", "error")
      return
    }

    setDeleting(true)

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${cif}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      showNotification("Empresa eliminada correctamente", "success")

      // Redirigir después de un breve retraso
      setTimeout(() => {
        router.push("/company")
      }, 1000)
    } catch (error) {
      console.error("Error al eliminar la empresa:", error)
      showNotification("No se pudo eliminar la empresa", "error")
      setDeleting(false)
      setOpenDeleteModal(false)
    }
  }

  // Cancelar edición
  const handleCancel = () => {
    router.push("/company")
  }

  if (loading) {
    return (
      <ColumnLayout>
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
          <Card variant="outlined" sx={{ mb: 3, mx: { xs: -3.5, sm: 0 } }}>
            <CardContent sx={{ p: 3 }}>
              <Typography level="body-sm">Cargando información de la empresa...</Typography>
            </CardContent>
          </Card>
        </Box>
      </ColumnLayout>
    )
  }

  return (
    <ColumnLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
        {/* Mensajes de error o éxito */}
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

        <form onSubmit={formik.handleSubmit}>
          {/* Sección de información de la empresa */}
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              mx: { xs: -3.5, sm: 0 },
              overflow: "visible",
              position: "relative",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 4, mt: -1 }}>
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
                  <Typography level="title-lg" sx={{ color: "#ffbc62", mb: 0.5 }}>
                    Editar Empresa
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                    Actualiza la información de tu empresa
                  </Typography>
                </Box>

                {/* Menú de opciones */}
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{
                      root: {
                        variant: "plain",
                        color: "neutral",
                        size: "sm",
                        sx: { position: "absolute", top: 8, right: 8 },
                      },
                    }}
                  >
                    <MoreVert />
                  </MenuButton>
                  <Menu
                    placement="bottom-end"
                    sx={{
                      minWidth: 220,
                      bgcolor: "background.body",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "md",
                      boxShadow: "md",
                      p: 1,
                      zIndex: 999,
                    }}
                  >
                    <MenuItem color="danger" onClick={() => setOpenDeleteModal(true)}>
                      <Delete sx={{ mr: 1 }} fontSize="small" />
                      Eliminar empresa
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mb: 3,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                {/* Avatar y botón de edición */}
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={logoPreview || undefined}
                    alt="Logo de la empresa"
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      boxShadow: "sm",
                      border: "2px solid",
                      borderColor: "background.surface",
                    }}
                  >
                    {formik.values.name?.charAt(0) || <Business />}
                  </Avatar>
                  {logoPreview && (
                    <IconButton
                      variant="solid"
                      color="danger"
                      size="sm"
                      onClick={handleRemoveLogo}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        borderRadius: "50%",
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                  <IconButton
                    size="sm"
                    variant="solid"
                    color="neutral"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      borderRadius: "50%",
                      bgcolor: "#ffbc62",
                      color: "white",
                    }}
                  >
                    <Edit fontSize="small" />
                    <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                  </IconButton>
                </Box>

                {/* Campos principales */}
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Badge sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                        <Typography level="body-sm">CIF *</Typography>
                      </Box>
                      <Input
                        name="cif"
                        value={formik.values.cif}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="B12345678"
                        disabled={true}
                        error={formik.touched.cif && Boolean(formik.errors.cif)}
                        sx={{ width: "100%" }}
                      />
                      {formik.touched.cif && formik.errors.cif && <FormHelperText>{formik.errors.cif}</FormHelperText>}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Business sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                        <Typography level="body-sm">Nombre de la empresa *</Typography>
                      </Box>
                      <Input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Nombre de la empresa"
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        sx={{ width: "100%" }}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <FormHelperText>{formik.errors.name}</FormHelperText>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Información de contacto */}
              <Box sx={{ mb: 3 }}>
                <Typography level="title-md" sx={{ color: "#ffbc62", mb: 2 }}>
                  Información de contacto
                </Typography>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Phone sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                      <Typography level="body-sm">Teléfono *</Typography>
                    </Box>
                    <Input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="+34 912 345 678"
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      sx={{ width: "100%" }}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <FormHelperText>{formik.errors.phone}</FormHelperText>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Email sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                      <Typography level="body-sm">Email *</Typography>
                    </Box>
                    <Input
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="info@empresa.com"
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      sx={{ width: "100%" }}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormHelperText>{formik.errors.email}</FormHelperText>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                      <Typography level="body-sm">Dirección</Typography>
                    </Box>
                    <Input
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Dirección de la empresa"
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      sx={{ width: "100%" }}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <FormHelperText>{formik.errors.address}</FormHelperText>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Language sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                      <Typography level="body-sm">Sitio web</Typography>
                    </Box>
                    <Input
                      name="website"
                      value={formik.values.website}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="https://www.empresa.com"
                      error={formik.touched.website && Boolean(formik.errors.website)}
                      sx={{ width: "100%" }}
                    />
                    {formik.touched.website && formik.errors.website && (
                      <FormHelperText>{formik.errors.website}</FormHelperText>
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Descripción */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Description sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                  <Typography level="body-sm">Descripción</Typography>
                </Box>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe tu empresa"
                  minRows={3}
                  maxRows={5}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  sx={{ width: "100%" }}
                />
                {formik.touched.description && formik.errors.description && (
                  <FormHelperText>{formik.errors.description}</FormHelperText>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mb: 4,
              mx: { xs: -3.5, sm: 0 },
            }}
          >
            <Button variant="plain" color="neutral" onClick={handleCancel} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              startDecorator={<Save />}
              loading={saving}
              loadingPosition="start"
              sx={{
                bgcolor: "#ffbc62",
                "&:hover": {
                  bgcolor: "rgba(255, 188, 98, 0.8)",
                },
              }}
            >
              Guardar cambios
            </Button>
          </Box>
        </form>
      </Box>

      {/* Modal de confirmación para eliminar */}
      <DeleteCompanyModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteCompany}
        loading={deleting}
        companyName={formik.values.name}
      />
    </ColumnLayout>
  )
}
