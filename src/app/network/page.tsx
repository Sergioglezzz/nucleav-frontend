"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  IconButton,
  Input,
  Chip,
  Sheet,
  Divider,
  Stack,
  AspectRatio,
  CircularProgress,
  Select,
  Option,
} from "@mui/joy"
import {
  Search,
  FilterList,
  PersonAdd,
  Message,
  Business,
  Person,
  LocationOn,
  Work,
  Check,
  Close,
  Refresh,
  Star,
  StarBorder,
} from "@mui/icons-material"
import Image from "next/image"
import ColumnLayout from "@/components/ColumnLayout"
import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import CustomTabs from "@/components/CustomTabs"

// Tipos para usuarios y empresas
interface User {
  id: number
  name: string
  lastname: string
  username: string
  email: string
  profession: string | null
  role: string
  profile_image_url: string | null
  bio: string | null
  location?: string
  connections?: number
  isConnected?: boolean
  isPending?: boolean
}

interface Company {
  id: number
  cif: string
  name: string
  description: string | null
  address: string | null
  phone: string
  email: string
  website: string | null
  logo_url: string | null
  sector?: string
  employees?: number
  isFollowing?: boolean
}

type ProfileType = "all" | "users" | "companies"

export default function NetworkPage() {
  const { mode } = useColorScheme()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession()
  const { showNotification } = useNotification()
  const [activeTab, setActiveTab] = useState<string>("discover")
  const [searchQuery, setSearchQuery] = useState("")
  const [profileType, setProfileType] = useState<ProfileType>("all")
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<(User | Company)[]>([])

  // Datos simulados para la demostración
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Usuarios de ejemplo
      const mockUsers: User[] = [
        {
          id: 1,
          name: "Ana",
          lastname: "Martínez",
          username: "anamartinez",
          email: "ana@example.com",
          profession: "Directora de Fotografía",
          role: "user",
          profile_image_url: "https://i.pravatar.cc/150?img=5",
          bio: "Directora de fotografía con 10 años de experiencia en cine y publicidad.",
          location: "Madrid, España",
          connections: 245,
          isConnected: false,
          isPending: false,
        },
        {
          id: 2,
          name: "Carlos",
          lastname: "Rodríguez",
          username: "carlosrodriguez",
          email: "carlos@example.com",
          profession: "Editor de Video",
          role: "user",
          profile_image_url: "https://i.pravatar.cc/150?img=8",
          bio: "Editor de video especializado en postproducción para documentales.",
          location: "Barcelona, España",
          connections: 187,
          isConnected: true,
          isPending: false,
        },
        {
          id: 3,
          name: "Laura",
          lastname: "Gómez",
          username: "lauragomez",
          email: "laura@example.com",
          profession: "Productora Audiovisual",
          role: "user",
          profile_image_url: "https://i.pravatar.cc/150?img=9",
          bio: "Productora con experiencia en gestión de proyectos audiovisuales internacionales.",
          location: "Valencia, España",
          connections: 312,
          isConnected: false,
          isPending: true,
        },
        {
          id: 4,
          name: "Miguel",
          lastname: "Fernández",
          username: "miguelfernandez",
          email: "miguel@example.com",
          profession: "Director de Sonido",
          role: "user",
          profile_image_url: "https://i.pravatar.cc/150?img=12",
          bio: "Especialista en diseño sonoro para cine y televisión.",
          location: "Sevilla, España",
          connections: 156,
          isConnected: false,
          isPending: false,
        },
        {
          id: 5,
          name: "Elena",
          lastname: "Sánchez",
          username: "elenasanchez",
          email: "elena@example.com",
          profession: "Guionista",
          role: "user",
          profile_image_url: "https://i.pravatar.cc/150?img=16",
          bio: "Guionista con experiencia en series de televisión y largometrajes.",
          location: "Madrid, España",
          connections: 203,
          isConnected: false,
          isPending: false,
        },
      ]

      // Empresas de ejemplo
      const mockCompanies: Company[] = [
        {
          id: 1,
          cif: "B12345678",
          name: "Producciones Creativas",
          description: "Productora audiovisual especializada en publicidad y documentales.",
          address: "Calle Gran Vía 28, Madrid",
          phone: "+34 912 345 678",
          email: "info@produccionescreativas.com",
          website: "https://www.produccionescreativas.com",
          logo_url: "https://picsum.photos/seed/company1/200/200",
          sector: "Producción Audiovisual",
          employees: 45,
          isFollowing: true,
        },
        {
          id: 2,
          cif: "B87654321",
          name: "Visual Media",
          description: "Agencia de medios especializada en contenido digital y estrategias de comunicación.",
          address: "Avenida Diagonal 211, Barcelona",
          phone: "+34 932 123 456",
          email: "contacto@visualmedia.com",
          website: "https://www.visualmedia.com",
          logo_url: "https://picsum.photos/seed/company2/200/200",
          sector: "Medios Digitales",
          employees: 78,
          isFollowing: false,
        },
        {
          id: 3,
          cif: "B23456789",
          name: "Sonido Profesional",
          description: "Empresa especializada en equipamiento y servicios de sonido para producciones audiovisuales.",
          address: "Calle Serrano 45, Madrid",
          phone: "+34 914 567 890",
          email: "info@sonidoprofesional.com",
          website: "https://www.sonidoprofesional.com",
          logo_url: "https://picsum.photos/seed/company3/200/200",
          sector: "Equipamiento Audiovisual",
          employees: 32,
          isFollowing: false,
        },
      ]

      setUsers(mockUsers)
      setCompanies(mockCompanies)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Filtrar perfiles según búsqueda y tipo
  useEffect(() => {
    let filtered: (User | Company)[] = []

    // Filtrar por tipo de perfil
    if (profileType === "all" || profileType === "users") {
      filtered = [...filtered, ...users]
    }

    if (profileType === "all" || profileType === "companies") {
      filtered = [...filtered, ...companies]
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((profile) => {
        if ("username" in profile) {
          // Es un usuario
          const user = profile as User
          return (
            user.name.toLowerCase().includes(query) ||
            user.lastname.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query) ||
            (user.profession && user.profession.toLowerCase().includes(query))
          )
        } else {
          // Es una empresa
          const company = profile as Company
          return (
            company.name.toLowerCase().includes(query) ||
            (company.description && company.description.toLowerCase().includes(query)) ||
            (company.sector && company.sector.toLowerCase().includes(query))
          )
        }
      })
    }

    // Filtrar por pestaña activa
    if (activeTab === "connections") {
      filtered = filtered.filter((profile) => {
        if ("username" in profile) {
          return (profile as User).isConnected
        } else {
          return (profile as Company).isFollowing
        }
      })
    } else if (activeTab === "pending") {
      filtered = filtered.filter((profile) => {
        if ("username" in profile) {
          return (profile as User).isPending
        }
        return false // Las empresas no tienen solicitudes pendientes
      })
    }

    setFilteredProfiles(filtered)
  }, [users, companies, searchQuery, profileType, activeTab])

  // Función para enviar solicitud de conexión
  const handleConnect = (id: number, isUser: boolean) => {
    if (isUser) {
      setUsers(users.map((user) => (user.id === id ? { ...user, isPending: true } : user)))

      showNotification("Solicitud de conexión enviada", "success")
    } else {
      setCompanies(companies.map((company) => (company.id === id ? { ...company, isFollowing: true } : company)))

      showNotification("Ahora sigues a esta empresa", "success"
      )
    }
  }

  // Función para aceptar solicitud
  const handleAccept = (id: number) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isPending: false, isConnected: true } : user)))

    // showNotification({
    //   message: "Solicitud de conexión aceptada",
    //   severity: "success",
    // })
  }

  // Función para rechazar solicitud
  const handleReject = (id: number) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isPending: false } : user)))

    // showNotification({
    //   message: "Solicitud de conexión rechazada",
    //   severity: "info",
    // })
  }

  // Función para enviar mensaje
  const handleMessage = (id: number, isUser: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const name =
      isUser
        ? users.find((user) => user.id === id)?.name
        : companies.find((company) => company.id === id)?.name

    // showNotification({
    //   message: `Abriendo chat con ${name}`,
    //   severity: "info",
    // })
  }

  // Función para destacar un perfil
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleFavorite = (id: number, isUser: boolean) => {
    // Aquí iría la lógica para destacar perfiles
    // showNotification({
    //   message: isUser ? "Usuario destacado" : "Empresa destacada",
    //   severity: "success",
    // })
  }

  // Determinar si un perfil es un usuario
  const isUserProfile = (profile: User | Company): profile is User => {
    return "username" in profile
  }

  const tabOptions = [
    { value: "discover", label: "Descubrir" },
    { value: "connections", label: "Mis Conexiones" },
    { value: "pending", label: "Pendientes" },
  ]

  return (
    <>
      <ColumnLayout>
        <Box sx={{ mb: 4 }}>
          <Typography level="h1" sx={{ mb: 1, color: "#ffbc62" }}>
            Tu Red Profesional
          </Typography>
          <Typography level="body-lg" color="neutral">
            Conecta con profesionales y empresas del sector audiovisual
          </Typography>
        </Box>

        {/* Barra de búsqueda y filtros */}
        <Sheet
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "lg",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            background:
              mode === "dark"
                ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          <Input
            placeholder="Buscar profesionales o empresas..."
            startDecorator={<Search />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "100%",
              flexGrow: 1,
              "--Input-focusedThickness": "var(--joy-palette-primary-solidBg)",
              "&:hover": {
                borderColor: "primary.solidBg",
              },
              "&:focus-within": {
                borderColor: "primary.solidBg",
                boxShadow: "0 0 0 2px var(--joy-palette-primary-outlinedBorder)",
              },
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              placeholder="Tipo"
              value={profileType}
              onChange={(_, value) => setProfileType(value as ProfileType)}
              startDecorator={<FilterList />}
              size="sm"
              sx={{ minWidth: 120 }}
            >
              <Option value="all">Todos</Option>
              <Option value="users">Profesionales</Option>
              <Option value="companies">Empresas</Option>
            </Select>

            <IconButton
              variant="outlined"
              color="neutral"
              onClick={() => {
                setSearchQuery("")
                setProfileType("all")
              }}
              size="sm"
            >
              <Refresh />
            </IconButton>
          </Stack>
        </Sheet>

        {/* Tabs para navegar entre secciones */}
        <CustomTabs
          options={tabOptions}
          defaultValue={activeTab}
          onChange={(value) => setActiveTab(value)}
        />

        {/* Contenido principal */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <CircularProgress
              size="lg"
              sx={{
                "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
                "--CircularProgress-progressColor": "#ffbc62",
              }}
            />
          </Box>
        ) : filteredProfiles.length === 0 ? (
          <Sheet
            variant="soft"
            sx={{
              p: 4,
              borderRadius: "lg",
              textAlign: "center",
              background:
                mode === "dark"
                  ? "linear-gradient(145deg, rgba(45,45,45,0.4) 0%, rgba(35,35,35,0.2) 100%)"
                  : "linear-gradient(145deg, rgba(250,250,250,0.6) 0%, rgba(240,240,240,0.3) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            }}
          >
            <Typography level="h3" sx={{ mb: 2 }}>
              No se encontraron perfiles
            </Typography>
            <Typography level="body-md" sx={{ mb: 3 }}>
              {activeTab === "discover"
                ? "Intenta con otros términos de búsqueda o filtros"
                : activeTab === "connections"
                  ? "Aún no tienes conexiones. ¡Explora y conecta con profesionales y empresas!"
                  : "No tienes solicitudes pendientes"}
            </Typography>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => {
                setSearchQuery("")
                setProfileType("all")
                setActiveTab("discover")
              }}
              sx={{
                color: "#ffbc62",
                borderColor: "#ffbc62",
                "&:hover": {
                  borderColor: "#ff9b44",
                  bgcolor: "rgba(255, 188, 98, 0.1)",
                },
              }}
            >
              Explorar perfiles
            </Button>
          </Sheet>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {filteredProfiles.map((profile) => (
              <Grid key={isUserProfile(profile) ? `user-${profile.id}` : `company-${profile.id}`} xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "md",
                    },
                    overflow: "hidden",
                    borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    background:
                      mode === "dark"
                        ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {isUserProfile(profile) ? (
                    // Tarjeta de Usuario
                    <>
                      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={profile.profile_image_url || undefined}
                          alt={`${profile.name} ${profile.lastname}`}
                          sx={{
                            width: 60,
                            height: 60,
                            border: "2px solid",
                            borderColor: profile.isConnected ? "#ffbc62" : "transparent",
                          }}
                        >
                          {profile.name[0]}
                          {profile.lastname[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography level="title-md">
                            {profile.name} {profile.lastname}
                          </Typography>
                          <Typography level="body-sm" color="neutral">
                            @{profile.username}
                          </Typography>
                          {profile.profession && (
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              sx={{
                                mt: 0.5,
                                bgcolor: "rgba(255, 188, 98, 0.2)",
                                color: mode === "dark" ? "#ffbc62" : "#ff9b44",
                              }}
                            >
                              {profile.profession}
                            </Chip>
                          )}
                        </Box>
                        <IconButton
                          variant="plain"
                          color="neutral"
                          size="sm"
                          onClick={() => handleToggleFavorite(profile.id, true)}
                        >
                          {Math.random() > 0.5 ? <Star sx={{ color: "#ffbc62" }} /> : <StarBorder />}
                        </IconButton>
                      </Box>

                      <Divider />

                      <CardContent sx={{ flexGrow: 1 }}>
                        {profile.bio && (
                          <Typography level="body-sm" sx={{ mb: 2 }}>
                            {profile.bio.length > 120 ? `${profile.bio.substring(0, 120)}...` : profile.bio}
                          </Typography>
                        )}

                        <Stack spacing={1} sx={{ mb: 2 }}>
                          {profile.location && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocationOn sx={{ fontSize: 18, color: "#ffbc62" }} />
                              <Typography level="body-xs">{profile.location}</Typography>
                            </Box>
                          )}

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Person sx={{ fontSize: 18, color: "#ffbc62" }} />
                            <Typography level="body-xs">{profile.connections} conexiones</Typography>
                          </Box>
                        </Stack>
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                        {profile.isPending ? (
                          // Botones para solicitud pendiente
                          <>
                            <Button
                              variant="solid"
                              color="success"
                              size="sm"
                              startDecorator={<Check />}
                              onClick={() => handleAccept(profile.id)}
                              sx={{ flex: 1 }}
                            >
                              Aceptar
                            </Button>
                            <Button
                              variant="outlined"
                              color="neutral"
                              size="sm"
                              startDecorator={<Close />}
                              onClick={() => handleReject(profile.id)}
                              sx={{ flex: 1 }}
                            >
                              Rechazar
                            </Button>
                          </>
                        ) : profile.isConnected ? (
                          // Botón para enviar mensaje a conexión
                          <Button
                            variant="solid"
                            color="primary"
                            size="sm"
                            startDecorator={<Message />}
                            onClick={() => handleMessage(profile.id, true)}
                            fullWidth
                            sx={{
                              bgcolor: "#ffbc62",
                              "&:hover": {
                                bgcolor: "#ff9b44",
                              },
                            }}
                          >
                            Mensaje
                          </Button>
                        ) : (
                          // Botón para conectar
                          <Button
                            variant="outlined"
                            color="neutral"
                            size="sm"
                            startDecorator={<PersonAdd />}
                            onClick={() => handleConnect(profile.id, true)}
                            fullWidth
                            sx={{
                              color: "#ffbc62",
                              borderColor: "#ffbc62",
                              "&:hover": {
                                borderColor: "#ff9b44",
                                bgcolor: "rgba(255, 188, 98, 0.1)",
                              },
                            }}
                          >
                            Conectar
                          </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    // Tarjeta de Empresa
                    <>
                      <Box sx={{ position: "relative" }}>
                        <AspectRatio ratio="21/9" sx={{ maxHeight: 100 }}>
                          <Image
                            src={`https://picsum.photos/seed/cover${profile.id}/800/400`}
                            alt="Portada"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                        </AspectRatio>
                        <Avatar
                          src={profile.logo_url || undefined}
                          alt={profile.name}
                          sx={{
                            position: "absolute",
                            bottom: -30,
                            left: 20,
                            width: 60,
                            height: 60,
                            border: "3px solid",
                            borderColor: "background.surface",
                            boxShadow: "sm",
                            bgcolor: "background.surface",
                          }}
                        >
                          {profile.name[0]}
                        </Avatar>
                        <Chip
                          size="sm"
                          variant="soft"
                          color="primary"
                          startDecorator={<Business />}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(255, 188, 98, 0.8)",
                            color: "white",
                          }}
                        >
                          Empresa
                        </Chip>
                      </Box>

                      <Box sx={{ mt: 4, p: 2, pt: 0 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography level="title-md">{profile.name}</Typography>
                            {profile.sector && (
                              <Chip
                                size="sm"
                                variant="soft"
                                color="neutral"
                                sx={{
                                  mt: 0.5,
                                  bgcolor: "rgba(255, 188, 98, 0.2)",
                                  color: mode === "dark" ? "#ffbc62" : "#ff9b44",
                                }}
                              >
                                {profile.sector}
                              </Chip>
                            )}
                          </Box>
                          <IconButton
                            variant="plain"
                            color="neutral"
                            size="sm"
                            onClick={() => handleToggleFavorite(profile.id, false)}
                          >
                            {profile.isFollowing ? <Star sx={{ color: "#ffbc62" }} /> : <StarBorder />}
                          </IconButton>
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1 }}>
                        {profile.description && (
                          <Typography level="body-sm" sx={{ mb: 2 }}>
                            {profile.description.length > 100
                              ? `${profile.description.substring(0, 100)}...`
                              : profile.description}
                          </Typography>
                        )}

                        <Stack spacing={1} sx={{ mb: 2 }}>
                          {profile.address && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocationOn sx={{ fontSize: 18, color: "#ffbc62" }} />
                              <Typography level="body-xs">{profile.address}</Typography>
                            </Box>
                          )}

                          {profile.employees && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Work sx={{ fontSize: 18, color: "#ffbc62" }} />
                              <Typography level="body-xs">{profile.employees} empleados</Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                        {profile.isFollowing ? (
                          // Botón para enviar mensaje a empresa que sigues
                          <Button
                            variant="solid"
                            color="primary"
                            size="sm"
                            startDecorator={<Message />}
                            onClick={() => handleMessage(profile.id, false)}
                            fullWidth
                            sx={{
                              bgcolor: "#ffbc62",
                              "&:hover": {
                                bgcolor: "#ff9b44",
                              },
                            }}
                          >
                            Contactar
                          </Button>
                        ) : (
                          // Botón para seguir empresa
                          <Button
                            variant="outlined"
                            color="neutral"
                            size="sm"
                            startDecorator={<Business />}
                            onClick={() => handleConnect(profile.id, false)}
                            fullWidth
                            sx={{
                              color: "#ffbc62",
                              borderColor: "#ffbc62",
                              "&:hover": {
                                borderColor: "#ff9b44",
                                bgcolor: "rgba(255, 188, 98, 0.1)",
                              },
                            }}
                          >
                            Seguir
                          </Button>
                        )}
                      </Box>
                    </>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </ColumnLayout>
    </>
  )
}
