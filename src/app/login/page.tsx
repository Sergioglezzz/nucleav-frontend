"use client";

import { Box, Button, Card, Typography, Input, Link, Stack, IconButton } from "@mui/joy";
import Image from "next/image";
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useRouter } from "next/navigation";
import { useColorScheme } from '@mui/joy/styles'
import { motion } from "framer-motion";
import heroImage from "../../../public/hero3.png";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function LoginPage() {
  const router = useRouter();
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/login`, {
        email,
        password,
      });

      const { token } = response.data; // Asumimos que el backend devuelve un token

      localStorage.setItem('token', token); // Guardamos token de sesión
      localStorage.setItem('isAuthenticated', 'true'); // Opcional, flag simple
      router.push('/dashboard'); // Redirigir al dashboard
    } catch (error) {
      console.error('Error en login:', error);
      alert('Credenciales incorrectas o usuario no existe.');
    }
  };


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
        ¡Listos para trabajar juntos!
      </Typography>

      {/* Contenido principal: Card + Imagen */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        mt={4}
        gap={4}
      >
        {/* Login Card */}
        <Card sx={{
          p: 4,
          flexBasis: { xs: "100%", md: "400px" }, // ancho base
          flexShrink: 0,
          flexGrow: 0,
          width: "100%",
          maxWidth: "400px",
          position: "relative",
        }}>
          {/* Botón de retroceso - ahora a la izquierda */}
          <IconButton
            variant="plain"
            size="sm"
            onClick={() => router.push("/")}
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
          <Stack direction="row" justifyContent="center" sx={{ my: 1 }} >
            {mounted ? (
              <Image
                src={mode === 'light' ? '/Logo-nucleav-light.png' : '/Logo-nucleav-dark.png'}
                alt="NucleAV Logo"
                width={160}
                height={50}
                priority
              />
            ) : (
              <Box sx={{ width: 160, height: 50 }} />
            )}
          </Stack>

          {/* Formulario */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Input type="email" name="email" placeholder="Email" required variant="soft" value={email}
              onChange={(e) => setEmail(e.target.value)} sx={{
                "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                "&:hover": {
                  borderColor: "primary.solidBg",
                },
                "&:focus-within": {
                  borderColor: "primary.solidBg",
                  boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                },
              }} />
            <Input type="password" name="password" placeholder="Contraseña" required variant="soft" value={password}
              onChange={(e) => setPassword(e.target.value)} sx={{
                "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
                "&:hover": {
                  borderColor: "primary.solidBg",
                },
                "&:focus-within": {
                  borderColor: "primary.solidBg",
                  boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
                },
              }} />
            <Button type="submit" fullWidth variant="solid">
              Iniciar Sesión
            </Button>
          </Box>

          {/* Links */}
          <Typography level="body-sm" mt={2} textAlign="center">
            ¿No tienes cuenta?{" "}
            <Link
              color="primary"
              underline="hover"
              onClick={() => router.push("/register")}
              sx={{ color: '#ffbc62' }}
            >
              Regístrate
            </Link>
          </Typography>

          <Typography level="body-xs" mt={1} textAlign="center">
            <Link
              color="primary"
              underline="hover"
              onClick={() => router.push("/forgot-password")}
              sx={{ color: '#ffbc62' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Typography>

        </Card>



        {/* Imagen a la derecha */}
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
