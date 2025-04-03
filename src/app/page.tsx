"use client";

import { Box, Button, Typography, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import heroImage from "../../public/hero.png"; // Asegúrate de tener una imagen aquí

export default function WelcomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* Contenido principal responsivo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          px: 4,
          gap: 4,
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
          <Typography level="h1" fontSize="3xl" fontWeight="lg" mb={2}>
            Bienvenido a Nucleav
          </Typography>
          <Typography level="body-lg" mb={3}>
            Plataforma inteligente para gestionar recursos humanos y materiales en la industria audiovisual.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent={{ xs: "center", md: "flex-start" }}>
            <Button color="primary" onClick={() => router.push("/login")}>
              Iniciar Sesión
            </Button>
            <Button variant="soft" color="neutral" onClick={() => router.push("/register")}>
              Registrarse
            </Button>
          </Stack>
        </Box>

        {/* Imagen o animación */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Image
            src={heroImage}
            alt="Ilustración de bienvenida"
            style={{ maxWidth: "100%", height: "auto" }}
            priority
          />
        </Box>
      </Box>
    </>
  );
}
