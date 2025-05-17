"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  IconButton,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/joy"
import {
  Business,
  LocationOn,
  Phone,
  Email,
  Language,
  ArrowBack,
  Save,
  Upload,
  Badge,
  Cancel,
} from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import { useFormik } from "formik"
import * as Yup from "yup"

// Tipo para la empresa
interface Company {
  cif: string
  name: string
  description: string | null
  address: string | null
  phone: string
  email: string
  website: string | null
  logo_url: string | null
  created_by: number
  is_active: boolean
  created_at: string
  updated_at: string
}

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

export default function CompanyEditPage() {
  const router = useRouter()
  const { mode } = useColorScheme()
  const { data: session, status } = useSession()
  const { showNotification } = useNotification()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logoFile, setLogoFile] = useState<File | null>(null)

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
    },
    validationSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async (values) => {
      if (!session?.accessToken) {
        showNotification("Debes iniciar sesión para realizar esta acción", "error")
        return
      }

      setSaving(true)
      setError(null)

      try {
        // Aquí se haría la llamada a la API para guardar los datos
        // Por ahora, simulamos una respuesta exitosa
        await new Promise((resolve) => setTimeout(resolve, 1500))

        showNotification("Empresa actualizada correctamente", "success")

        // Redirigir a la página de perfil
        setTimeout(() => {
          router.push("/empresa")
        }, 1000)
      } catch (error) {
        console.error("Error al guardar la empresa:", error)
        setError("No se pudo guardar la información de la empresa")
      } finally {
        setSaving(false)
      }
    },
  })

  // Cargar datos de la empresa
  useEffect(() => {
    const fetchCompany = async () => {
      if (status !== "authenticated" || !session?.accessToken) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Aquí se haría la llamada a la API para obtener los datos de la empresa
        // Por ahora, usamos datos de ejemplo
        const mockCompany: Company = {
          cif: "B12345678",
          name: "NucleAV Productions",
          description:
            "Somos una productora audiovisual especializada en contenido corporativo, publicidad y documentales. Nuestro equipo de profesionales ofrece soluciones creativas y técnicas para todo tipo de proyectos audiovisuales.",
          address: "Calle Gran Vía 28, 28013 Madrid",
          phone: "+34 912 345 678",
          email: "info@nucleav.com",
          website: "https://www.nucleav.com",
          logo_url: "https://picsum.photos/seed/company/200/200",
          created_by: 1,
          is_active: true,
          created_at: "2023-01-15T10:30:00Z",
          updated_at: "2023-05-20T14:45:00Z",
        }

        // Simular una llamada a la API
        setTimeout(() => {
          formik.setValues({
            cif: mockCompany.cif,
            name: mockCompany.name,
            description: mockCompany.description || "",
            address: mockCompany.address || "",
            phone: mockCompany.phone,
            email: mockCompany.email,
            website: mockCompany.website || "",
          })
          setLogoPreview(mockCompany.logo_url)
          setLoading(false)
        }, 1000)

        // Cuando se conecte a la API real, sería algo así:
        /*
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies/my-company`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const company = response.data;
        formik.setValues({
          cif: company.cif,
          name: company.name,
          description: company.description || '',
          address: company.address || '',
          phone: company.phone,
          email: company.email,
          website: company.website || '',
        });
        setLogoPreview(company.logo_url);
        */
      } catch (error) {
        console.error("Error al cargar la empresa:", error)
        setError("No se pudo cargar la información de la empresa")
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

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

  return (
    <>
      <ColumnLayout>
        {error && (
          <Alert color="danger" variant="soft" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            variant="soft"
            color="neutral"
            onClick={() => router.back()}
            sx={{
              borderRadius: "50%",
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography level="h2">Editar Empresa</Typography>
        </Box>

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
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress
                  size="lg"
                  sx={{
                    "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
                    "--CircularProgress-progressColor": "#ffbc62",
                  }}
                />
              </Box>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  {/* Columna izquierda - Logo y CIF */}
                  <Grid xs={12} md={4}>
                    <Stack spacing={3} alignItems="center">
                      {/* Logo */}
                      <Box sx={{ textAlign: "center" }}>
                        <Typography level="title-md" sx={{ mb: 2 }}>
                          Logo de la empresa
                        </Typography>
                        <Box
                          sx={{
                            position: "relative",
                            width: 150,
                            height: 150,
                            mx: "auto",
                          }}
                        >
                          <Avatar
                            src={logoPreview || undefined}
                            alt="Logo de la empresa"
                            sx={{
                              width: 150,
                              height: 150,
                              mb: 2,
                              boxShadow: "md",
                              border: "4px solid",
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
                        </Box>
                        <Button
                          component="label"
                          variant="outlined"
                          color="neutral"
                          startDecorator={<Upload />}
                          sx={{ mt: 2 }}
                        >
                          Subir logo
                          <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                        </Button>
                        <Typography level="body-xs" sx={{ mt: 1, color: "text.tertiary" }}>
                          Formatos: JPG, PNG. Máx 2MB
                        </Typography>
                      </Box>

                      {/* CIF */}
                      <FormControl
                        error={formik.touched.cif && Boolean(formik.errors.cif)}
                        sx={{ width: "100%", mt: 2 }}
                      >
                        <FormLabel>CIF</FormLabel>
                        <Input
                          name="cif"
                          value={formik.values.cif}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="B12345678"
                          startDecorator={<Badge />}
                        />
                        {formik.touched.cif && formik.errors.cif && (
                          <FormHelperText>{formik.errors.cif}</FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>

                  {/* Columna derecha - Resto de campos */}
                  <Grid xs={12} md={8}>
                    <Stack spacing={3}>
                      {/* Nombre */}
                      <FormControl error={formik.touched.name && Boolean(formik.errors.name)} sx={{ width: "100%" }}>
                        <FormLabel>Nombre de la empresa</FormLabel>
                        <Input
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Nombre de la empresa"
                          startDecorator={<Business />}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <FormHelperText>{formik.errors.name}</FormHelperText>
                        )}
                      </FormControl>

                      {/* Descripción */}
                      <FormControl
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        sx={{ width: "100%" }}
                      >
                        <FormLabel>Descripción</FormLabel>
                        <Textarea
                          name="description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Describe tu empresa"
                          minRows={3}
                          maxRows={6}
                        />
                        {formik.touched.description && formik.errors.description && (
                          <FormHelperText>{formik.errors.description}</FormHelperText>
                        )}
                      </FormControl>

                      <Divider>Información de contacto</Divider>

                      {/* Dirección */}
                      <FormControl
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        sx={{ width: "100%" }}
                      >
                        <FormLabel>Dirección</FormLabel>
                        <Input
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Dirección de la empresa"
                          startDecorator={<LocationOn />}
                        />
                        {formik.touched.address && formik.errors.address && (
                          <FormHelperText>{formik.errors.address}</FormHelperText>
                        )}
                      </FormControl>

                      {/* Teléfono */}
                      <FormControl error={formik.touched.phone && Boolean(formik.errors.phone)} sx={{ width: "100%" }}>
                        <FormLabel>Teléfono</FormLabel>
                        <Input
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="+34 912 345 678"
                          startDecorator={<Phone />}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <FormHelperText>{formik.errors.phone}</FormHelperText>
                        )}
                      </FormControl>

                      {/* Email */}
                      <FormControl error={formik.touched.email && Boolean(formik.errors.email)} sx={{ width: "100%" }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="info@empresa.com"
                          startDecorator={<Email />}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <FormHelperText>{formik.errors.email}</FormHelperText>
                        )}
                      </FormControl>

                      {/* Sitio web */}
                      <FormControl
                        error={formik.touched.website && Boolean(formik.errors.website)}
                        sx={{ width: "100%" }}
                      >
                        <FormLabel>Sitio web</FormLabel>
                        <Input
                          name="website"
                          value={formik.values.website}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="https://www.empresa.com"
                          startDecorator={<Language />}
                        />
                        {formik.touched.website && formik.errors.website && (
                          <FormHelperText>{formik.errors.website}</FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>

                  {/* Botones de acción */}
                  <Grid xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                      <Button variant="outlined" color="neutral" onClick={() => router.back()} disabled={saving}>
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
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </ColumnLayout>
    </>
  )
}
