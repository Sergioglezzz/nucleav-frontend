"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Sheet,
  LinearProgress,
  Skeleton,
  Divider,
  Chip,
  Alert,
  Menu,
  MenuItem,
  Dropdown,
  MenuButton,
  Modal,
} from "@mui/joy"
import {
  Edit,
  Upload,
  Description,
  Videocam,
  CheckCircle,
  Cancel,
  Save,
  Person,
  Work,
  Mail,
  Badge,
} from "@mui/icons-material"
import Navbar from "@/components/Navbar"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface User {
  id: number
  name: string
  lastname: string
  username: string
  email: string
  profession: string | null
  role: string
  profile_image_url: string | null
  bio: string | null
}

export default function ProfileEditPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mode } = useColorScheme()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()

  // Estados para los datos del usuario
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [originalData, setOriginalData] = useState<Partial<User>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  // Estado para el contador de caracteres de la bio
  const [bioCharCount, setBioCharCount] = useState(0)
  const MAX_BIO_LENGTH = 500

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) {
        if (status !== "loading") {
          setLoading(false)
          setError("No se ha encontrado información de sesión")
        }
        return
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${session.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const userData = res.data
        setUser(userData)

        // Guardar los datos originales para comparar cambios después
        const initialData = {
          name: userData.name || "",
          lastname: userData.lastname || "",
          username: userData.username || "",
          email: userData.email || "",
          profession: userData.profession || "",
          role: userData.role || "",
          bio: userData.bio || "",
        }

        setOriginalData(initialData)
        setFormData(initialData)

        // Actualizar contador de caracteres de la bio
        setBioCharCount(userData.bio ? MAX_BIO_LENGTH - userData.bio.length : MAX_BIO_LENGTH)

        setError(null)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Error al cargar los datos del usuario")
        } else {
          setError("Error inesperado")
        }
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchUser()
    }
  }, [session, status])

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Actualizar contador de caracteres si es el campo bio
    if (name === "bio") {
      setBioCharCount(MAX_BIO_LENGTH - value.length)
    }
  }

  // Identificar qué campos han cambiado
  const getChangedFields = () => {
    const changedFields: Partial<Record<keyof User, string | null>> = {}

    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof User
      if (formData[typedKey] !== originalData[typedKey]) {
        changedFields[typedKey] = typeof formData[typedKey] === "number" ? String(formData[typedKey]) : formData[typedKey]
      }
    })

    return changedFields
  }

  // Guardar cambios usando PATCH
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      setError("No se ha encontrado información de sesión")
      return
    }

    // Obtener solo los campos que han cambiado
    const changedFields = getChangedFields()

    // Si no hay cambios, mostrar mensaje y no hacer nada
    if (Object.keys(changedFields).length === 0) {
      setSuccessMessage("No se han detectado cambios")
      setTimeout(() => setSuccessMessage(null), 3000)
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {

      // Usar PATCH en lugar de PUT para actualizar solo los campos modificados
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/users/${session.user.id}`,
        changedFields,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      )

      console.log("Respuesta del servidor:", response.data)
      setSuccessMessage("Perfil actualizado correctamente")

      // Redirigir después de un breve retraso
      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Error al actualizar el perfil")
      } else {
        setError("Error inesperado al guardar los cambios")
      }
    } finally {
      setSaving(false)
    }
  }

  // Cancelar edición
  const handleCancel = () => {
    router.push("/profile")
  }

  const userInitial = user?.name?.[0]?.toUpperCase() || "?"

  // Datos de portfolio (simulados)
  const portfolioItems = [
    {
      id: 1,
      type: "image",
      title: "Diseño de dashboard",
      src: "https://picsum.photos/seed/picsum1/600/400",
      progress: 100,
    },
    {
      id: 2,
      type: "video",
      title: "Prototipo animado",
      src: "https://picsum.photos/seed/picsum2/600/400",
      progress: 40,
    },
  ]

  return (
    <>
      <Navbar />
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

          <form onSubmit={handleSubmit}>
            {/* Sección de información personal */}
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
                    <ArrowBackIosIcon fontSize="small" sx={{ marginRight: -1 }} />
                  </IconButton>

                  {/* Texto */}
                  <Box>
                    <Typography level="title-lg" sx={{ color: "#ffbc62", mb: 0.5 }}>
                      Información personal
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      Personaliza cómo aparecerá tu información de perfil.
                    </Typography>
                  </Box>
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
                      <MoreVertIcon />
                    </MenuButton>
                    <Menu placement="bottom-end" sx={{
                      minWidth: 220,
                      bgcolor: 'background.body',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 'md',
                      boxShadow: 'md',
                      p: 1,
                      zIndex: 999,
                    }}>
                      <MenuItem onClick={() => setOpenChangePasswordModal(true)}>
                        Cambiar contraseña
                      </MenuItem>
                      <MenuItem color="danger" onClick={() => setOpenDeleteModal(true)}>
                        Eliminar cuenta
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
                    {loading ? (
                      <Skeleton
                        variant="circular"
                        animation="wave"
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: { xs: 80, sm: 100 },
                        }}
                      />
                    ) : (
                      <Avatar
                        alt={user?.username || "Usuario"}
                        variant="solid"
                        src={user?.profile_image_url || undefined}
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: { xs: 80, sm: 100 },
                          fontSize: "xl2",
                          bgcolor: "neutral.softBg",
                          color: "text.primary",
                        }}
                      >
                        {userInitial}
                      </Avatar>
                    )}
                    <IconButton
                      size="sm"
                      variant="solid"
                      color="neutral"
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
                    </IconButton>
                  </Box>

                  {/* Campos de nombre y username */}
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Person sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                          <Typography level="body-sm">Nombre</Typography>
                        </Box>
                        {loading ? (
                          <Skeleton variant="rectangular" animation="wave" sx={{ height: 40, borderRadius: "md" }} />
                        ) : (
                          <Input
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            placeholder="Nombre"
                            sx={{ width: "100%" }}
                          />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-sm" sx={{ mb: 1, ml: 1 }}>
                          Apellido
                        </Typography>
                        {loading ? (
                          <Skeleton variant="rectangular" animation="wave" sx={{ height: 40, borderRadius: "md" }} />
                        ) : (
                          <Input
                            name="lastname"
                            value={formData.lastname || ""}
                            onChange={handleInputChange}
                            placeholder="Apellido"
                            sx={{ width: "100%" }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Badge sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                          <Typography level="body-sm">Nombre de usuario</Typography>
                        </Box>
                        {loading ? (
                          <Skeleton variant="rectangular" animation="wave" sx={{ height: 40, borderRadius: "md" }} />
                        ) : (
                          <Input
                            name="username"
                            value={formData.username || ""}
                            onChange={handleInputChange}
                            placeholder="Nombre de usuario"
                            startDecorator="@"
                            sx={{ width: "100%" }}
                          />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Mail sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                          <Typography level="body-sm">Email</Typography>
                        </Box>
                        {loading ? (
                          <Skeleton variant="rectangular" animation="wave" sx={{ height: 40, borderRadius: "md" }} />
                        ) : (
                          <Input
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            placeholder="Email"
                            type="email"
                            sx={{ width: "100%" }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Profesión y rol */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Work sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                        <Typography level="body-sm">Profesión</Typography>
                      </Box>
                      {loading ? (
                        <Skeleton variant="rectangular" animation="wave" sx={{ height: 40, borderRadius: "md" }} />
                      ) : (
                        <Input
                          name="profession"
                          value={formData.profession || ""}
                          onChange={handleInputChange}
                          placeholder="Profesión"
                          sx={{ width: "100%" }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="body-sm" sx={{ mb: 1 }}>
                        Rol
                      </Typography>
                      {loading ? (
                        <Skeleton variant="rectangular" animation="wave" sx={{ height: 40, borderRadius: "md" }} />
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Input
                            name="role"
                            value={formData.role || ""}
                            onChange={handleInputChange}
                            placeholder="Rol"
                            disabled={true}
                            sx={{ width: "100%" }}
                          />
                          <Chip color="primary" size="sm" variant="outlined">
                            {formData.role || "Rol"}
                          </Chip>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Biografía */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Description sx={{ color: "#ffbc62", fontSize: 18, mr: 1 }} />
                    <Typography level="body-sm">Biografía</Typography>
                  </Box>
                  {loading ? (
                    <>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ height: 100, borderRadius: "md", mb: 1 }}
                      />
                      <Skeleton variant="text" animation="wave" sx={{ width: 100, height: 20 }} />
                    </>
                  ) : (
                    <>
                      <Textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                        placeholder="Escribe una breve descripción sobre ti"
                        minRows={3}
                        maxRows={6}
                        sx={{ width: "100%" }}
                      />
                      <Typography level="body-xs" sx={{ mt: 1, color: "text.tertiary" }}>
                        {bioCharCount} caracteres restantes
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Sección de Portfolio (mockup) */}
            <Card variant="outlined" sx={{ mb: 3, mx: { xs: -3.5, sm: 0 }, overflow: "visible" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack sx={{ mb: 1, mt: -1 }}>
                  <Typography level="title-lg" sx={{ color: "#ffbc62", mb: 0.5 }}>
                    Portfolio
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.tertiary", mb: 3 }}>
                    Comparte ejemplos de tu trabajo.
                  </Typography>
                </Stack>

                <Sheet
                  variant="outlined"
                  sx={{
                    borderRadius: "md",
                    p: 4,
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderStyle: "dashed",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 188, 98, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <Upload sx={{ color: "#ffbc62" }} />
                  </Box>
                  <Typography level="body-sm" sx={{ color: "#ffbc62", mb: 0.5 }}>
                    Haz clic para subir o arrastra y suelta
                  </Typography>
                  <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                    SVG, PNG, JPG o GIF (máx. 800×400px)
                  </Typography>
                </Sheet>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {/* Elementos del portfolio */}
                  {portfolioItems.map((item) => (
                    <Sheet
                      key={item.id}
                      variant="outlined"
                      sx={{
                        borderRadius: "md",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {item.type === "video" ? (
                        <Videocam sx={{ color: "text.tertiary" }} />
                      ) : (
                        <Description sx={{ color: "text.tertiary" }} />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-sm">{item.title}</Typography>
                        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                          {item.type === "video" ? "16 MB" : "200 kB"}
                        </Typography>
                        <LinearProgress
                          determinate
                          value={item.progress}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            [`& .MuiLinearProgress-bar`]: {
                              bgcolor: "#ffbc62",
                            },
                          }}
                        />
                      </Box>
                      <Typography level="body-sm" sx={{ color: item.progress === 100 ? "success.500" : "#ffbc62" }}>
                        {item.progress}%
                      </Typography>
                      {item.progress === 100 ? (
                        <CheckCircle sx={{ color: "success.500" }} />
                      ) : (
                        <Cancel sx={{ color: "danger.500" }} />
                      )}
                    </Sheet>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mb: 4,
              mx: { xs: -3.5, sm: 0 }, // <- igual que el Card

            }}>
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
      </ColumnLayout>
      <Modal open={openChangePasswordModal} onClose={() => setOpenChangePasswordModal(false)}>
        <Sheet
          sx={{
            maxWidth: 400,
            mx: "auto",
            my: "20vh",
            p: 3,
            borderRadius: "md",
            boxShadow: "lg",
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            Cambiar contraseña
          </Typography>
          <Stack gap={2}>
            <Input type="password" placeholder="Contraseña actual" />
            <Input type="password" placeholder="Nueva contraseña" />
            <Input type="password" placeholder="Repetir nueva contraseña" />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" gap={1} mt={3}>
            <Button variant="plain" onClick={() => setOpenChangePasswordModal(false)}>Cancelar</Button>
            <Button variant="solid" color="primary">Guardar</Button>
          </Stack>
        </Sheet>
      </Modal>
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Sheet
          sx={{
            maxWidth: 400,
            mx: "auto",
            my: "30vh",
            p: 3,
            borderRadius: "md",
            boxShadow: "lg",
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            ¿Eliminar cuenta?
          </Typography>
          <Typography level="body-sm" sx={{ mb: 3 }}>
            Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar tu cuenta?
          </Typography>
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button variant="plain" onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
            <Button variant="solid" color="danger">Eliminar</Button>
          </Stack>
        </Sheet>
      </Modal>

    </>
  )

}
