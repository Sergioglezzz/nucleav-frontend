// src/components/EditUserModal.tsx

"use client"

import React from "react"
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Stack,
  Input,
  Select,
  Option,
  Button,
  Box,
  FormControl,
  FormLabel,
} from "@mui/joy"

interface EditUserModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  loading?: boolean
  formData: {
    name: string
    email: string
    role: "admin" | "user"
    status: "active" | "inactive"
  }
  setFormData: (data: EditUserModalProps["formData"]) => void
}

export default function EditUserModal({
  open,
  onClose,
  onSave,
  loading,
  formData,
  setFormData,
}: EditUserModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ maxWidth: 420, width: "90%" }}>
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2, color: "#ffbc62" }}>
          Editar Usuario
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

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              disabled={!formData.name || !formData.email}
              size="sm"
              sx={{
                bgcolor: "#ffbc62",
                color: "white",
                "&:hover": { bgcolor: "#e6a555" },
                "&:disabled": { bgcolor: "neutral.200" },
              }}
              loading={loading}
            >
              Guardar
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  )
}
