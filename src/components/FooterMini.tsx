"use client"

import { Box, Typography, Link, Stack, IconButton } from "@mui/joy"
import { LinkedIn, GitHub, Help, Security } from "@mui/icons-material"
import XIcon from '@mui/icons-material/X';
import BalanceIcon from '@mui/icons-material/Balance';
import { useColorScheme } from "@mui/joy/styles"

export default function FooterMini() {
  const { mode } = useColorScheme()
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        background:
          mode === "dark"
            ? "linear-gradient(145deg, rgba(25,25,25,0.95) 0%, rgba(15,15,15,0.8) 100%)"
            : "linear-gradient(145deg, rgba(248,248,248,0.95) 0%, rgba(240,240,240,0.8) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid",
        borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", sm: "center" }}
          spacing={{ xs: 3, sm: 2 }}
        >
          {/* Logo y nombre compacto */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "lg",
                background: "linear-gradient(135deg, #ffbc62 0%, #ff9b44 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(255, 188, 98, 0.3)",
              }}
            >
              N
            </Box>
            <Box>
              <Typography
                level="title-md"
                sx={{
                  color: "#ffbc62",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                Nucleav
              </Typography>
              <Typography level="body-xs" color="neutral">
                Gestión Audiovisual
              </Typography>
            </Box>
          </Box>

          {/* Enlaces rápidos */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems="center"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            <Link
              // href="/help"
              color="neutral"
              level="body-sm"
              underline="none"
              startDecorator={<Help sx={{ fontSize: 14 }} />}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { color: "#ffbc62" },
                transition: "color 0.2s",
              }}
            >
              Ayuda
            </Link>
            <Link
              // href="/privacy"
              color="neutral"
              level="body-sm"
              underline="none"
              startDecorator={<Security sx={{ fontSize: 14 }} />}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
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
              startDecorator={<BalanceIcon sx={{ fontSize: 14 }} />}
              sx={{
                "&:hover": { color: "#ffbc62" },
                transition: "color 0.2s",
              }}
            >
              Términos
            </Link>
          </Stack>

          {/* Redes sociales compactas */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
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
              <LinkedIn sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
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
              <XIcon sx={{ fontSize: 16 }} />
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
                width: 32,
                height: 32,
                "&:hover": {
                  bgcolor: "rgba(255, 188, 98, 0.2)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s",
              }}
            >
              <Language sx={{ fontSize: 16 }} />
            </IconButton> */}
          </Stack>
        </Stack>

        {/* Copyright compacto */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography level="body-xs" color="neutral" sx={{ textAlign: { xs: "center", sm: "left" } }}>
            © {currentYear} Nucleav. Todos los derechos reservados.  Desarrollado con ❤️ para la industria audiovisual.
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
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
              Estado
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
