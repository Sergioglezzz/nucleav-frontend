/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
  Box,
  Typography,
  Sheet,
  Input,
  Select,
  Option,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Badge,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
} from "@mui/joy"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PersonAdd,
  AdminPanelSettings,
  Person,
  Email,
  CalendarToday,
  MoreVert,
  Refresh,
  Download,
} from "@mui/icons-material"
import PhoneIcon from '@mui/icons-material/Phone';
import { useColorScheme } from "@mui/joy/styles"
import ColumnLayout from "@/components/ColumnLayout"
import DeleteUserModal from "@/app/profile/edit/DeleteUserModal"
import axios from "axios"
import EditUserModal from "@/components/EditUserModal"

// Actualizar la interfaz User para que coincida con la estructura real de la API
interface User {
  id: number
  name: string
  lastname: string
  username: string
  email: string
  role: "admin" | "user"
  password?: string
  profession?: string | null
  phone?: string | null
  profile_image_url?: string | null
  bio?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ManageUsersPage() {
  const { data: session } = useSession()
  const { mode } = useColorScheme()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
    status: "active" as "active" | "inactive",
  })

  // Verificar que el usuario sea admin
  if (session?.user?.role !== "admin") {
    redirect("/dashboard")
  }

  // Cargar usuarios desde la API
  const fetchUsers = async (showLoading = true) => {
    if (!session?.accessToken) return

    if (showLoading) setLoading(true)
    setRefreshing(!showLoading)

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      const data = response.data.data || response.data
      const usersArray = Array.isArray(data) ? data : [data]

      // Normalizar datos de usuarios
      const normalizedUsers = usersArray.map((user: any) => ({
        ...user,
        status: user.is_active !== undefined ? (user.is_active ? "active" : "inactive") : user.status || "active",
        createdAt: user.created_at || user.createdAt,
        image: user.avatar_url || user.image,
      }))

      setUsers(normalizedUsers)
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken])

  // Filtrar usuarios
  // Actualizar la función filteredUsers para usar is_active en lugar de status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.is_active) ||
      (selectedStatus === "inactive" && !user.is_active)
    return matchesSearch && matchesRole && matchesStatus
  })

  // Estadísticas
  // Actualizar las estadísticas para usar is_active
  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.is_active ? "active" : "inactive",
    })
    setEditModalOpen(true)
  }

  const handleSaveUser = async () => {
    if (!session?.accessToken) return

    try {
      if (selectedUser) {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${selectedUser.id}`, formData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
        const updatedUser = response.data.data || response.data
        setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...updatedUser } : u)))
      }
      setEditModalOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error("Error al guardar usuario:", err)
    }
  }

  const handleDeleteUser = async () => {
    if (!session?.accessToken || !selectedUser?.id) return

    setLoadingDelete(true)

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      setUsers(users.filter((u) => u.id !== selectedUser.id))
    } catch (err) {
      console.error("Error al eliminar usuario:", err)
    } finally {
      setLoadingDelete(false)
      setOpenDeleteModal(false)
      setSelectedUser(null)
    }
  }

  const getRoleColor = (role: string): "primary" | "danger" | "warning" => {
    return role === "admin" ? "danger" : "primary"
  }

  // Actualizar la función getStatusColor para usar is_active
  const getStatusColor = (isActive: boolean): "success" | "neutral" | "warning" => {
    return isActive ? "success" : "neutral"
  }

  // Actualizar la función formatDate para usar created_at
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getUserInitials = (user: User) => {
    const firstName = user.name.charAt(0).toUpperCase()
    const lastName = user.lastname ? user.lastname.charAt(0).toUpperCase() : ""
    return firstName + lastName
  }

  if (loading) {
    return (
      <ColumnLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress
            size="lg"
            sx={{
              "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
              "--CircularProgress-progressColor": "#ffbc62",
            }}
          />
          <Typography level="body-md" color="neutral">
            Cargando usuarios...
          </Typography>
        </Box>
      </ColumnLayout>
    )
  }

  return (
    <ColumnLayout>
      <Box sx={{ p: { xs: 1, sm: 3 }, mt: -2 }}>
        {/* Header mejorado */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                level="h1"
                sx={{
                  color: "#ffbc62",
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Gestión de Usuarios
              </Typography>
              <Typography level="body-lg" color="neutral">
                Administra los usuarios y permisos del sistema
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Actualizar">
                <IconButton
                  variant="soft"
                  color="neutral"
                  onClick={() => fetchUsers(false)}
                  loading={refreshing}
                  size="sm"
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Exportar">
                <IconButton variant="soft" color="neutral" size="sm">
                  <Download />
                </IconButton>
              </Tooltip>
              <Button
                variant="solid"
                startDecorator={<PersonAdd />}
                size="sm"
                sx={{
                  bgcolor: "#ffbc62",
                  color: "white",
                  "&:hover": { bgcolor: "#ff9b44" },
                }}
              >
                <Box sx={{ display: { xs: "none", sm: "block" } }}>Nuevo Usuario</Box>
                <Box sx={{ display: { xs: "block", sm: "none" } }}>Nuevo</Box>
              </Button> */}
            </Stack>
          </Box>

          {/* Estadísticas visuales */}
          <Box sx={{ mb: 4 }}>
            <Typography level="title-lg" sx={{ mb: 3, color: "#ffbc62", fontWeight: 600 }}>
              Resumen de Usuarios
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: { xs: 2, sm: 3 },
                alignItems: "stretch",
              }}
            >
              {/* Gráfico principal */}
              <Card
                variant="outlined"
                sx={{
                  flex: { xs: "1", lg: "2" },
                  background:
                    mode === "dark"
                      ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                      : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid",
                  borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      gap: { xs: 2, sm: 3 },
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    {/* Gráfico de dona */}
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: "100%", sm: "auto" },
                        maxWidth: { xs: 180, sm: "none" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 100, sm: 120 },
                          height: { xs: 100, sm: 120 },
                          borderRadius: "50%",
                          background: `conic-gradient(
                            #ffbc62 0deg ${(stats.admins / stats.total) * 360}deg,
                            #22c55e ${(stats.admins / stats.total) * 360}deg ${((stats.admins + stats.active) / stats.total) * 360}deg,
                            #ef4444 ${((stats.admins + stats.active) / stats.total) * 360}deg ${((stats.admins + stats.active + (stats.total - stats.active)) / stats.total) * 360}deg,
                            #6b7280 ${((stats.admins + stats.active + (stats.total - stats.active)) / stats.total) * 360}deg 360deg
                          )`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          margin: { xs: "0 auto", sm: 0 },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 65, sm: 80 },
                            height: { xs: 65, sm: 80 },
                            borderRadius: "50%",
                            bgcolor: mode === "dark" ? "rgba(45,45,45,0.9)" : "rgba(255,255,255,0.9)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Typography
                            level="h2"
                            sx={{
                              color: "#ffbc62",
                              fontWeight: 700,
                              fontSize: { xs: "1.5rem", sm: "2rem" },
                            }}
                          >
                            {stats.total}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            Total
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Leyenda del gráfico */}
                    <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
                      <Grid container spacing={1}>
                        <Grid xs={12} sm={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                bgcolor: "#ffbc62",
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                Administradores
                              </Typography>
                              <Typography level="body-xs" color="neutral">
                                {stats.admins} usuarios ({((stats.admins / stats.total) * 100).toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid xs={6} sm={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: { xs: 1, sm: 2 } }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                bgcolor: "#22c55e",
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                Usuarios Activos
                              </Typography>
                              <Typography level="body-xs" color="neutral">
                                {stats.active} usuarios ({((stats.active / stats.total) * 100).toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid xs={6} sm={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: { xs: 1, sm: 2 } }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                bgcolor: "#6b7280",
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                Usuarios Inactivos
                              </Typography>
                              <Typography level="body-xs" color="neutral">
                                {stats.total - stats.active} usuarios (
                                {(((stats.total - stats.active) / stats.total) * 100).toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Métricas rápidas */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Indicador de usuarios regulares */}
                <Card
                  variant="outlined"
                  sx={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "lg" },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          bgcolor: "rgba(59, 130, 246, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Person sx={{ fontSize: 24, color: "#3b82f6" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="h3" sx={{ color: "#3b82f6", mb: 0.5 }}>
                          {stats.users}
                        </Typography>
                        <Typography level="body-sm" color="neutral">
                          Usuarios Regulares
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Indicador de tasa de actividad */}
                <Card
                  variant="outlined"
                  sx={{
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "lg" },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          bgcolor: "rgba(34, 197, 94, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: "3px solid rgba(34, 197, 94, 0.2)",
                            borderTopColor: "#22c55e",
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#22c55e",
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="h3" sx={{ color: "#22c55e", mb: 0.5 }}>
                          {((stats.active / stats.total) * 100).toFixed(0)}%
                        </Typography>
                        <Typography level="body-sm" color="neutral">
                          Tasa de Actividad
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Filtros mejorados */}
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "lg",
            background:
              mode === "dark"
                ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          <Stack spacing={2}>
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <FilterList sx={{ color: "#ffbc62" }} />
              <Typography level="title-sm" sx={{ color: "#ffbc62" }}>
                Filtros de búsqueda
              </Typography>
            </Box> */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" },
                gap: 2,
                alignItems: "end",
              }}
            >
              <Input
                placeholder="Buscar por nombre, email o username..."
                startDecorator={<SearchIcon />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: "100%",
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

              <Select
                value={selectedRole}
                onChange={(_, value) => setSelectedRole(value as string)}
                placeholder="Filtrar por rol"
                startDecorator={<AdminPanelSettings />}
                sx={{
                  "--Select-focusedHighlight": "#ffbc62",
                  "&:hover": { borderColor: "#ffbc62" },
                }}
              >
                <Option value="all">Todos los roles</Option>
                <Option value="admin">Administradores</Option>
                <Option value="user">Usuarios</Option>
              </Select>

              <Select
                value={selectedStatus}
                onChange={(_, value) => setSelectedStatus(value as string)}
                placeholder="Filtrar por estado"
                sx={{
                  "--Select-focusedHighlight": "#ffbc62",
                  "&:hover": { borderColor: "#ffbc62" },
                }}
              >
                <Option value="all">Todos los estados</Option>
                <Option value="active">Activos</Option>
                <Option value="inactive">Inactivos</Option>
              </Select>
            </Box>

            {(searchTerm || selectedRole !== "all" || selectedStatus !== "all") && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}>
                <Typography level="body-sm" color="neutral">
                  Mostrando {filteredUsers.length} de {users.length} usuarios
                </Typography>
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRole("all")
                    setSelectedStatus("all")
                  }}
                  sx={{ ml: "auto", color: "#ffbc62" }}
                >
                  Limpiar filtros
                </Button>
              </Box>
            )}
          </Stack>
        </Sheet>

        {/* Lista de usuarios mejorada */}
        {filteredUsers.length === 0 ? (
          <Sheet
            variant="soft"
            sx={{
              p: 6,
              borderRadius: "lg",
              textAlign: "center",
              bgcolor: "background.level1",
            }}
          >
            <Person sx={{ fontSize: 64, color: "text.tertiary", mb: 2 }} />
            <Typography level="h4" sx={{ mb: 1 }}>
              {searchTerm || selectedRole !== "all" || selectedStatus !== "all"
                ? "No se encontraron usuarios"
                : "No hay usuarios registrados"}
            </Typography>
            <Typography level="body-md" color="neutral" sx={{ mb: 3 }}>
              {searchTerm || selectedRole !== "all" || selectedStatus !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando el primer usuario al sistema"}
            </Typography>
            {!(searchTerm || selectedRole !== "all" || selectedStatus !== "all") && (
              <Button
                variant="outlined"
                startDecorator={<PersonAdd />}
                sx={{
                  color: "#ffbc62",
                  borderColor: "#ffbc62",
                  "&:hover": { borderColor: "#ff9b44", bgcolor: "rgba(255, 188, 98, 0.1)" },
                }}
              >
                Agregar primer usuario
              </Button>
            )}
          </Sheet>
        ) : (
          <Grid container spacing={2}>
            {filteredUsers.map((user) => (
              <Grid key={user.id} xs={12} sm={6} lg={4}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                      borderColor: "#ffbc62",
                    },
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 0.5, mx: 0.5 }}>
                    {/* Header compacto */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Badge
                        badgeContent={user.is_active ? "●" : "○"}
                        color={user.is_active ? "success" : "neutral"}
                        sx={{
                          "& .MuiBadge-badge": {
                            right: 2,
                            top: 2,
                            fontSize: "0.6rem",
                          },
                        }}
                      >
                        <Avatar
                          src={user.profile_image_url || undefined}
                          size="md"
                          sx={{
                            bgcolor: "#ffbc62",
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          {!user.profile_image_url && getUserInitials(user)}
                        </Avatar>
                      </Badge>

                      <Box sx={{ flex: 1, minWidth: 0, maxWidth: "100%" }}>
                        <Typography
                          level="title-sm"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: 600,
                            mb: 0.5,
                            maxWidth: "100%",
                            display: "block",
                          }}
                        >
                          {user.name} {user.lastname}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography
                            level="body-xs"
                            color="neutral"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              display: "block",
                            }}
                          >
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Menú desplegable */}
                      <Box sx={{ position: "relative", alignSelf: "flex-start", mr: -2, mt: -1.5, zIndex: 10 }}>
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                              root: {
                                variant: "plain",
                                size: "sm",
                                color: "neutral",
                                sx: {
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  zIndex: 1,
                                },
                              },
                            }}
                          >
                            <MoreVert />
                          </MenuButton>
                          <Menu placement="bottom-end" sx={{ minWidth: 140, zIndex: 10 }}>
                            <MenuItem
                              color="neutral"
                              onClick={() => handleEdit(user)}
                              sx={{ "&:hover": { bgcolor: "rgba(255, 188, 98, 0.1)" } }}
                            >
                              <EditIcon sx={{ mr: 1, fontSize: 16 }} />
                              Editar
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setOpenDeleteModal(true)
                              }}
                              sx={{ color: "danger.500", "&:hover": { bgcolor: "danger.50" } }}
                            >
                              <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
                              Eliminar
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </Box>
                    </Box>

                    {/* Información de contacto */}
                    <Stack spacing={1} sx={{ mb: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Chip
                          color={getRoleColor(user.role)}
                          size="sm"
                          variant="soft"
                          startDecorator={user.role === "admin" ? <AdminPanelSettings /> : <Person />}
                          sx={{ fontSize: "0.7rem", py: 0.25 }}
                        >
                          {user.role === "admin" ? "Admin" : "Usuario"}
                        </Chip>
                        <Chip
                          color={getStatusColor(user.is_active)}
                          size="sm"
                          variant="soft"
                          sx={{ fontSize: "0.7rem", py: 0.25 }}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </Chip>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Email sx={{ fontSize: 12, color: "text.tertiary" }} />
                        <Typography
                          level="body-xs"
                          color="neutral"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>

                      {user.phone && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon></PhoneIcon>
                          <Typography level="body-xs" color="neutral">
                            {user.phone}
                          </Typography>
                        </Box>
                      )}

                      {user.profession && (
                        <Typography
                          level="body-xs"
                          color="neutral"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          💼 {user.profession}
                        </Typography>
                      )}
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Fecha de registro */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 12, color: "#ffbc62" }} />
                      <Typography level="body-xs" color="neutral">
                        Fecha de creación: {formatDate(user.created_at)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Modales */}
      <DeleteUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteUser}
        loading={loadingDelete}
      />
      <EditUserModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveUser}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
      />
    </ColumnLayout>
  )
}
