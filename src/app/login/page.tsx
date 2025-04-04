"use client";

import { Box, Button, Card, Typography, Input, Link, Stack, IconButton } from "@mui/joy";
import Image from "next/image";
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useRouter } from "next/navigation";
import { useColorScheme } from '@mui/joy/styles'
import { motion } from "framer-motion";
import heroImage from "../../../public/hero.png";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function LoginPage() {
  const router = useRouter();
  const { mode, setMode } = useColorScheme();

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        px: 2,
        py: 2,
      }}
      direction="column"
    >
      {/* Botón de cambiar tema arriba a la derecha */}
      <Stack direction="row" justifyContent="flex-end">
        <IconButton
          variant="soft"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Stack>

      {/* Contenido principal: Card + Imagen */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        gap={4}
      >
        {/* Login Card */}
        <Card sx={{ p: 4, width: "100%", maxWidth: 400, position: "relative" }}>
          {/* Botón de retroceso - ahora a la izquierda */}
          <IconButton
            variant="plain"
            size="sm"
            onClick={() => router.back()}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              padding: "6px", // Ajustar padding para centrar mejor
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowBackIosIcon fontSize="small" sx={{
              marginRight: -1,
            }} />
          </IconButton>

          {/* Logo centrado */}
          <Stack direction="row" justifyContent="center" sx={{ my: -7 }}>
            {mode === "light" ? (
              <Image
                src="/Logo-nucleav-light.png"
                alt="NucleAV Logo Light"
                width={200}
                height={200}
                priority
              />
            ) : (
              <Image
                src="/Logo-nucleav-dark.png"
                alt="NucleAV Logo Dark"
                width={200}
                height={200}
                priority
              />
            )}
          </Stack>

          {/* Formulario */}
          <Box component="form" noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Input type="text" name="username" placeholder="Nombre de usuario" required variant="soft" />
            <Input type="password" name="password" placeholder="Contraseña" required variant="soft" />
            <Button type="submit" fullWidth variant="solid">
              Iniciar Sesión
            </Button>
          </Box>

          {/* Links */}
          <Typography level="body-sm" mt={2} textAlign="center">
            ¿No tienes cuenta?{" "}
            <Link underline="hover" onClick={() => router.push("/register")}>
              Regístrate
            </Link>
          </Typography>

          <Typography level="body-xs" mt={1} textAlign="center">
            <Link underline="hover" onClick={() => router.push("/forgot-password")}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Typography>
        </Card>



        {/* Imagen a la derecha */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }} // Rotar de 0° a 3°, a -3°, luego a 0°
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            style={{ width: "100%" }}
          >
            <Image
              src={heroImage}
              alt="Ilustración de bienvenida"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </motion.div>
        </Box>
      </Stack>
    </Stack>


  );
}
