"use client"

import { Box, Button, Typography, Stack, CircularProgress, Snackbar, IconButton } from "@mui/joy"
import { useRouter } from "next/navigation"
import NavbarWelcome from "@/components/NavbarWelcome"
import Image from "next/image"
import { motion } from "framer-motion"
import heroImage from "../../public/hero.png"
import { useEffect, useState } from "react"
import { Login, PersonAdd, CheckCircle, Error, Info, Warning, Close } from "@mui/icons-material"

// Tipos para las notificaciones
type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationState {
  open: boolean
  message: string
  type: NotificationType
}

export default function WelcomePage() {
  const router = useRouter()
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingRegister, setLoadingRegister] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100) // opcional: retardo para evitar flash rápido
    return () => clearTimeout(timeout)
  }, [])

  // Estado para la notificación
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "info",
  })

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

  const handleLoginClick = async () => {
    setLoadingLogin(true)
    try {
      // Simular una carga
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.push("/login")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification("Error al navegar a la página de inicio de sesión", "error")
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleRegisterClick = async () => {
    setLoadingRegister(true)
    try {
      // Simular una carga
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.push("/register")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification("Error al navegar a la página de registro", "error")
    } finally {
      setLoadingRegister(false)
    }
  }

  const handleDemoClick = () => {
    showNotification("Modo demo activado. ¡Explora todas las funcionalidades!", "info")
  }

  return (
    <>
      <NavbarWelcome />
      {!mounted ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)", // ajusta si tienes un header
          }}
        >
          <CircularProgress size="lg" color="primary" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "100vh",
              maxWidth: "1200px",
              mx: "auto",
              px: { xs: 2, md: 4 },
              py: { xs: 10, md: 4 },
              gap: { xs: 6, md: 8 },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 80% 50%, rgba(255,188,98,0.08) 0%, transparent 60%)",
                zIndex: -1,
                pointerEvents: "none",
              },
            }}
          >
            {/* Sección de texto y botones */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: "center", md: "left" },
                maxWidth: 500,
              }}
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography
                  level="h1"
                  fontSize={{ xs: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="lg"
                  mb={2}
                  sx={{
                    background: "linear-gradient(90deg, #ffbc62 0%, #ff9b44 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  ¡Gestiona tus proyectos audiovisuales con eficiencia!
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  level="body-lg"
                  mb={3}
                  sx={{
                    maxWidth: "90%",
                    mx: { xs: "auto", md: "0" },
                    color: "text.secondary",
                    lineHeight: 1.6,
                  }}
                >
                  Plataforma inteligente para organizar equipos humanos, materiales y eventos en la industria audiovisual.
                  Optimiza tus recursos y mejora la colaboración en tus proyectos.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Button
                    size="lg"
                    color="primary"
                    onClick={handleLoginClick}
                    disabled={loadingLogin}
                    startDecorator={!loadingLogin && <Login />}
                    sx={{
                      bgcolor: "#ffbc62",
                      "&:hover": {
                        bgcolor: "#ff9b44",
                      },
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
                    {loadingLogin ? (
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
                  <Button
                    size="lg"
                    variant="outlined"
                    color="neutral"
                    onClick={handleRegisterClick}
                    disabled={loadingRegister}
                    startDecorator={!loadingRegister && <PersonAdd />}
                    sx={{
                      borderColor: "#ffbc62",
                      color: "#ffbc62",
                      "&:hover": {
                        borderColor: "#ff9b44",
                        bgcolor: "rgba(255, 188, 98, 0.08)",
                      },
                      borderRadius: "md",
                      fontWeight: "bold",
                      transition: "transform 0.2s",
                      "&:hover:not(:active)": {
                        transform: "translateY(-2px)",
                      },
                      position: "relative",
                    }}
                  >
                    {loadingRegister ? (
                      <>
                        <span style={{ visibility: "hidden" }}>Registrarse</span>
                        <CircularProgress
                          size="sm"
                          color="neutral"
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </Stack>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
                <Button
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={handleDemoClick}
                  sx={{
                    mt: 3,
                    color: "text.tertiary",
                    "&:hover": {
                      color: "#ffbc62",
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Probar demo sin registro
                </Button>
              </motion.div>
            </Box>

            {/* Imagen o animación */}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "1000px",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={heroImage || "/placeholder.svg"}
                    alt="Ilustración de bienvenida"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.2))",
                    }}
                    priority
                  />
                </motion.div>
              </motion.div>
            </Box>
          </Box>
        </>
      )}

      {/* Contenido principal */}


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
    </>
  )
}
