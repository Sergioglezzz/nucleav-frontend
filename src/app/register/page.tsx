"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import axios from "axios"
import {
  Box,
  Card,
  Input,
  Typography,
  Link,
  Stack,
  IconButton,
  Grid,
  Divider,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/joy"
import { motion } from "framer-motion"
import Image from "next/image"
import heroImage from "../../../public/hero4.png"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { Person, Email, Phone, Badge, Lock, LockReset, Visibility, VisibilityOff } from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import ClientOnly from "@/components/ClientOnly"
import ThemeToggleButton from "@/components/ThemeToggleButton"

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  lastname: Yup.string().required("El apellido es obligatorio").min(2, "El apellido debe tener al menos 2 caracteres"),
  username: Yup.string()
    .required("El nombre de usuario es obligatorio")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),
  phone: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^\+?[0-9]{8,15}$/, "Formato de teléfono inválido"),
  email: Yup.string().required("El email es obligatorio").email("Formato de email inválido"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
    ),
  confirmPassword: Yup.string()
    .required("Debes confirmar la contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
})

export default function RegisterPage() {
  const router = useRouter()
  const { mode } = useColorScheme()
  const [mounted, setMounted] = useState(false)
  const { showNotification } = useNotification()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      username: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/register`, {
          name: values.name,
          lastname: values.lastname,
          username: values.username,
          phone: values.phone,
          email: values.email,
          password: values.password,
          role: "user",
        })

        showNotification("Usuario registrado correctamente", "success")
        resetForm()

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } catch (error: unknown) {
        console.error("Error en el registro:", error)

        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response?.data?.message || "Error en la conexión con el servidor"

          if (error.response?.status === 409) {
            showNotification("El email o nombre de usuario ya está registrado", "error")
          } else {
            showNotification(errorMessage, "error")
          }
        } else {
          showNotification("Error inesperado durante el registro. Por favor, inténtalo de nuevo.", "error")
        }
      } finally {
        setSubmitting(false)
      }
    }
  })

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        px: 2,
        py: 2,
        bgcolor: "background.body",
        color: "text.primary",
        transition: "background 0.3s ease",
      }}
      direction="column"
    >
      {/* Theme toggle button */}
      <Stack direction="row" justifyContent="flex-end">
        <Box>
          <ClientOnly>
            <ThemeToggleButton />
          </ClientOnly>
        </Box>
      </Stack>

      {/* Main heading */}
      <Typography
        level="h1"
        textAlign="center"
        fontWeight="lg"
        sx={{
          mt: { xs: 4, md: 4 },
          mb: { xs: 1, md: 2 },
          fontSize: { xs: "2xl", md: "3xl" },
          background:
            mode === "dark"
              ? "linear-gradient(90deg, #ffbc62 0%, #ff9b44 100%)"
              : "linear-gradient(90deg, #ffbc62 0%, #ff9b44 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ¡Crea tu cuenta y empieza tu viaje!
      </Typography>

      {/* Main content: Card + Image */}
      <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="center" mt={4} gap={4}>
        <Card
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 800,
            position: "relative",
            boxShadow: "lg",
            borderRadius: "xl",

            overflow: "visible",

          }}
        >
          {/* Back button */}
          <IconButton
            variant="soft"
            size="sm"
            onClick={() => router.push("/")}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <ArrowBackIosIcon fontSize="small" sx={{ marginRight: -1 }} />
          </IconButton>

          {/* Logo */}
          <Stack direction="row" justifyContent="center" sx={{ my: 1 }}>
            {mounted ? (
              <Image
                src={mode === "light" ? "/Logo-nucleav-light.png" : "/Logo-nucleav-dark.png"}
                alt="NucleAV Logo"
                width={160}
                height={50}
                priority
                style={{
                  filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
                  transition: "transform 0.3s ease",
                }}
                className="logo-hover"
              />
            ) : (
              <Box sx={{ width: 160, height: 50 }} />
            )}
          </Stack>

          <Typography level="title-md" textAlign="center" sx={{ mb: 3, color: "text.secondary" }}>
            Completa tus datos para registrarte
          </Typography>

          {/* Registration Form */}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Column 1 */}
              <Grid xs={12} md={6}>
                <Stack gap={2}>
                  {/* Name */}
                  <FormControl error={formik.touched.name && Boolean(formik.errors.name)}>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      name="name"
                      placeholder="Nombre"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<Person />}
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.name && formik.errors.name && <FormHelperText>{formik.errors.name}</FormHelperText>}
                  </FormControl>

                  {/* Last name */}
                  <FormControl error={formik.touched.lastname && Boolean(formik.errors.lastname)}>
                    <FormLabel>Apellidos</FormLabel>
                    <Input
                      name="lastname"
                      placeholder="Apellidos"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<Person />}
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <FormHelperText>{formik.errors.lastname}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Username */}
                  <FormControl error={formik.touched.username && Boolean(formik.errors.username)}>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <Input
                      name="username"
                      placeholder="Nombre de usuario"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<Badge />}
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.username && formik.errors.username && (
                      <FormHelperText>{formik.errors.username}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Phone */}
                  <FormControl error={formik.touched.phone && Boolean(formik.errors.phone)}>
                    <FormLabel>Teléfono</FormLabel>
                    <Input
                      name="phone"
                      placeholder="Teléfono"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<Phone />}
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <FormHelperText>{formik.errors.phone}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Grid>

              {/* Column 2 */}
              <Grid xs={12} md={6}>
                <Stack gap={2}>
                  {/* Email */}
                  <FormControl error={formik.touched.email && Boolean(formik.errors.email)}>
                    <FormLabel>Correo electrónico</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Correo electrónico"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<Email />}
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormHelperText>{formik.errors.email}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Password */}
                  <FormControl error={formik.touched.password && Boolean(formik.errors.password)}>
                    <FormLabel>Contraseña</FormLabel>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<Lock />}
                      endDecorator={
                        <IconButton
                          variant="plain"
                          color="neutral"
                          onClick={togglePasswordVisibility}
                          sx={{ color: "text.tertiary" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <FormHelperText>{formik.errors.password}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Confirm Password */}
                  <FormControl error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
                    <FormLabel>Repetir contraseña</FormLabel>
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repetir contraseña"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      startDecorator={<LockReset />}
                      endDecorator={
                        <IconButton
                          variant="plain"
                          color="neutral"
                          onClick={toggleConfirmPasswordVisibility}
                          sx={{ color: "text.tertiary" }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                      sx={{
                        "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                        "&:hover": {
                          borderColor: "primary.solidBg",
                        },
                        "&:focus-within": {
                          borderColor: "primary.solidBg",
                          boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                        },
                      }}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Grid>

              {/* Submit Button */}
              <Grid xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="solid"
                  color="primary"
                  disabled={formik.isSubmitting}
                  loading={formik.isSubmitting}
                  loadingPosition="center"
                  sx={{
                    mt: 2,
                    bgcolor: "#ffbc62",
                    "&:hover": {
                      bgcolor: "#ff9b44",
                    },
                    height: 40,
                    borderRadius: "md",
                    fontWeight: "bold",
                    boxShadow: "md",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover:not(:active)": {
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    },
                  }}
                >
                  Registrarse
                </Button>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ my: 2 }}>o</Divider>

          {/* Login link */}
          <Typography level="body-sm" textAlign="center">
            ¿Ya tienes cuenta?{" "}
            <Link
              color="primary"
              fontWeight="lg"
              onClick={() => router.push("/login")}
              sx={{
                color: "#ffbc62",
                transition: "color 0.2s",
                "&:hover": {
                  color: "#ff9b44",
                  textDecoration: "none",
                },
              }}
            >
              Iniciar sesión
            </Link>
          </Typography>
        </Card>

        {/* Hero image */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 500,
            minWidth: { xs: "auto", md: 400 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 4,
              ease: "easeInOut",
            }}
            style={{ width: "100%", height: "auto" }}
          >
            <Image
              src={heroImage || "/placeholder.svg"}
              alt="Ilustración de bienvenida"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.15))",
              }}
              priority
            />
          </motion.div>
        </Box>
      </Stack>
    </Stack>
  )
}
