"use client"

import { Modal, Sheet, Typography, Button, Stack } from "@mui/joy"

interface DeleteUserModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export default function DeleteUserModal({ open, onClose, onConfirm, loading }: DeleteUserModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Sheet
        sx={{
          width: { xs: "90%", sm: 400 },
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
          <Button variant="plain" onClick={onClose}>Cancelar</Button>
          <Button variant="solid" color="danger" onClick={onConfirm} loading={loading}>
            Eliminar
          </Button>
        </Stack>
      </Sheet>
    </Modal>
  )
}
