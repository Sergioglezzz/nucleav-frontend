"use client";

import { Box, Button, Typography, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import heroImage from "../../public/hero.png";

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
          justifyContent: "space-between",
          minHeight: "100vh",
          maxWidth: "1200px", // 👈 Limita el ancho máximo del contenido
          mx: "auto",         // 👈 Centrado horizontal
          px: { xs: 2, md: 4 }, // padding lateral
          py: { xs: 10, md: 4 }, // padding vertical
          gap: { xs: 6, md: 8 }, // separación entre texto e imagen
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
          <Typography
            level="h1"
            fontSize={{ xs: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="lg"
            mb={2}
          >
            ¡Gestiona tus proyectos audiovisuales con eficiencia!
          </Typography>

          <Typography
            level="body-lg"
            mb={3}
            sx={{
              maxWidth: "90%",
              mx: { xs: "auto", md: "0" },
            }}
          >
            Plataforma inteligente para organizar equipos humanos, materiales y eventos en la industria audiovisual.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Button
              size="lg"
              color="primary"
              onClick={() => router.push("/login")}
            >
              Iniciar Sesión
            </Button>
            <Button
              size="lg"
              variant="soft"
              color="neutral"
              onClick={() => router.push("/register")}
            >
              Registrarse
            </Button>
          </Stack>
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
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "1000px",
            }}
          >
            <Image
              src={heroImage}
              alt="Ilustración de bienvenida"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain", // 👈 mantiene proporciones
              }}
              priority
            />
          </motion.div>
        </Box>
      </Box>
    </>
  );
}
