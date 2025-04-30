"use client"

import { Avatar, Box, Button, Card, CardContent, Chip, Tooltip, Divider, Grid, Typography, AspectRatio, IconButton, Skeleton } from "@mui/joy"
import { Edit, Favorite, Comment, Share } from "@mui/icons-material"
import { useColorScheme } from '@mui/joy/styles';
import Navbar from "@/components/Navbar"
import ColumnLayout from "@/components/ColumnLayout"
import HeaderDark from "../../../public/header1.jpg"
import HeaderLight from "../../../public/header3.jpg"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function ProfilePage() {
  // Datos de usuario (simulados)
  const user = {
    username: "@diseñadorUI",
    email: "diseñador@ejemplo.com",
    fullName: "Carlos Rodríguez Martínez",
    role: "UI Designer",
    bio: "Diseñador de interfaces con 5 años de experiencia. Especializado en crear experiencias de usuario intuitivas y atractivas. Amante del minimalismo y la funcionalidad.",
    avatar: "https://i.pravatar.cc/300",
  }

  const userInitial = user.fullName?.[0]?.toUpperCase() || '?';

  const router = useRouter();
  const { mode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  const backgroundHeader = mode === 'dark' ? HeaderDark.src : HeaderLight.src;

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <Navbar />
      <ColumnLayout>
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
          <Card variant="outlined" sx={{ overflow: "visible", position: "relative" }}>
            {/* Cabecera */}
            {!mounted ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  height: { xs: 120, sm: 150 },
                  borderRadius: "12px",
                  mb: -2, // si necesitas solapar un poco con el avatar
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
                  transition: 'background-image 0.3s ease-in-out',
                }}
              >
                <IconButton
                  variant="soft"
                  size="sm"
                  color="neutral"
                  sx={{
                    position: "absolute",
                    top: 25,
                    left: 25,
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
                <Avatar
                  alt={user.username}
                  variant="solid"
                  sx={{
                    width: { xs: 80, sm: 120 },
                    height: { xs: 80, sm: 120 },
                    fontSize: 'xl2',
                    bgcolor: 'neutral.softBg',
                    color: 'text.primary',
                    border: '4px solid',
                    borderColor: 'background.body',
                    ml: 2,
                  }}
                >
                  {userInitial}
                </Avatar>

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
                      width: { xs: 40, sm: 'auto' },
                      height: { xs: 40, sm: 'auto' },
                      px: { xs: 0, sm: 2.5 },
                      minWidth: { xs: 'unset', sm: 'auto' },
                      justifyContent: 'center',
                      borderRadius: { xs: '50%', sm: 24 },
                    }}
                  >
                    {/* Texto oculto en xs */}
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      Editar perfil
                    </Box>
                  </Button>
                </Tooltip>

              </Box>

              {/* Información del usuario */}
              <Box sx={{ mt: 2, ml: 2 }}>
                {/* Username y rol */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Typography level="h4" fontWeight="bold">
                    {user.username}
                  </Typography>
                  <Chip color="neutral" size="sm" variant="soft">
                    {user.role}
                  </Chip>
                </Box>

                {/* Email */}
                <Typography level="body-sm" color="neutral" sx={{ mt: 0.5 }}>
                  {user.email}
                </Typography>

                {/* Nombre completo */}
                <Typography level="body-md" sx={{ mt: 2, color: "neutral.700" }}>
                  {user.fullName}
                </Typography>

                {/* Bio */}
                <Typography level="body-md" sx={{ mt: 2, mb: 3 }}>
                  {user.bio}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Título de la sección Portfolio */}
                <Typography level="h4" sx={{ mb: 2 }}>
                  Portfolio
                </Typography>
              </Box>

              {/* Grid de portfolio */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {portfolioItems.map((item) => (
                  <Grid key={item.id} xs={12} sm={6} md={6}>
                    <Card variant="outlined">
                      <AspectRatio ratio="16/9">
                        <img src={item.src || "/placeholder.svg"} alt={item.title} style={{ objectFit: "cover" }} />
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
