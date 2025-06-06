"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Sheet,
  Input,
  Select,
  Option,
  Table,
  Avatar,
  Chip,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
  FormControl,
  FormLabel,
  Tooltip,
} from "@mui/joy"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  image?: string
  createdAt: string
  status: "active" | "inactive"
}

export default function ManageUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
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

  // Cargar usuarios reales desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
        const data = response.data.data || response.data
        setUsers(data)
      } catch (err) {
        console.error("Error al cargar usuarios:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [session?.accessToken])


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setEditModalOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
    })
    setCreateModalOpen(true)
  }

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u)))
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
    }
    setEditModalOpen(false)
    setCreateModalOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
    }
    setDeleteModalOpen(false)
    setSelectedUser(null)
  }

  const getRoleColor = (role: string) => (role === "admin" ? "danger" : "primary")
  const getStatusColor = (status: string) => (status === "active" ? "success" : "neutral")

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          mt: 8,
        }}
      >
        <Typography>Cargando usuarios...</Typography>
      </Box>
    )
  }

  return (
    <ColumnLayout>
      <Box
        sx={{
          p: 3,
          mt: 8,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography level="h2" sx={{ color: "#ffbc62", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            Gestión de Usuarios
          </Typography>
          <Button
            startDecorator={<AddIcon />}
            onClick={handleCreate}
            sx={{
              bgcolor: "#ffbc62",
              color: "white",
              fontWeight: 600,
              "&:hover": { bgcolor: "#e6a555" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
            size="sm"
          >
            Nuevo Usuario
          </Button>
        </Box>

        {/* Filtros */}
        <Sheet
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "lg",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            background:
              "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Input
            placeholder="Buscar por nombre o email..."
            startDecorator={<SearchIcon />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: { xs: "1 1 auto", sm: "1 1 0" },
              minWidth: { xs: "100%", sm: "200px" },
              "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
              "&:hover": { borderColor: "primary.solidBg" },
              "&:focus-within": {
                borderColor: "primary.solidBg",
                boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
              },
            }}
            size="sm"
          />

          <Select
            value={selectedRole}
            onChange={(_, value) => setSelectedRole(value as string)}
            placeholder="Rol"
            size="sm"
            sx={{
              flex: { xs: "1 1 auto", sm: "0 0 120px" },
              minWidth: { xs: "100%", sm: "120px" },
              "--Select-focusedThickness": "var(--joy-palette-primary-solidBg)",
              "&:hover": { borderColor: "primary.solidBg" },
              "&:focus-within": {
                borderColor: "primary.solidBg",
                boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
              },
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="admin">Administrador</Option>
            <Option value="user">Usuario</Option>
          </Select>
        </Sheet>

        {/* Tabla de usuarios */}
        <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "hidden" }}>
          <Table hoverRow size="sm">
            <thead>
              <tr>
                <th style={{ width: "30%", padding: "8px" }}>Usuario</th>
                <th style={{ width: "30%", padding: "8px" }}>Email</th>
                <th style={{ width: "15%", padding: "8px" }}>Rol</th>
                <th style={{ width: "15%", padding: "8px" }}>Estado</th>
                <th style={{ width: "10%", padding: "8px" }}>Registro</th>
                <th style={{ width: "10%", padding: "8px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={user.image || undefined}
                        alt={user.name}
                        size="sm"
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography level="body-md" fontWeight="md">
                        {user.name}
                      </Typography>
                    </Box>
                  </td>
                  <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                    <Typography level="body-sm" noWrap>
                      {user.email}
                    </Typography>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <Chip color={getRoleColor(user.role)} size="sm" variant="soft" sx={{ fontSize: "0.75rem" }}>
                      {user.role === "admin" ? "Admin" : "Usuario"}
                    </Chip>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <Chip color={getStatusColor(user.status)} size="sm" variant="soft" sx={{ fontSize: "0.75rem" }}>
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Chip>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <Typography level="body-sm">
                      {new Date(user.createdAt).toLocaleDateString("es-ES")}
                    </Typography>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <Tooltip title="Editar usuario">
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={() => handleEdit(user)}
                          sx={{
                            color: "#ffbc62",
                            "&:hover": { bgcolor: "rgba(255, 188, 98, 0.1)" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar usuario">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDelete(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>

        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography level="body-md" color="neutral">
              No se encontraron usuarios con los filtros aplicados
            </Typography>
          </Box>
        )}

        {/* Modal de edición/creación */}
        <Modal
          open={editModalOpen || createModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setCreateModalOpen(false)
          }}
        >
          <ModalDialog sx={{ maxWidth: 420, width: "90%" }}>
            <ModalClose />
            <Typography level="h4" sx={{ mb: 2, color: "#ffbc62" }}>
              {selectedUser ? "Editar Usuario" : "Crear Usuario"}
            </Typography>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre completo"
                  autoFocus
                  size="sm"
                  sx={{
                    "&:focus-within": { borderColor: "#ffbc62" },
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  size="sm"
                  sx={{
                    "&:focus-within": { borderColor: "#ffbc62" },
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(_, value) => setFormData({ ...formData, role: value as "admin" | "user" })}
                  size="sm"
                  sx={{
                    "&:focus-within": { borderColor: "#ffbc62" },
                  }}
                >
                  <Option value="user">Usuario</Option>
                  <Option value="admin">Administrador</Option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(_, value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                  size="sm"
                  sx={{
                    "&:focus-within": { borderColor: "#ffbc62" },
                  }}
                >
                  <Option value="active">Activo</Option>
                  <Option value="inactive">Inactivo</Option>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => {
                    setEditModalOpen(false)
                    setCreateModalOpen(false)
                  }}
                  size="sm"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveUser}
                  disabled={!formData.name || !formData.email}
                  size="sm"
                  sx={{
                    bgcolor: "#ffbc62",
                    color: "white",
                    "&:hover": { bgcolor: "#e6a555" },
                    "&:disabled": { bgcolor: "neutral.200" },
                  }}
                >
                  {selectedUser ? "Actualizar" : "Crear"}
                </Button>
              </Box>
            </Stack>
          </ModalDialog>
        </Modal>

        {/* Modal de confirmación de eliminación */}
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <ModalDialog variant="outlined" role="alertdialog" sx={{ maxWidth: 360, width: "90%" }}>
            <ModalClose />
            <Typography level="h4" sx={{ mb: 1 }}>
              Confirmar eliminación
            </Typography>
            <Typography level="body-md" sx={{ mb: 3 }}>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser?.name}</strong>? Esta acción no se puede
              deshacer.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button variant="plain" color="neutral" onClick={() => setDeleteModalOpen(false)} size="sm">
                Cancelar
              </Button>
              <Button color="danger" onClick={handleDeleteConfirm} size="sm">
                Eliminar
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </Box>
    </ColumnLayout>
  )
}
