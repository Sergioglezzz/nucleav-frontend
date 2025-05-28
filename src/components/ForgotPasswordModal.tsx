"use client"

import { useState } from "react"
import {
  Modal,
  ModalDialog,
  Typography,
  Input,
  Button,
  Alert,
  Stack,
  IconButton,
} from "@mui/joy"
import Close from "@mui/icons-material/Close"

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      setSent(true)
    }, 1000)
  }

  const handleClose = () => {
    setEmail("")
    setSent(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="forgot-password-title"
        sx={{ minWidth: 360 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography id="forgot-password-title" level="h4">
            Recuperar contraseña
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <Typography level="body-sm" sx={{ mb: 1 }}>
              Introduce tu correo para recibir un enlace de recuperación.
            </Typography>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              sx={{
                "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                "&:hover": {
                  borderColor: "primary.solidBg",
                },
                "&:focus-within": {
                  borderColor: "primary.solidBg",
                  boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                },
                mb: 2
              }}
            />
            <Button type="submit" fullWidth>
              Enviar enlace
            </Button>
          </form>
        ) : (
          <Alert color="success" variant="soft" sx={{ mt: 2 }}>
            Se ha enviado un correo de recuperación (simulado).
          </Alert>
        )}
      </ModalDialog>
    </Modal>
  )
}
