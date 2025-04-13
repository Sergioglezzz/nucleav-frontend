'use client';

import { Modal, ModalDialog, Typography, Button, Stack } from '@mui/joy';

interface ExitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExitModal({ open, onClose, onConfirm }: ExitModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <Typography level="h4" textAlign="center" mb={2}>
          ¿Cerrar sesión?
        </Typography>
        <Typography level="body-sm" textAlign="center" mb={3}>
          ¿Estás seguro de que quieres salir de tu cuenta?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="plain" color="primary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="solid" color="primary" onClick={onConfirm}>
            Cerrar sesión
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
