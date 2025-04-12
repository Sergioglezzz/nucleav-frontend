"use client";

import { Box, Button, Card, Input, Typography, Link, Stack, IconButton, Grid } from "@mui/joy";
import { motion } from "framer-motion";
import heroImage from "../../../public/hero4.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useColorScheme } from '@mui/joy/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface RegisterFormValues {
  name: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('* Obligatorio'),
  lastname: Yup.string().required('* Obligatorio'),
  username: Yup.string().required('* Obligatorio'),
  phone: Yup.string().required('* Obligatorio'),
  email: Yup.string().email('Email inválido').required('* Obligatorio'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('* Obligatorio'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirmación requerida'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
        name: values.name,
        lastname: values.lastname,
        username: values.username,
        phone: values.phone,
        email: values.email,
        password: values.password,
        role: 'user',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error en el registro. Por favor, inténtalo de nuevo.');
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
      {/* Botón de cambiar tema */}
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
            {mounted ? (
              <Image
                src={mode === 'light' ? '/Logo-nucleav-light.png' : '/Logo-nucleav-dark.png'}
                alt="NucleAV Logo"
                width={160}
                height={50}
                priority
              />
            ) : (
              // Placeholder mientras no se monta para evitar saltos
              <Box sx={{ width: 160, height: 50 }} />
            )}
          </Stack>

          {/* Formik Form */}
          <Formik
            initialValues={{
              name: '',
              lastname: '',
              username: '',
              phone: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* Columna 1 */}
                  <Grid xs={12} md={6}>
                    <Stack gap={2}>
                      {/* Nombre */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.name && errors.name && (
                            <Typography level="body-xs" color="danger">
                              {errors.name}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="name"
                          placeholder="Nombre"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && !!errors.name}
                        />
                      </Stack>

                      {/* Apellidos */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.lastname && errors.lastname && (
                            <Typography level="body-xs" color="danger">
                              {errors.lastname}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="lastname"
                          placeholder="Apellidos"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.lastname && !!errors.lastname}
                        />
                      </Stack>

                      {/* Nombre de usuario */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.username && errors.username && (
                            <Typography level="body-xs" color="danger">
                              {errors.username}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="username"
                          placeholder="Nombre de usuario"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.username && !!errors.username}
                        />
                      </Stack>

                      {/* Teléfono */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.phone && errors.phone && (
                            <Typography level="body-xs" color="danger">
                              {errors.phone}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="phone"
                          placeholder="Teléfono"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.phone && !!errors.phone}
                        />
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Columna 2 */}
                  <Grid xs={12} md={6}>
                    <Stack gap={2}>
                      {/* Correo electrónico */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.email && errors.email && (
                            <Typography level="body-xs" color="danger">
                              {errors.email}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Correo electrónico"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && !!errors.email}
                        />
                      </Stack>

                      {/* Contraseña */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.password && errors.password && (
                            <Typography level="body-xs" color="danger">
                              {errors.password}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Contraseña"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && !!errors.password}
                        />
                      </Stack>

                      {/* Confirmar contraseña */}
                      <Stack direction="column">
                        <Box sx={{ minHeight: 20, mt: "-6px", ml: 1 }}>
                          {touched.confirmPassword && errors.confirmPassword && (
                            <Typography level="body-xs" color="danger">
                              {errors.confirmPassword}
                            </Typography>
                          )}
                        </Box>
                        <Input
                          name="confirmPassword"
                          type="password"
                          placeholder="Repetir contraseña"
                          variant="soft"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmPassword && !!errors.confirmPassword}
                        />
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Botón */}
                  <Grid xs={12}>
                    <Button type="submit" fullWidth variant="solid" color="primary" sx={{ mt: 2 }}>
                      Registrarse
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

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
