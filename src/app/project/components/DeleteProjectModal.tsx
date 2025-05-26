"use client"

import { Modal, ModalDialog, ModalClose, Typography, Button, Box, Alert } from "@mui/joy"
import { Delete, Warning } from "@mui/icons-material"

interface DeleteProjectModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  projectName: string
  loading?: boolean
}

export default function DeleteProjectModal({
  open,
  onClose,
  onConfirm,
  projectName,
  loading = false,
}: DeleteProjectModalProps) {
  return (
    <Modal open={open} onClose={() => !loading && onClose()}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          maxWidth: { xs: "90vw", sm: 500 },
          width: "100%",
          mx: 2,
        }}
      >
        <ModalClose disabled={loading} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "rgba(220, 38, 38, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "danger.500",
            }}
          >
            <Warning fontSize="large" />
          </Box>
          <Box>
            <Typography level="h4" color="danger">
              Confirmar eliminación
            </Typography>
            <Typography level="body-sm" color="neutral">
              Esta acción no se puede deshacer
            </Typography>
          </Box>
        </Box>

        <Alert variant="soft" color="danger" sx={{ mb: 3 }} startDecorator={<Delete />}>
          <Box>
            <Typography level="body-sm" fontWeight="md">
              ¿Estás seguro de que deseas eliminar el proyecto?
            </Typography>
            <Typography level="body-sm" sx={{ mt: 0.5 }}>
              <strong>{projectName}</strong>
            </Typography>
          </Box>
        </Alert>

        <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
          Se perderán todos los datos asociados incluyendo materiales, miembros del equipo, actividad y configuraciones.
          Esta acción es permanente e irreversible.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            color="neutral"
            onClick={onClose}
            disabled={loading}
            sx={{
              flex: { xs: 1, sm: "0 0 auto" },
              order: { xs: 2, sm: 1 },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={onConfirm}
            loading={loading}
            startDecorator={!loading ? <Delete /> : undefined}
            sx={{
              flex: { xs: 1, sm: "0 0 auto" },
              order: { xs: 1, sm: 2 },
            }}
          >
            {loading ? "Eliminando..." : "Eliminar proyecto"}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
