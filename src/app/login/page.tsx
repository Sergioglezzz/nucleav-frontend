"use client";

import { Box, Button, Card, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography level="h3" mb={2}>Iniciar Sesión</Typography>
        {/* Formulario provisional */}
        <Button fullWidth onClick={() => router.push("/welcome")}>
          Entrar
        </Button>
      </Card>
    </Box>
  );
}
