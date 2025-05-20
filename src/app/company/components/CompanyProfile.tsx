"use client"

import { useState } from "react"
// import { useSession } from "next-auth/react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  Avatar,
  Button,
  IconButton,
  Chip,
  Sheet,
  AspectRatio,
  Skeleton,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@mui/joy"
import {
  Business,
  LocationOn,
  Phone,
  Email,
  Language,
  Edit,
  ArrowBack,
  Description,
  CalendarMonth,
  Person,
  VerifiedUser,
  Share,
  ContentCopy,
  InfoOutlined,
  Groups,
  Folder,
  BarChart,
  Delete,
} from "@mui/icons-material"
import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import Image from "next/image"

// Tipo para la empresa
export interface Company {
  cif: string
  name: string
  description: string | null
  address: string | null
  phone: string
  email: string
  website: string | null
  logo_url: string | null
  created_by: number
  is_active: boolean
  created_at: string
  updated_at: string
  creator?: {
    id: number
    name: string
    lastname: string
    username: string
    email: string
  }
}

interface CompanyProfileProps {
  company: Company
  onBack: () => void
  onEdit: (company: Company) => void
  onDelete?: (cif: string) => void;
}

export default function CompanyProfile({ company, onBack, onEdit, onDelete }: CompanyProfileProps) {
  // const router = useRouter()
  const { mode } = useColorScheme()
  // const { data: session, status } = useSession()
  const { showNotification } = useNotification()
  const [activeTab, setActiveTab] = useState<string>("info")

  // const isCreator = company?.created_by === Number(session?.user?.id)

  // Datos simulados para las estadísticas
  const stats = [
    { label: "Proyectos", value: 24, icon: <Folder /> },
    { label: "Miembros", value: 8, icon: <Groups /> },
    { label: "Materiales", value: 156, icon: <Description /> },
  ]

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    showNotification(message)
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Manejar la eliminación de la empresa
  const handleDelete = () => {
    if (company && window.confirm(`¿Estás seguro de que deseas eliminar la empresa ${company.name}?`)) {
      onDelete?.(company.cif);
    }
  }

  return (
    <>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2.3 }}>
        <IconButton
          variant="soft"
          color="neutral"
          onClick={onBack}
          sx={{
            borderRadius: "50%",
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography level="h2" sx={{ color: "#ffbc62" }}>Perfil de Empresa</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Columna izquierda - Información principal */}
        <Grid xs={12} md={4}>
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              overflow: "visible",
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Logo de la empresa */}
              {!company ? (
                <Skeleton variant="circular" width={120} height={120} />
              ) : (
                <Avatar
                  src={company?.logo_url || undefined}
                  alt={company?.name || "Logo de la empresa"}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    boxShadow: "md",
                    border: "4px solid",
                    borderColor: "background.surface",
                  }}
                >
                  {company?.name?.charAt(0) || <Business />}
                </Avatar>
              )}

              {/* Nombre de la empresa */}
              {!company ? (
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
              ) : (
                <Typography level="h3" sx={{ mb: 1, textAlign: "center" }}>
                  {company?.name}
                </Typography>
              )}

              {/* CIF */}
              {!company ? (
                <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
              ) : (
                <Chip
                  variant="soft"
                  color="neutral"
                  size="lg"
                  sx={{ mb: 2, bgcolor: "rgba(255, 188, 98, 0.2)", color: "#ffbc62" }}
                  startDecorator={<VerifiedUser />}
                  endDecorator={
                    <IconButton
                      variant="plain"
                      size="sm"
                      color="neutral"
                      onClick={() => copyToClipboard(company?.cif || "", "CIF copiado al portapapeles")}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  }
                >
                  CIF: {company?.cif}
                </Chip>
              )}

              <Divider sx={{ my: 2, width: "100%" }} />

              {/* Información de contacto */}
              <Stack spacing={2} sx={{ width: "100%" }}>
                {/* Dirección */}
                {!company ? (
                  <Skeleton variant="text" width="100%" height={24} />
                ) : company?.address ? (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <LocationOn sx={{ color: "#ffbc62", mt: 0.5 }} />
                    <Box>
                      <Typography level="body-sm" color="neutral">
                        Dirección
                      </Typography>
                      <Typography level="body-md">{company.address}</Typography>
                    </Box>
                  </Box>
                ) : null}

                {/* Teléfono */}
                {!company ? (
                  <Skeleton variant="text" width="100%" height={24} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Phone sx={{ color: "#ffbc62", mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography level="body-sm" color="neutral">
                        Teléfono
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography level="body-md">{company?.phone}</Typography>
                        <IconButton
                          variant="plain"
                          size="sm"
                          color="neutral"
                          onClick={() => copyToClipboard(company?.phone || "", "Teléfono copiado al portapapeles")}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Email */}
                {!company ? (
                  <Skeleton variant="text" width="100%" height={24} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Email sx={{ color: "#ffbc62", mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography level="body-sm" color="neutral">
                        Email
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography level="body-md">{company?.email}</Typography>
                        <IconButton
                          variant="plain"
                          size="sm"
                          color="neutral"
                          onClick={() => copyToClipboard(company?.email || "", "Email copiado al portapapeles")}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Sitio web */}
                {!company ? (
                  <Skeleton variant="text" width="100%" height={24} />
                ) : company?.website ? (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Language sx={{ color: "#ffbc62", mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography level="body-sm" color="neutral">
                        Sitio web
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography level="body-md">
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "inherit", textDecoration: "underline" }}
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        </Typography>
                        <IconButton
                          variant="plain"
                          size="sm"
                          color="neutral"
                          onClick={() => copyToClipboard(company?.website || "", "Sitio web copiado al portapapeles")}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ) : null}
              </Stack>

              <Divider sx={{ my: 2, width: "100%" }} />

              {/* Información adicional */}
              <Stack spacing={2} sx={{ width: "100%" }}>
                {/* Fecha de creación */}
                {!company ? (
                  <Skeleton variant="text" width="100%" height={24} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <CalendarMonth sx={{ color: "#ffbc62", mt: 0.5 }} />
                    <Box>
                      <Typography level="body-sm" color="neutral">
                        Fecha de creación
                      </Typography>
                      <Typography level="body-md">{formatDate(company?.created_at || "")}</Typography>
                    </Box>
                  </Box>
                )}

                {/* Creador */}
                {!company ? (
                  <Skeleton variant="text" width="100%" height={24} />
                ) : company?.creator ? (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Person sx={{ color: "#ffbc62", mt: 0.5 }} />
                    <Box>
                      <Typography level="body-sm" color="neutral">
                        Creado por
                      </Typography>
                      <Typography level="body-md">
                        {company.creator.name} {company.creator.lastname}
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
              </Stack>

              {/* Botones de acción */}
              <Stack direction="row" spacing={1} sx={{ mt: 3, width: "100%" }}>
                {!company && (
                  <>
                    <Button
                      variant="outlined"
                      color="neutral"
                      startDecorator={<Edit />}
                      onClick={() => company && onEdit(company)}
                      sx={{ flex: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="danger"
                      startDecorator={<Delete />}
                      onClick={handleDelete}
                      sx={{ flex: 1 }}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  color="neutral"
                  startDecorator={<Share />}
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/company/${company?.cif}`,
                      "Enlace copiado al portapapeles",
                    )
                  }
                  sx={{ flex: 1 }}
                >
                  Compartir
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Typography level="title-md" sx={{ mb: 2 }}>
                Estadísticas
              </Typography>
              <Grid container spacing={2}>
                {stats.map((stat) => (
                  <Grid key={stat.label} xs={4}>
                    <Sheet
                      variant="soft"
                      color="neutral"
                      sx={{
                        p: 2,
                        borderRadius: "md",
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          mode === "dark"
                            ? "linear-gradient(145deg, rgba(55,55,55,0.7) 0%, rgba(45,45,45,0.4) 100%)"
                            : "linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.4) 100%)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "rgba(255, 188, 98, 0.2)",
                          color: "#ffbc62",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography level="h3" sx={{ mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography level="body-sm" color="neutral">
                        {stat.label}
                      </Typography>
                    </Sheet>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna derecha - Contenido principal */}
        <Grid xs={12} md={8}>
          <Card
            variant="outlined"
            sx={{
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value as string)}
                sx={{ borderRadius: "lg lg 0 0" }}
              >
                <TabList
                  variant="plain"
                  sx={{
                    p: 0.2,
                    gap: 0.2,
                    flexWrap: "wrap", // por si no caben
                    justifyContent: "center",
                    [`& .MuiTab-root`]: {
                      minWidth: 60,
                      px: 1.5,
                      py: 0.5,
                      flexDirection: "column", // icon arriba, texto debajo
                      alignItems: "center",
                      bgcolor: "transparent",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "transparent" },
                      [`&.Mui-selected`]: {
                        color: "#ffbc62",
                        "&::after": {
                          height: "3px",
                          bgcolor: "#ffbc62",
                        },
                      },
                    },
                  }}
                >
                  <Tab value="info">
                    <InfoOutlined sx={{ display: { xs: "flex", sm: "none" } }} />
                    <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "row", alignItems: "center", mt: 0.5, ml: 0.5, gap: 1 }}> <InfoOutlined />Información</Box>
                  </Tab>
                  <Tab value="projects">
                    <Folder sx={{ display: { xs: "flex", sm: "none" } }} />
                    <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "row", alignItems: "center", mt: 0.5, ml: 0.5, gap: 1 }}> <Folder />Proyectos</Box>
                  </Tab>
                  <Tab value="team">
                    <Groups sx={{ display: { xs: "flex", sm: "none" } }} />
                    <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "row", alignItems: "center", mt: 0.5, ml: 0.5, gap: 1 }}> <Groups /> Equipo</Box>
                  </Tab>
                  <Tab value="stats">
                    <BarChart sx={{ display: { xs: "flex", sm: "none" } }} />
                    <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "row", alignItems: "center", mt: 0.5, ml: 0.5, gap: 1 }}> <BarChart /> Análisis</Box>
                  </Tab>
                </TabList>

                <TabPanel value="info" sx={{ p: 3 }}>
                  {/* Descripción */}
                  <Typography level="title-lg" sx={{ mb: 2, color: "#ffbc62" }}>
                    Sobre la empresa
                  </Typography>

                  {!company ? (
                    <>
                      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="90%" height={20} />
                    </>
                  ) : (
                    <Typography level="body-md" sx={{ mb: 4, whiteSpace: "pre-line" }}>
                      {company?.description || "No hay descripción disponible."}
                    </Typography>
                  )}

                  {/* Imágenes de la empresa (simuladas) */}
                  <Typography level="title-lg" sx={{ mb: 2, mt: 4, color: "#ffbc62" }}>
                    Galería
                  </Typography>

                  {!company ? (
                    <Grid container spacing={2}>
                      {[1, 2, 3].map((i) => (
                        <Grid key={i} xs={12} sm={4}>
                          <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: "md" }} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      {[1, 2, 3].map((i) => (
                        <Grid key={i} xs={12} sm={4}>
                          <AspectRatio ratio="16/9" sx={{ borderRadius: "md", overflow: "hidden" }}>
                            <Image
                              src={`https://picsum.photos/seed/company${i}/400/225`}
                              alt={`Imagen de la empresa ${i}`}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          </AspectRatio>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </TabPanel>

                <TabPanel value="projects" sx={{ p: 3 }}>
                  <Typography level="title-lg" sx={{ mb: 2, color: "#ffbc62" }}>
                    Proyectos recientes
                  </Typography>

                  <Typography level="body-md" sx={{ mb: 2 }}>
                    Aquí se mostrarán los proyectos de la empresa.
                  </Typography>

                  <Box
                    sx={{
                      p: 4,
                      borderRadius: "md",
                      bgcolor: "background.level1",
                      textAlign: "center",
                    }}
                  >
                    <BarChart sx={{ fontSize: 48, color: "neutral.400", mb: 2 }} />
                    <Typography level="body-lg">
                      Esta sección está en desarrollo. Pronto podrás ver todos los proyectos de la empresa.
                    </Typography>
                  </Box>
                </TabPanel>

                <TabPanel value="team" sx={{ p: 3 }}>
                  <Typography level="title-lg" sx={{ mb: 2, color: "#ffbc62" }}>
                    Equipo
                  </Typography>

                  <Typography level="body-md" sx={{ mb: 2 }}>
                    Aquí se mostrarán los miembros del equipo.
                  </Typography>

                  <Box
                    sx={{
                      p: 4,
                      borderRadius: "md",
                      bgcolor: "background.level1",
                      textAlign: "center",
                    }}
                  >
                    <Groups sx={{ fontSize: 48, color: "neutral.400", mb: 2 }} />
                    <Typography level="body-lg">
                      Esta sección está en desarrollo. Pronto podrás ver todos los miembros del equipo.
                    </Typography>
                  </Box>
                </TabPanel>

                <TabPanel value="stats" sx={{ p: 3 }}>
                  <Typography level="title-lg" sx={{ mb: 2, color: "#ffbc62" }}>
                    Análisis y estadísticas
                  </Typography>

                  <Typography level="body-md" sx={{ mb: 2 }}>
                    Aquí se mostrarán estadísticas detalladas.
                  </Typography>

                  <Box
                    sx={{
                      p: 4,
                      borderRadius: "md",
                      bgcolor: "background.level1",
                      textAlign: "center",
                    }}
                  >
                    <BarChart sx={{ fontSize: 48, color: "neutral.400", mb: 2 }} />
                    <Typography level="body-lg">
                      Esta sección está en desarrollo. Pronto podrás ver estadísticas detalladas de la empresa.
                    </Typography>
                  </Box>
                </TabPanel>
              </Tabs>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
