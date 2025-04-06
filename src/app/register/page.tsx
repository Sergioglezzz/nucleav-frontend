"use client";

import { Box, Button, Card, Input, Typography, Link, Stack, IconButton, Grid } from "@mui/joy";
import { motion } from "framer-motion";
import heroImage from "../../../public/hero4.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useColorScheme } from '@mui/joy/styles'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function RegisterPage() {
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
          sx={{ mt: 1 }}
        >
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Stack>
      {/* Texto principal */}
      <Typography
        level="h1"
        textAlign="center"
        fontWeight="lg"
        sx={{
          mt: { xs: 4, md: 4 },
          mb: { xs: 1, md: 2 },
        }}
      >
        ¡Crea tu cuenta y empieza tu viaje!
      </Typography>
      {/* Contenido principal: Card + Imagen */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        mt={4}
        gap={4}
      >
        <Card sx={{ p: 4, width: "100%", maxWidth: 800, position: "relative" }}>
          {/* Botón de retroceso */}
          <IconButton
            variant="plain"
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
            }}
          >
            <ArrowBackIosIcon fontSize="small" sx={{ marginRight: -1 }} />
          </IconButton>

          {/* Logo centrado */}
          <Stack direction="row" justifyContent="center" sx={{ my: 1 }} >
            {mode === "light" ? (
              <Image
                src="/Logo-nucleav-light.png"
                alt="NucleAV Logo Light"
                width={160}
                height={50}
                priority
              />
            ) : (
              <Image
                src="/Logo-nucleav-dark.png"
                alt="NucleAV Logo Dark"
                width={170}
                height={50}
                priority
              />
            )}
          </Stack>

          {/* Formulario de Registro */}
          <Grid
            container
            spacing={2}
            component="form"
            noValidate
          >
            {/* Columna 1 */}
            <Grid xs={12} md={6}>
              <Stack gap={2}>
                <Input
                  name="name"
                  placeholder="Nombre"
                  required
                  variant="soft"
                />
                <Input
                  name="lastname"
                  placeholder="Apellidos"
                  required
                  variant="soft"
                />
                <Input
                  name="username"
                  placeholder="Nombre de usuario"
                  required
                  variant="soft"
                />
                <Input
                  name="phone"
                  placeholder="Teléfono"
                  required
                  variant="soft"
                />
              </Stack>
            </Grid>

            {/* Columna 2 */}
            <Grid xs={12} md={6}>
              <Stack gap={2}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  required
                  variant="soft"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  required
                  variant="soft"
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repetir contraseña"
                  required
                  variant="soft"
                />
              </Stack>
            </Grid>

            {/* Botón de registro */}
            <Grid xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="solid"
                color="primary"
                sx={{ mt: 2 }}
              >
                Registrarse
              </Button>
            </Grid>
          </Grid>

          {/* Link a login */}
          <Typography level="body-sm" mt={2} textAlign="center">
            ¿Ya tienes cuenta?{" "}
            <Link
              color="primary"
              underline="hover"
              onClick={() => router.push("/login")}
              sx={{ color: '#ffbc62' }}
            >
              Iniciar sesión
            </Link>
          </Typography>
        </Card>
        {/* Imagen a la derecha */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 500,
            minWidth: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }} // Rotar de 0° a 3°, a -3°, luego a 0°
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            style={{ width: "100%", height: "auto" }}
          >
            <Image
              src={heroImage}
              alt="Ilustración de bienvenida"
              style={{ width: "100%", height: "auto", objectFit: "contain", }}
              priority
            />
          </motion.div>
        </Box>
      </Stack>
    </Stack>
  );
}
