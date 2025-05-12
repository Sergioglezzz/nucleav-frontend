"use client"

import type React from "react"

import {
  Box,
  Button,
  Card,
  Typography,
  Input,
  Link,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
} from "@mui/joy"
import Image from "next/image"
import ThemeToggleButton from "@/components/ThemeToggleButton"
import { useRouter } from "next/navigation"
import { useColorScheme } from "@mui/joy/styles"
import { motion } from "framer-motion"
import heroImage from "../../../public/hero3.png"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { Email, Lock, Visibility, VisibilityOff, CheckCircle, Error, Info, Warning, Close } from "@mui/icons-material"
import ClientOnly from "@/components/ClientOnly"

// Tipos para las notificaciones
type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationState {
  open: boolean
  message: string
  type: NotificationType
}

export default function LoginPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Estado para la notificación
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "info",
  })

  useEffect(() => {
    setMounted(true)
    // Marcar el body como cargado por Joy UI
    document.body.classList.add("joy-loaded")
  }, [])

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: NotificationType = "info") => {
    setNotification({
      open: true,
      message,
      type,
    })
  }

  // Función para cerrar la notificación
  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }))
  }

  // Obtener el icono según el tipo de notificación
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle />
      case "error":
        return <Error />
      case "warning":
        return <Warning />
      case "info":
      default:
        return <Info />
    }
  }

  // Obtener el color según el tipo de notificación
  const getNotificationColor = () => {
    switch (notification.type) {
      case "success":
        return "success"
      case "error":
        return "danger"
      case "warning":
        return "warning"
      case "info":
      default:
        return "primary"
    }
  }

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("El email es obligatorio")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Formato de email inválido")
      return false
    }
    setEmailError(null)
    return true
  }

  // Validar contraseña
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("La contraseña es obligatoria")
      return false
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    setPasswordError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.ok) {
        showNotification("¡Inicio de sesión exitoso!", "success")
        setTimeout(() => {
          router.push("/dashboard")
        }, 800)
      } else {
        // Mostrar mensaje de error específico según el error
        if (result?.error === "CredentialsSignin") {
          showNotification("Email o contraseña incorrectos", "error")
        } else {
          showNotification("Error al iniciar sesión. Por favor, inténtalo de nuevo.", "error")
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification("Error al conectar con el servidor. Por favor, inténtalo más tarde.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Si no está montado, mostrar un indicador de carga con el fondo correcto
  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--joy-palette-background-body)",
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    )
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
      {/* Botón de cambiar tema arriba a la derecha */}
      <Stack direction="row" justifyContent="flex-end">
        <Box>
          <ClientOnly>
            <ThemeToggleButton />
          </ClientOnly>
        </Box>
      </Stack>

      {/* Texto principal */}
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
        ¡Listos para trabajar juntos!
      </Typography>

      {/* Contenido principal: Card + Imagen */}
      <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="center" mt={4} gap={4}>
        {/* Login Card */}
        <Card
          sx={{
            p: 4,
            flexBasis: { xs: "100%", md: "400px" },
            flexShrink: 0,
            flexGrow: 0,
            width: "100%",
            maxWidth: "400px",
            position: "relative",
            boxShadow: "lg",
            borderRadius: "xl",
            overflow: "visible",
          }}
        >
          {/* Botón de retroceso - ahora a la izquierda */}
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

          {/* Logo centrado */}
          <Stack direction="row" justifyContent="center" sx={{ my: 1 }}>
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
          </Stack>

          <Typography level="title-md" textAlign="center" sx={{ mb: 3, color: "text.secondary" }}>
            Accede a tu cuenta
          </Typography>

          {/* Formulario */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Campo de Email */}
            <Box>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                variant="outlined"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) validateEmail(e.target.value)
                }}
                onBlur={() => validateEmail(email)}
                error={!!emailError}
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
              {emailError && (
                <Typography level="body-xs" color="danger" sx={{ mt: 0.5, ml: 1 }}>
                  {emailError}
                </Typography>
              )}
            </Box>

            {/* Campo de Contraseña con botón de mostrar/ocultar */}
            <Box>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                required
                variant="outlined"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) validatePassword(e.target.value)
                }}
                onBlur={() => validatePassword(password)}
                error={!!passwordError}
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
              {passwordError && (
                <Typography level="body-xs" color="danger" sx={{ mt: 0.5, ml: 1 }}>
                  {passwordError}
                </Typography>
              )}
            </Box>

            {/* Botón de Iniciar Sesión con indicador de carga */}
            <Button
              type="submit"
              fullWidth
              variant="solid"
              color="primary"
              disabled={loading}
              sx={{
                mt: 1,
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
                position: "relative",
              }}
            >
              {loading ? (
                <>
                  <span style={{ visibility: "hidden" }}>Iniciar Sesión</span>
                  <CircularProgress
                    size="sm"
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>o</Divider>

          {/* Links */}
          <Typography level="body-sm" textAlign="center">
            ¿No tienes cuenta?{" "}
            <Link
              color="primary"
              fontWeight="lg"
              onClick={() => router.push("/register")}
              sx={{
                color: "#ffbc62",
                transition: "color 0.2s",
                "&:hover": {
                  color: "#ff9b44",
                  textDecoration: "none",
                },
              }}
            >
              Regístrate
            </Link>
          </Typography>

          <Typography level="body-xs" mt={1} textAlign="center">
            <Link
              color="primary"
              underline="hover"
              onClick={() => router.push("/forgot-password")}
              sx={{
                color: "#ffbc62",
                transition: "color 0.2s",
                "&:hover": {
                  color: "#ff9b44",
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Typography>
        </Card>

        {/* Imagen a la derecha */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 500,
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        variant="soft"
        color={getNotificationColor()}
        open={notification.open}
        onClose={handleCloseNotification}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        startDecorator={getNotificationIcon()}
        endDecorator={
          <IconButton variant="plain" size="sm" color={getNotificationColor()} onClick={handleCloseNotification}>
            <Close />
          </IconButton>
        }
        sx={{
          position: "fixed",
          zIndex: 9999,
          minWidth: 300,
          maxWidth: 500,
        }}
      >
        <Typography>{notification.message}</Typography>
      </Snackbar>
    </Stack>
  )
}
