"use client"

import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Box,
  Input,
  Stack,
  CircularProgress,
  Alert,
  Sheet,
  Avatar,
} from "@mui/joy"
import { Add, Search } from "@mui/icons-material"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

interface User {
  id: number
  name: string
  lastname: string
  username: string
  email: string
  avatar_url?: string
  is_active: boolean
}

interface TeamMemberSelectModalProps {
  open: boolean
  onClose: () => void
  onAddMember: (userId: number) => void
  projectId: number
  existingMemberIds: number[]
}

export default function TeamMemberSelectModal({
  open,
  onClose,
  onAddMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectId,
  existingMemberIds,
}: TeamMemberSelectModalProps) {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Cargar usuarios disponibles
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open || !session?.accessToken) return

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const usersData = response.data.data || response.data || []
        // Filtrar usuarios que no están ya en el proyecto y que están activos
        const availableUsers = usersData.filter((user: User) => !existingMemberIds.includes(user.id) && user.is_active)
        setUsers(availableUsers)
        setFilteredUsers(availableUsers)
      } catch (err: unknown) {
        console.error("Error al cargar usuarios:", err)
        setError("No se pudieron cargar los usuarios disponibles")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [open, session?.accessToken, existingMemberIds])

  // Filtrar usuarios
  useEffect(() => {
    let filtered = users

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.lastname.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      )
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery])

  // Manejar selección de usuario
  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  // Manejar adición de miembro
  const handleAdd = () => {
    if (!selectedUser) return

    onAddMember(selectedUser.id)
    handleClose()
  }

  // Cerrar modal y limpiar estado
  const handleClose = () => {
    setSelectedUser(null)
    setSearchQuery("")
    setError(null)
    onClose()
  }

  // Obtener iniciales del usuario
  const getUserInitials = (user: User) => {
    return `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: { xs: "95vw", sm: 600 },
          width: "100%",
          maxHeight: { xs: "90vh", sm: "80vh" },
          overflow: "auto",
        }}
      >
        <ModalClose />

        <Typography level="h4" sx={{ mb: 2, color: "#ffbc62" }}>
          Agregar Miembro al Equipo
        </Typography>

        {error && (
          <Alert variant="soft" color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Input
            placeholder="Buscar usuarios por nombre, email o username..."
            startDecorator={<Search />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </Stack>

        {/* Lista de usuarios */}
        <Box sx={{ mb: 3, maxHeight: 300, overflow: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size="sm" />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Sheet
              variant="soft"
              sx={{
                p: 3,
                borderRadius: "md",
                textAlign: "center",
                bgcolor: "background.level1",
              }}
            >
              <Typography level="body-sm" color="neutral">
                {searchQuery
                  ? "No se encontraron usuarios con los filtros aplicados"
                  : "No hay usuarios disponibles para agregar"}
              </Typography>
            </Sheet>
          ) : (
            <Stack spacing={1}>
              {filteredUsers.map((user) => (
                <Sheet
                  key={user.id}
                  variant={selectedUser?.id === user.id ? "solid" : "outlined"}
                  color={selectedUser?.id === user.id ? "primary" : "neutral"}
                  sx={{
                    p: 2,
                    borderRadius: "md",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: selectedUser?.id === user.id ? undefined : "background.level1",
                    },
                    ...(selectedUser?.id === user.id && {
                      bgcolor: "rgba(255, 188, 98, 0.2)",
                      borderColor: "#ffbc62",
                      color: "inherit",
                    }),
                  }}
                  onClick={() => handleUserSelect(user)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      size="md"
                      src={user.avatar_url}
                      sx={{
                        bgcolor: selectedUser?.id === user.id ? "#ffbc62" : "rgba(255, 188, 98, 0.2)",
                        color: selectedUser?.id === user.id ? "white" : "#ffbc62",
                      }}
                    >
                      {!user.avatar_url && getUserInitials(user)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography level="body-sm" fontWeight="md">
                        {user.name} {user.lastname}
                      </Typography>
                      <Typography level="body-xs" color="neutral">
                        @{user.username} • {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Sheet>
              ))}
            </Stack>
          )}
        </Box>

        {/* Acciones */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" color="neutral" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="solid"
            startDecorator={<Add />}
            onClick={handleAdd}
            disabled={!selectedUser}
            sx={{
              bgcolor: "#ffbc62",
              color: "white",
              "&:hover": {
                bgcolor: "#ff9b44",
              },
              "&:disabled": {
                bgcolor: "rgba(255, 188, 98, 0.4)",
                color: "rgba(255, 255, 255, 0.6)",
              },
            }}
          >
            Agregar al Equipo
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
