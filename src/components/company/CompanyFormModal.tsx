"use client"

import type React from "react"

import { useState } from "react"
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  FormHelperText,
  Box,
  Avatar,
  IconButton,
} from "@mui/joy"
import { Business, LocationOn, Phone, Email, Language, Badge, Upload, Cancel, Save } from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Company } from "./CompanyProfile"

interface CompanyFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: Omit<Company, "created_at" | "updated_at" | "created_by" | "is_active">) => void
  initialValues?: Partial<Company>
  isEdit?: boolean
}

// Esquema de validación
const validationSchema = Yup.object({
  cif: Yup.string()
    .required("El CIF es obligatorio")
    .matches(/^[A-Z0-9]{9}$/, "El CIF debe tener 9 caracteres alfanuméricos"),
  name: Yup.string().required("El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  description: Yup.string().nullable(),
  address: Yup.string().nullable(),
  phone: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^\+?[0-9]{8,15}$/, "Formato de teléfono inválido"),
  email: Yup.string().required("El email es obligatorio").email("Formato de email inválido"),
  website: Yup.string()
    .nullable()
    .matches(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/, "Formato de URL inválido"),
})

export default function CompanyFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: CompanyFormModalProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialValues?.logo_url || null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Inicializar formik
  const formik = useFormik({
    initialValues: {
      cif: initialValues?.cif || "",
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      address: initialValues?.address || "",
      phone: initialValues?.phone || "",
      email: initialValues?.email || "",
      website: initialValues?.website || "",
      logo_url: initialValues?.logo_url || null,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        description: values.description || null,
        address: values.address || null,
        website: values.website || null,
        logo_url: logoPreview,
      })
    },
    enableReinitialize: true,
  })

  // Manejar cambio de logo
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Eliminar logo
  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 600,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose
          variant="outlined"
          sx={{
            top: 10,
            right: 10,
            borderRadius: "50%",
            bgcolor: "background.surface",
          }}
        />

        <Typography level="h2" sx={{ mb: 2 }}>
          {isEdit ? "Editar Empresa" : "Crear Nueva Empresa"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Logo de la empresa
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                }}
              >
                <Avatar
                  src={logoPreview || undefined}
                  alt="Logo de la empresa"
                  sx={{
                    width: 100,
                    height: 100,
                    boxShadow: "sm",
                    border: "2px solid",
                    borderColor: "background.surface",
                  }}
                >
                  {formik.values.name?.charAt(0) || <Business />}
                </Avatar>
                {logoPreview && (
                  <IconButton
                    variant="solid"
                    color="danger"
                    size="sm"
                    onClick={handleRemoveLogo}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      borderRadius: "50%",
                    }}
                  >
                    <Cancel />
                  </IconButton>
                )}
              </Box>
              <Button
                component="label"
                variant="outlined"
                color="neutral"
                startDecorator={<Upload />}
                sx={{ mt: 1 }}
                size="sm"
              >
                Subir logo
                <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
              </Button>
            </Box>

            {/* CIF */}
            <FormControl error={formik.touched.cif && Boolean(formik.errors.cif)}>
              <FormLabel>CIF *</FormLabel>
              <Input
                name="cif"
                value={formik.values.cif}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="B12345678"
                startDecorator={<Badge />}
                disabled={isEdit} // No permitir editar el CIF en modo edición
              />
              {formik.touched.cif && formik.errors.cif && <FormHelperText>{formik.errors.cif}</FormHelperText>}
            </FormControl>

            {/* Nombre */}
            <FormControl error={formik.touched.name && Boolean(formik.errors.name)}>
              <FormLabel>Nombre de la empresa *</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nombre de la empresa"
                startDecorator={<Business />}
              />
              {formik.touched.name && formik.errors.name && <FormHelperText>{formik.errors.name}</FormHelperText>}
            </FormControl>

            {/* Descripción */}
            <FormControl error={formik.touched.description && Boolean(formik.errors.description)}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe tu empresa"
                minRows={2}
                maxRows={4}
              />
              {formik.touched.description && formik.errors.description && (
                <FormHelperText>{formik.errors.description}</FormHelperText>
              )}
            </FormControl>

            {/* Dirección */}
            <FormControl error={formik.touched.address && Boolean(formik.errors.address)}>
              <FormLabel>Dirección</FormLabel>
              <Input
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Dirección de la empresa"
                startDecorator={<LocationOn />}
              />
              {formik.touched.address && formik.errors.address && (
                <FormHelperText>{formik.errors.address}</FormHelperText>
              )}
            </FormControl>

            {/* Teléfono */}
            <FormControl error={formik.touched.phone && Boolean(formik.errors.phone)}>
              <FormLabel>Teléfono *</FormLabel>
              <Input
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="+34 912 345 678"
                startDecorator={<Phone />}
              />
              {formik.touched.phone && formik.errors.phone && <FormHelperText>{formik.errors.phone}</FormHelperText>}
            </FormControl>

            {/* Email */}
            <FormControl error={formik.touched.email && Boolean(formik.errors.email)}>
              <FormLabel>Email *</FormLabel>
              <Input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="info@empresa.com"
                startDecorator={<Email />}
              />
              {formik.touched.email && formik.errors.email && <FormHelperText>{formik.errors.email}</FormHelperText>}
            </FormControl>

            {/* Sitio web */}
            <FormControl error={formik.touched.website && Boolean(formik.errors.website)}>
              <FormLabel>Sitio web</FormLabel>
              <Input
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://www.empresa.com"
                startDecorator={<Language />}
              />
              {formik.touched.website && formik.errors.website && (
                <FormHelperText>{formik.errors.website}</FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" color="neutral" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              startDecorator={<Save />}
              sx={{
                bgcolor: "#ffbc62",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 188, 98, 0.8)",
                },
              }}
            >
              {isEdit ? "Guardar cambios" : "Crear empresa"}
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  )
}
