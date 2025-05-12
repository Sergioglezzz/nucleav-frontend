"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import ColumnLayout from "@/components/ColumnLayout"
import { api } from "@/utils/api"
import {
  Typography,
  Card,
  Table,
  Avatar,
  Chip,
  Box,
  IconButton,
  Input,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
  Badge,
  Select,
  Option,
  Skeleton,
} from "@mui/joy"
import {
  Search,
  FilterList,
  Refresh,
  Edit,
  Delete,
  MoreVert,
  Person,
  AdminPanelSettings,
  SupervisorAccount,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material"
import ThemeTransitionWrapper from "@/components/ThemeTransitionWrapper"

interface User {
  id: number
  name: string
  lastname: string
  username: string
  email: string
  role: string
  phone?: string
}

type SortField = "id" | "name" | "username" | "email" | "role"
type SortDirection = "asc" | "desc"

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const { data: session, status } = useSession()
  const router = useRouter()

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    if (!session?.accessToken) return

    setLoading(true)
    setError(null)

    try {
      const res = await api.get<User[]>("/v1/users", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      setUsers(res.data)
      setFilteredUsers(res.data)
    } catch (error) {
      console.error("Error fetching users", error)
      setError("Error al cargar los usuarios.")
    } finally {
      setLoading(false)
    }
  }

  // Cargar usuarios cuando la sesión esté autenticada
  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers()
    }
  }, [session, status])

  // Filtrar y ordenar usuarios
  useEffect(() => {
    if (!users.length) return

    let result = [...users]

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.lastname.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      )
    }

    // Filtrar por rol
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role.toLowerCase() === roleFilter.toLowerCase())
    }

    // Ordenar
    result.sort((a, b) => {
      let valueA = a[sortField]
      let valueB = b[sortField]

      // Asegurar que estamos comparando strings
      valueA = typeof valueA === "string" ? valueA.toLowerCase() : String(valueA)
      valueB = typeof valueB === "string" ? valueB.toLowerCase() : String(valueB)

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    setFilteredUsers(result)
  }, [users, searchQuery, roleFilter, sortField, sortDirection])

  // Manejar el cambio de ordenación
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Obtener el icono de rol
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <AdminPanelSettings />
      case "moderator":
        return <SupervisorAccount />
      default:
        return <Person />
    }
  }

  // Obtener el color del chip de rol
  const getRoleColor = (role: string): "primary" | "success" | "warning" | "neutral" => {
    switch (role.toLowerCase()) {
      case "admin":
        return "primary"
      case "moderator":
        return "warning"
      case "user":
        return "success"
      default:
        return "neutral"
    }
  }

  // Obtener las iniciales del usuario
  const getUserInitials = (name: string, lastname: string) => {
    return `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  }

  // Renderizar el estado de carga inicial
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <ColumnLayout>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size="lg" />
          </Box>
        </ColumnLayout>
      </>
    )
  }

  return (
    <>
      <ThemeTransitionWrapper>

        <Navbar />
        <ColumnLayout>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography level="h2">Usuarios registrados</Typography>
            <Badge badgeContent={filteredUsers.length} color="primary">
              <Chip variant="soft" color="primary" startDecorator={<Person />} size="lg">
                Total de usuarios
              </Chip>
            </Badge>
          </Box>

          {/* Barra de herramientas */}
          <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}>
                <Input
                  placeholder="Buscar usuarios..."
                  startDecorator={<Search />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: { xs: "100%", sm: 250 } }}
                />
                <Select
                  placeholder="Filtrar por rol"
                  startDecorator={<FilterList />}
                  value={roleFilter}
                  onChange={(_, value) => setRoleFilter(value as string)}
                  sx={{ width: { xs: "100%", sm: 180 } }}
                >
                  <Option value="all">Todos los roles</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="moderator">Moderador</Option>
                  <Option value="user">Usuario</Option>
                </Select>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title="Actualizar lista">
                  <IconButton variant="soft" color="primary" onClick={fetchUsers} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="solid"
                  color="primary"
                  startDecorator={<Person />}
                  onClick={() => router.push("/users/new")}
                >
                  Nuevo usuario
                </Button>
              </Box>
            </Box>
          </Card>

          {/* Tabla de usuarios */}
          {loading ? (
            <Card variant="outlined">
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" level="h4" sx={{ width: "30%", mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 1 }} />
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" width="100%" height={60} sx={{ mb: 1 }} />
                ))}
              </Box>
            </Card>
          ) : error ? (
            <Alert
              color="danger"
              variant="soft"
              sx={{ mb: 2 }}
              endDecorator={
                <Button variant="soft" color="danger" size="sm" onClick={fetchUsers}>
                  Reintentar
                </Button>
              }
            >
              {error}
            </Alert>
          ) : (
            <Card variant="outlined" sx={{ overflow: "auto" }}>
              {filteredUsers.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography level="body-lg" sx={{ mb: 2 }}>
                    No se encontraron usuarios con los criterios de búsqueda.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => {
                      setSearchQuery("")
                      setRoleFilter("all")
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </Box>
              ) : (
                <Box sx={{ minWidth: 800, overflowX: "auto" }}>

                  <Table
                    hoverRow
                    sx={{
                      "& th": { textAlign: "left", fontWeight: "bold" },
                      "& td": { py: 1.5 },
                      "--TableCell-headBackground": "var(--joy-palette-background-level1)",
                      "--Table-headerUnderlineThickness": "1px",
                      "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th style={{ width: 200 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              userSelect: "none",
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() => handleSort("name")}
                          >
                            Usuario
                            {sortField === "name" &&
                              (sortDirection === "asc" ? (
                                <ArrowUpward fontSize="small" />
                              ) : (
                                <ArrowDownward fontSize="small" />
                              ))}
                          </Box>
                        </th>
                        <th>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              userSelect: "none",
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() => handleSort("username")}
                          >
                            Username
                            {sortField === "username" &&
                              (sortDirection === "asc" ? (
                                <ArrowUpward fontSize="small" />
                              ) : (
                                <ArrowDownward fontSize="small" />
                              ))}
                          </Box>
                        </th>
                        <th>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              userSelect: "none",
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() => handleSort("email")}
                          >
                            Email
                            {sortField === "email" &&
                              (sortDirection === "asc" ? (
                                <ArrowUpward fontSize="small" />
                              ) : (
                                <ArrowDownward fontSize="small" />
                              ))}
                          </Box>
                        </th>
                        <th>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              userSelect: "none",
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() => handleSort("role")}
                          >
                            Rol
                            {sortField === "role" &&
                              (sortDirection === "asc" ? (
                                <ArrowUpward fontSize="small" />
                              ) : (
                                <ArrowDownward fontSize="small" />
                              ))}
                          </Box>
                        </th>
                        <th style={{ width: 120, textAlign: "center" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar variant="soft" color={getRoleColor(user.role)} size="sm">
                                {getUserInitials(user.name, user.lastname)}
                              </Avatar>
                              <Box>
                                <Typography level="body-sm" fontWeight="lg">
                                  {user.name} {user.lastname}
                                </Typography>
                                {user.phone && (
                                  <Typography level="body-xs" color="neutral">
                                    {user.phone}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </td>
                          <td>
                            <Typography level="body-sm">@{user.username}</Typography>
                          </td>
                          <td>
                            <Typography level="body-sm">{user.email}</Typography>
                          </td>
                          <td>
                            <Chip
                              variant="soft"
                              color={getRoleColor(user.role)}
                              size="sm"
                              startDecorator={getRoleIcon(user.role)}
                            >
                              {user.role}
                            </Chip>
                          </td>
                          <td>
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                              <Tooltip title="Editar usuario">
                                <IconButton
                                  variant="plain"
                                  color="neutral"
                                  size="sm"
                                  onClick={() => router.push(`/users/${user.id}/edit`)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar usuario">
                                <IconButton
                                  variant="plain"
                                  color="danger"
                                  size="sm"
                                  onClick={() => {
                                    // Aquí iría la lógica para eliminar
                                    alert(`Eliminar usuario ${user.id}`)
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Más opciones">
                                <IconButton
                                  variant="plain"
                                  color="neutral"
                                  size="sm"
                                  onClick={() => router.push(`/users/${user.id}`)}
                                >
                                  <MoreVert />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Box>
              )}
            </Card>
          )}
        </ColumnLayout>
      </ThemeTransitionWrapper>
    </>
  )
}
