"use client"

import { Box, Typography, Link, Stack, Divider, IconButton, Grid, } from "@mui/joy"
import {
  Movie,
  Tv,
  Campaign,
  Work,
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  GitHub,
  Security,
  Help,
  Info,
  Business,
  Group,
  Folder,
} from "@mui/icons-material"
import XIcon from '@mui/icons-material/X';
import BalanceIcon from '@mui/icons-material/Balance';
import { useColorScheme } from "@mui/joy/styles"

export default function Footer() {
  const { mode } = useColorScheme()

  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        mt: 2,
        background:
          mode === "dark"
            ? "linear-gradient(145deg, rgba(25,25,25,0.95) 0%, rgba(15,15,15,0.8) 100%)"
            : "linear-gradient(145deg, rgba(248,248,248,0.95) 0%, rgba(240,240,240,0.8) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid",
        borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          {/* Columna principal - Nucleav */}
          <Grid xs={12} sm={6} md={4}>
            <Stack spacing={2}>
              {/* Logo y nombre */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "lg",
                    background: "linear-gradient(135deg, #ffbc62 0%, #ff9b44 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(255, 188, 98, 0.3)",
                  }}
                >
                  N
                </Box>
                <Box>
                  <Typography
                    level="h4"
                    sx={{
                      color: "#ffbc62",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    Nucleav
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    Sistema de Gestión Audiovisual
                  </Typography>
                </Box>
              </Box>

              {/* Descripción */}
              <Typography level="body-sm" color="neutral" sx={{ maxWidth: 280 }}>
                Plataforma integral para la gestión de proyectos audiovisuales, materiales y equipos de trabajo
                colaborativo.
              </Typography>

              {/* Estadísticas rápidas */}
              {/* <Sheet
                variant="soft"
                sx={{
                  p: 2,
                  borderRadius: "md",
                  bgcolor: "rgba(255, 188, 98, 0.1)",
                  border: "1px solid rgba(255, 188, 98, 0.2)",
                }}
              >
                <Stack direction="row" spacing={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="title-sm" sx={{ color: "#ffbc62" }}>
                      500+
                    </Typography>
                    <Typography level="body-xs" color="neutral">
                      Proyectos
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="title-sm" sx={{ color: "#ffbc62" }}>
                      1.2K+
                    </Typography>
                    <Typography level="body-xs" color="neutral">
                      Materiales
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography level="title-sm" sx={{ color: "#ffbc62" }}>
                      200+
                    </Typography>
                    <Typography level="body-xs" color="neutral">
                      Usuarios
                    </Typography>
                  </Box>
                </Stack>
              </Sheet> */}
            </Stack>
          </Grid>

          {/* Columna de servicios */}
          <Grid xs={12} sm={6} md={2}>
            <Stack spacing={2}>
              <Typography level="title-sm" sx={{ color: "#ffbc62", fontWeight: 600 }}>
                Servicios
              </Typography>
              <Stack spacing={1}>
                <Link
                  href="/project"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Work sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Gestión de Proyectos
                </Link>
                <Link
                  href="/materials"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Folder sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Control de Materiales
                </Link>
                <Link
                  href="/team"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Group sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Equipos de Trabajo
                </Link>
                <Link
                  href="/company"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Business sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Gestión Empresarial
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* Columna de tipos de proyecto */}
          <Grid xs={12} sm={6} md={2}>
            <Stack spacing={2}>
              <Typography level="title-sm" sx={{ color: "#ffbc62", fontWeight: 600 }}>
                Especialidades
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Movie sx={{ fontSize: 16, color: "#ffbc62" }} />
                  <Typography level="body-sm" color="neutral">
                    Producción Cinematográfica
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tv sx={{ fontSize: 16, color: "#ffbc62" }} />
                  <Typography level="body-sm" color="neutral">
                    Contenido Televisivo
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Campaign sx={{ fontSize: 16, color: "#ffbc62" }} />
                  <Typography level="body-sm" color="neutral">
                    Publicidad y Marketing
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Work sx={{ fontSize: 16, color: "#ffbc62" }} />
                  <Typography level="body-sm" color="neutral">
                    Proyectos Corporativos
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          {/* Columna de soporte y legal */}
          <Grid xs={12} sm={6} md={2}>
            <Stack spacing={2}>
              <Typography level="title-sm" sx={{ color: "#ffbc62", fontWeight: 600 }}>
                Soporte
              </Typography>
              <Stack spacing={1}>
                <Link
                  // href="/help"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Help sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Centro de Ayuda
                </Link>
                <Link
                  // href="/docs"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Info sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Documentación
                </Link>
                <Link
                  // href="/privacy"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<Security sx={{ fontSize: 16 }} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Privacidad
                </Link>
                <Link
                  // href="/terms"
                  color="neutral"
                  level="body-sm"
                  underline="none"
                  startDecorator={<BalanceIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    "&:hover": { color: "#ffbc62" },
                    transition: "color 0.2s",
                  }}
                >
                  Términos de Uso
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* Columna de contacto */}
          <Grid xs={12} sm={12} md={2}>
            <Stack spacing={2}>
              <Typography level="title-sm" sx={{ color: "#ffbc62", fontWeight: 600 }}>
                Contacto
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: "#ffbc62" }} />
                  <Typography level="body-sm" color="neutral">
                    info@nucleav.com
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone sx={{ fontSize: 16, color: "#ffbc62" }} />
                  <Typography level="body-sm" color="neutral">
                    +34 900 123 456
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: "#ffbc62", mt: 0.2 }} />
                  <Typography level="body-sm" color="neutral">
                    Sevilla, España
                  </Typography>
                </Box>
              </Stack>

              {/* Redes sociales */}
              <Box>
                <Typography level="body-sm" sx={{ mb: 1, color: "#ffbc62", fontWeight: 600 }}>
                  Síguenos
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    variant="soft"
                    size="sm"
                    sx={{
                      bgcolor: "rgba(255, 188, 98, 0.1)",
                      color: "#ffbc62",
                      "&:hover": {
                        bgcolor: "rgba(255, 188, 98, 0.2)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <LinkedIn fontSize="small" />
                  </IconButton>
                  <IconButton
                    variant="soft"
                    size="sm"
                    sx={{
                      bgcolor: "rgba(255, 188, 98, 0.1)",
                      color: "#ffbc62",
                      "&:hover": {
                        bgcolor: "rgba(255, 188, 98, 0.2)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <XIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://github.com/Sergioglezzz"
                    target="_blank"
                    rel="sergioglezzz"
                    variant="soft"
                    size="sm"
                    sx={{
                      bgcolor: "rgba(255, 188, 98, 0.1)",
                      color: "#ffbc62",
                      width: 32,
                      height: 32,
                      "&:hover": {
                        bgcolor: "rgba(255, 188, 98, 0.2)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <GitHub sx={{ fontSize: 16 }} />
                  </IconButton>
                  {/* <IconButton
                    variant="soft"
                    size="sm"
                    sx={{
                      bgcolor: "rgba(255, 188, 98, 0.1)",
                      color: "#ffbc62",
                      "&:hover": {
                        bgcolor: "rgba(255, 188, 98, 0.2)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <Language fontSize="small" />
                  </IconButton> */}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, opacity: 0.3 }} />

        {/* Footer bottom */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "center" },
            gap: 2,
          }}
        >
          <Typography level="body-xs" color="neutral" sx={{ textAlign: { xs: "center", sm: "left" } }}>
            © {currentYear} Nucleav. Todos los derechos reservados. Desarrollado con ❤️ para la industria audiovisual.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
              gap: 1,
            }}
          >
            <Typography level="body-xs" color="neutral">
              v2.1.0
            </Typography>
            <Typography level="body-xs" color="neutral">
              •
            </Typography>
            <Link
              // href="/status"
              level="body-xs"
              color="neutral"
              underline="none"
              sx={{
                "&:hover": { color: "#ffbc62" },
                transition: "color 0.2s",
              }}
            >
              Estado del Sistema
            </Link>
            <Typography level="body-xs" color="neutral">
              •
            </Typography>
            <Link
              // href="/api"
              level="body-xs"
              color="neutral"
              underline="none"
              sx={{
                "&:hover": { color: "#ffbc62" },
                transition: "color 0.2s",
              }}
            >
              API
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
