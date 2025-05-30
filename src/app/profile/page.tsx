"use client"

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Divider,
  Grid,
  Typography,
  AspectRatio,
  IconButton,
  Skeleton,
  Sheet,
} from "@mui/joy"
import { Edit, Favorite, Comment, Share, Person, Work, Description } from "@mui/icons-material"
import { useColorScheme } from "@mui/joy/styles"
import ColumnLayout from "@/components/ColumnLayout"
import HeaderDark from "../../../public/header1.jpg"
import HeaderLight from "../../../public/header3.jpg"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import Image from "next/image";

interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  profession: string | null;
  role: string;
  profile_image_url: string | null;
  bio: string | null;
}

export default function ProfilePage() {
  const router = useRouter()
  const { mode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  const backgroundHeader = mode === "dark" ? HeaderDark.src : HeaderLight.src

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) {
        if (status !== "loading") {
          setLoading(false);
          setError("No se ha encontrado información de sesión");
        }
        return
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${session.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
        setUser(res.data);
        setError(null);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Error al cargar los datos del usuario");
        } else {
          setError("Error inesperado");
        }
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchUser()
    }
  }, [session, status])

  const userInitial = user?.name?.[0]?.toUpperCase() || "?"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Datos de portfolio (simulados)
  const portfolioItems = [
    {
      id: 1,
      type: "image",
      title: "Diseño de dashboard",
      src: "https://picsum.photos/seed/picsum1/600/400",
      likes: 45,
      comments: 12,
    },
    {
      id: 2,
      type: "video",
      title: "Prototipo animado",
      src: "https://picsum.photos/seed/picsum2/600/400",
      likes: 32,
      comments: 8,
    },
    {
      id: 3,
      type: "image",
      title: "Paleta de colores",
      src: "https://picsum.photos/seed/picsum3/600/400",
      likes: 67,
      comments: 15,
    },
    {
      id: 4,
      type: "image",
      title: "Diseño de app móvil",
      src: "https://picsum.photos/seed/picsum4/600/400",
      likes: 28,
      comments: 6,
    },
  ]

  return (
    <>
      <ColumnLayout>
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "danger.softBg", color: "danger.solidColor", borderRadius: "md" }}>
              <Typography level="body-md">{error}</Typography>
            </Box>
          )}

          <Card
            variant="outlined"
            sx={{
              overflow: "visible",
              position: "relative",
              mx: { xs: -3, sm: 0 },
              mt: -2,
              width: { xs: "calc(100% + 46px)", sm: "auto" },
            }}
          >
            {/* Cabecera */}
            {!mounted ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  height: { xs: 120, sm: 150 },
                  borderRadius: "12px",
                  mb: -2,
                }}
              />
            ) : (
              <Box
                sx={{
                  height: { xs: 120, sm: 150 },
                  borderRadius: "12px",
                  backgroundImage: `url(${backgroundHeader})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  transition: "background-image 0.3s ease-in-out",
                }}
              >
                <IconButton
                  variant="soft"
                  size="sm"
                  color="neutral"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 12,
                    padding: "6px",
                    borderRadius: "50%",
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  }}
                  onClick={() => router.back()}
                >
                  <ArrowBackIosIcon fontSize="small" sx={{ marginRight: -1 }} />
                </IconButton>
              </Box>
            )}

            <CardContent sx={{ pt: 0 }}>
              {/* Contenedor principal con avatar y botón editar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: { xs: -6, sm: -8 } }}>
                {/* Avatar */}
                {loading ? (
                  <Skeleton
                    variant="circular"
                    animation="wave"
                    sx={{
                      width: { xs: 80, sm: 120 },
                      height: { xs: 80, sm: 120 },
                      ml: 2,
                    }}
                  />
                ) : (
                  <Avatar
                    alt={user?.username || "Usuario"}
                    variant="solid"
                    sx={{
                      width: { xs: 80, sm: 120 },
                      height: { xs: 80, sm: 120 },
                      fontSize: "xl2",
                      bgcolor: "neutral.softBg",
                      color: "text.primary",
                      border: "4px solid",
                      borderColor: "background.body",
                      ml: 2,
                    }}
                  >
                    {userInitial}
                  </Avatar>
                )}

                {/* Botón editar perfil */}
                <Tooltip title="Editar perfil" placement="top" variant="soft">
                  <Button
                    startDecorator={<Edit sx={{ color: "#ffbc62", ml: { xs: 1, sm: 0 } }} />}
                    color="neutral"
                    variant="outlined"
                    onClick={() => router.push("/profile/edit")}
                    sx={{
                      alignSelf: { xs: "center", sm: "flex-end" },
                      mt: { xs: 6, sm: 0 },
                      mb: { xs: -1, sm: 2 },
                      width: { xs: 40, sm: "auto" },
                      height: { xs: 40, sm: "auto" },
                      px: { xs: 0, sm: 2.5 },
                      minWidth: { xs: "unset", sm: "auto" },
                      justifyContent: "center",
                      borderRadius: { xs: "50%", sm: 24 },
                    }}
                  >
                    {/* Texto oculto en xs */}
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>Editar perfil</Box>
                  </Button>
                </Tooltip>
              </Box>

              {/* Información del usuario */}
              <Box sx={{ mt: 2, ml: 2, mr: 2 }}>
                {/* Username y rol */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  {loading ? (
                    <>
                      <Skeleton variant="text" animation="wave" sx={{ width: 150, height: 32 }} />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: 80, height: 24, borderRadius: "md" }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography level="h4" fontWeight="bold">
                        {user?.username || "Sin nombre de usuario"}
                      </Typography>
                      <Chip color="primary" size="sm" variant="outlined">
                        {user?.role || "Sin rol"}
                      </Chip>
                    </>
                  )}
                </Box>

                {/* Email */}
                {loading ? (
                  <Skeleton variant="text" animation="wave" sx={{ width: 200, height: 20, mt: 0.5 }} />
                ) : (
                  <Typography level="body-sm" color="neutral" sx={{ mt: 0.5 }}>
                    {user?.email || "Sin correo electrónico"}
                  </Typography>
                )}

                {/* Tarjeta de información personal */}
                <Sheet
                  variant="soft"
                  color="neutral"
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: "md",
                    boxShadow: "sm",
                    background:
                      mounted && mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid",
                    borderColor: mounted && mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Nombre completo */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <Person sx={{ color: "#ffbc62", fontSize: 20, mt: 0.5 }} />
                      <Box sx={{ width: "100%" }}>
                        <Typography level="title-sm" sx={{ color: mode === "dark" ? "neutral.300" : "neutral.600" }}>
                          Nombre completo
                        </Typography>
                        {loading ? (
                          <Skeleton variant="text" animation="wave" sx={{ width: "80%", height: 24 }} />
                        ) : (
                          <Typography level="body-md" fontWeight="md">
                            {user?.name && user?.lastname
                              ? `${user.name} ${user.lastname}`
                              : "Sin nombre completo"}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Profesión */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <Work sx={{ color: "#ffbc62", fontSize: 20, mt: 0.5 }} />
                      <Box sx={{ width: "100%" }}>
                        <Typography level="title-sm" sx={{ color: mode === "dark" ? "neutral.300" : "neutral.600" }}>
                          Profesión
                        </Typography>
                        {loading ? (
                          <Skeleton variant="text" animation="wave" sx={{ width: "60%", height: 24 }} />
                        ) : (
                          <Typography level="body-md" fontWeight="md">
                            {user?.profession || "Sin definir"}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Bio */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <Description sx={{ color: "#ffbc62", fontSize: 20, mt: 0.5 }} />
                      <Box sx={{ width: "100%" }}>
                        <Typography level="title-sm" sx={{ color: mode === "dark" ? "neutral.300" : "neutral.600" }}>
                          Biografía
                        </Typography>
                        {loading ? (
                          <>
                            <Skeleton variant="text" animation="wave" sx={{ width: "100%", height: 20, mb: 1 }} />
                            <Skeleton variant="text" animation="wave" sx={{ width: "90%", height: 20, mb: 1 }} />
                            <Skeleton variant="text" animation="wave" sx={{ width: "80%", height: 20 }} />
                          </>
                        ) : (
                          <Typography level="body-md">{user?.bio || "Sin biografía"}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Sheet>

                <Divider sx={{ my: 3 }} />

                {/* Título de la sección Portfolio */}
                <Typography level="h4" sx={{ mb: 2 }}>
                  Portfolio
                </Typography>
              </Box>

              {/* Grid de portfolio */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {loading
                  ? // Skeletons para el portfolio mientras carga
                  Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <Grid key={index} xs={12} sm={6} md={6}>
                        <Card variant="outlined">
                          <AspectRatio ratio="16/9">
                            <Skeleton variant="rectangular" animation="wave" sx={{ width: "100%", height: "100%" }} />
                          </AspectRatio>
                          <Box sx={{ p: 2 }}>
                            <Skeleton variant="text" animation="wave" sx={{ width: "70%", height: 24, mb: 1 }} />
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                              <Skeleton
                                variant="rectangular"
                                animation="wave"
                                sx={{ width: 40, height: 20, borderRadius: "sm" }}
                              />
                              <Skeleton
                                variant="rectangular"
                                animation="wave"
                                sx={{ width: 40, height: 20, borderRadius: "sm" }}
                              />
                              <Skeleton
                                variant="circular"
                                animation="wave"
                                sx={{ width: 20, height: 20, ml: "auto" }}
                              />
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  : portfolioItems.map((item) => (
                    <Grid key={item.id} xs={12} sm={6} md={6}>
                      <Card variant="outlined">
                        <AspectRatio ratio="16/9">
                          <Image
                            src={item.src || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          {item.type === "video" && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                bgcolor: "rgba(0,0,0,0.5)",
                                borderRadius: "50%",
                                width: 50,
                                height: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  width: 0,
                                  height: 0,
                                  borderTop: "10px solid transparent",
                                  borderBottom: "10px solid transparent",
                                  borderLeft: "15px solid white",
                                  ml: 1,
                                }}
                              />
                            </Box>
                          )}
                        </AspectRatio>
                        <Box sx={{ p: 2 }}>
                          <Typography level="title-md">{item.title}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Favorite sx={{ fontSize: 18, color: "neutral.500", mr: 0.5 }} />
                              <Typography level="body-xs" color="neutral">
                                {item.likes}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Comment sx={{ fontSize: 18, color: "neutral.500", mr: 0.5 }} />
                              <Typography level="body-xs" color="neutral">
                                {item.comments}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                              <Share sx={{ fontSize: 18, color: "neutral.500" }} />
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </ColumnLayout>
    </>
  )
}
