"use client";

import { Box, Button, Card, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <>
      {/* Navbar translúcido */}
      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 2,
          bgcolor: "rgba(255, 255, 255, 0.5)", // fondo blanco con transparencia
          backdropFilter: "blur(10px)", // efecto de desenfoque
          zIndex: 1000,
        }}
      >
        <Typography level="h4">Nucleav</Typography>
        {/* Puedes agregar más elementos al navbar aquí */}
      </Box>

      {/* Contenido principal */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          pt: 8, // espacio superior para evitar solapamiento con el navbar
        }}
      >
        <Card variant="outlined" sx={{ padding: 4, width: "90%", maxWidth: 400 }}>
          <Typography level="h2" sx={{ marginBottom: 1 }}>
            Bienvenido a Nucleav
          </Typography>
          <Typography level="body-md" sx={{ marginBottom: 3 }}>
            Gestiona recursos humanos y materiales en la industria audiovisual
          </Typography>
          <Button onClick={() => router.push("/login")} sx={{ marginBottom: 1 }}>
            Iniciar Sesión
          </Button>
          <Button onClick={() => router.push("/register")} variant="soft">
            Registrarse
          </Button>
        </Card>
      </Box>
    </>
  );
}
