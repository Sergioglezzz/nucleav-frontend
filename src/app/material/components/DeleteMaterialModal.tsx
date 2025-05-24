"use client"

import { useState } from "react"
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
  Alert,
  LinearProgress,
} from "@mui/joy"
import { Delete as DeleteIcon, Warning, ErrorOutline } from "@mui/icons-material"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useNotification } from "@/components/context/NotificationContext"

interface DeleteMaterialModalProps {
  open: boolean
  onClose: () => void
  material: {
    id: string
    name: string
    category?: string | null
    quantity?: number
  } | null
  onDeleted: (materialId: string) => void
}

export default function DeleteMaterialModal({ open, onClose, material, onDeleted }: DeleteMaterialModalProps) {
  const { data: session } = useSession()
  const { showNotification } = useNotification()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!material || !session?.accessToken) {
      setError("No se puede eliminar el material. Verifica tu sesión.")
      return
    }

    setDeleting(true)
    setError(null)

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials/${material.id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      showNotification(`Material "${material.name}" eliminado correctamente`, "success")
      onDeleted(material.id)
      onClose()
    } catch (err: unknown) {
      console.error("Error al eliminar material:", err)

      let errorMessage = "No se pudo eliminar el material."

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object"
      ) {
        const response = (err as { response?: { data?: { message?: string }; status?: number } }).response
        if (response?.data?.message) {
          errorMessage = response.data.message
        } else if (response?.status === 404) {
          errorMessage = "Material no encontrado."
        } else if (response?.status === 403) {
          errorMessage = "No tienes permisos para eliminar este material."
        } else if (response?.status === 409) {
          errorMessage = "No se puede eliminar el material porque está siendo utilizado."
        }
      }

      setError(errorMessage)
      showNotification(errorMessage, "error")
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    if (!deleting) {
      setError(null)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        size="md"
        sx={{
          maxWidth: 500,
          borderRadius: "lg",
          p: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {deleting && (
          <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, borderRadius: "lg lg 0 0" }} />
        )}

        <ModalClose disabled={deleting} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "danger.100",
              color: "danger.600",
            }}
          >
            <Warning fontSize="large" />
          </Box>
          <Box>
            <Typography level="h4" sx={{ color: "danger.600", fontWeight: 600 }}>
              Eliminar Material
            </Typography>
            <Typography level="body-sm" color="neutral">
              Esta acción no se puede deshacer
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Alert
            variant="soft"
            color="danger"
            startDecorator={<ErrorOutline />}
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

        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 2 }}>
            ¿Estás seguro de que deseas eliminar el siguiente material?
          </Typography>

          {material && (
            <Box
              sx={{
                p: 2,
                borderRadius: "md",
                bgcolor: "background.level1",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography level="title-sm" sx={{ fontWeight: 600, mb: 0.5 }}>
                {material.name}
              </Typography>
              {material.category && (
                <Typography level="body-xs" color="neutral" sx={{ mb: 0.5 }}>
                  Categoría: {material.category}
                </Typography>
              )}
              {material.quantity && (
                <Typography level="body-xs" color="neutral">
                  Cantidad: {material.quantity}
                </Typography>
              )}
            </Box>
          )}

          <Typography level="body-sm" color="neutral" sx={{ mt: 2, fontStyle: "italic" }}>
            Esta acción eliminará permanentemente el material y toda su información asociada.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" color="neutral" onClick={handleClose} disabled={deleting} sx={{ minWidth: 100 }}>
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={handleDelete}
            loading={deleting}
            loadingPosition="start"
            startDecorator={!deleting ? <DeleteIcon /> : undefined}
            disabled={!material}
            sx={{ minWidth: 120 }}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  )
}
