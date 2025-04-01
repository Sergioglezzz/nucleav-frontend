import { Box, Button, Card, Typography } from "@mui/joy";
import { useRouter } from "next/router";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
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
  );
}
