"use client"

import { Modal, Sheet, Typography, Button, Stack } from "@mui/joy"
import { Delete } from "@mui/icons-material"

interface DeleteCompanyModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  loading?: boolean
  companyName?: string
}

export default function DeleteCompanyModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  companyName = "esta empresa",
}: DeleteCompanyModalProps) {
  return (
    <Modal open={open} onClose={() => !loading && onClose()}>
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
        <Typography level="h4" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Delete color="error" />
          Eliminar empresa
        </Typography>
        <Typography level="body-sm" sx={{ mb: 3 }}>
          Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar <strong>{companyName}</strong>?
        </Typography>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button variant="plain" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="solid" color="danger" onClick={onConfirm} loading={loading}>
            Eliminar
          </Button>
        </Stack>
      </Sheet>
    </Modal>
  )
}
