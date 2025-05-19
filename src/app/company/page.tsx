"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, Grid, Input, IconButton, Sheet, CircularProgress, Alert, Divider } from "@mui/joy"
import { Add, Search, FilterList, Business, SortByAlpha, Clear } from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
import { useNotification } from "@/components/context/NotificationContext"
import CompanyProfile, { type Company } from "@/components/company/CompanyProfile"
import CompanyCard from "@/components/company/CompanyCard"
import axios from "axios"
import CustomTabs from "@/components/CustomTabs"

export default function CompaniesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { showNotification } = useNotification()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>("my")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const tabOptions = [
    { value: "my", label: "Mis empresas" },
    { value: "all", label: "Todas las empresas" },
  ]

  // Cargar empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      if (status !== "authenticated" || !session?.accessToken) return

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        setCompanies(response.data)
      } catch (error) {
        console.error("Error al cargar las empresas:", error)
        setError("No se pudieron cargar las empresas")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [session, status])

  // Filtrar empresas según la búsqueda y la pestaña activa
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") {
      return matchesSearch
    } else if (activeTab === "my") {
      return matchesSearch && company.created_by === Number(session?.user?.id)
    }

    return matchesSearch
  })

  // Navegar a la página de creación de empresa
  const handleCreateCompany = () => {
    router.push("/company/create")
  }

  // Navegar a la página de edición de empresa
  const handleEditCompany = (company: Company) => {
    router.push(`/company/edit/${company.cif}`)
  }

  // Navegar a la página de detalle de empresa
  const handleSelectCompany = (company: Company) => {
    router.push(`/company/${company.cif}`)
  }

  // Manejar la eliminación de una empresa
  const handleDeleteCompany = async (cif: string) => {
    if (!session?.accessToken) {
      showNotification("Debes iniciar sesión para realizar esta acción", "error")
      return
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${cif}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      setCompanies((prev) => prev.filter((c) => c.cif !== cif))
      setSelectedCompany(null)
      showNotification("Empresa eliminada correctamente", "success")
    } catch (error) {
      console.error("Error al eliminar la empresa:", error)
      showNotification("No se pudo eliminar la empresa", "error")
    }
  }

  return (
    <ColumnLayout>
      {error && (
        <Alert color="danger" variant="soft" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Si hay una empresa seleccionada, mostrar su perfil */}
      {selectedCompany ? (
        <CompanyProfile
          company={selectedCompany}
          onBack={() => setSelectedCompany(null)}
          onEdit={() => handleEditCompany(selectedCompany)}
          onDelete={handleDeleteCompany}
        />
      ) : (
        <>
          {/* Cabecera */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography level="h2" sx={{ color: "#ffbc62" }}>
              Empresa
            </Typography>
            <Button
              variant="solid"
              startDecorator={<Add />}
              onClick={handleCreateCompany}
              sx={{
                bgcolor: "#ffbc62",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 188, 98, 0.8)",
                },
              }}
            >
              Nueva Empresa
            </Button>
          </Box>

          <CustomTabs options={tabOptions} defaultValue={activeTab} onChange={(value) => setActiveTab(value)} />

          {/* Barra de búsqueda */}
          <Sheet
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: "md",
              mb: 3,
              gap: 1,
            }}
          >
            <Search sx={{ color: "text.tertiary" }} />
            <Input
              variant="plain"
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: 1,
                border: "none",
                "&::before": {
                  display: "none",
                },
              }}
            />
            {searchTerm && (
              <IconButton
                variant="plain"
                color="neutral"
                onClick={() => setSearchTerm("")}
                sx={{ borderRadius: "50%" }}
              >
                <Clear />
              </IconButton>
            )}
            <Divider orientation="vertical" />
            <IconButton variant="plain" color="neutral" sx={{ borderRadius: "50%" }}>
              <FilterList />
            </IconButton>
            <IconButton variant="plain" color="neutral" sx={{ borderRadius: "50%" }}>
              <SortByAlpha />
            </IconButton>
          </Sheet>

          {/* Lista de empresas */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress
                size="lg"
                sx={{
                  "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
                  "--CircularProgress-progressColor": "#ffbc62",
                }}
              />
            </Box>
          ) : filteredCompanies.length === 0 ? (
            <Box
              sx={{
                p: 4,
                borderRadius: "md",
                bgcolor: "background.level1",
                textAlign: "center",
              }}
            >
              <Business sx={{ fontSize: 48, color: "neutral.400", mb: 2 }} />
              <Typography level="h4" sx={{ mb: 1 }}>
                No se encontraron empresas
              </Typography>
              <Typography level="body-md" sx={{ mb: 3, color: "text.secondary" }}>
                {searchTerm
                  ? "No hay empresas que coincidan con tu búsqueda"
                  : activeTab === "my"
                    ? "Aún no has creado ninguna empresa"
                    : "No hay empresas disponibles"}
              </Typography>
              <Button
                variant="solid"
                startDecorator={<Add />}
                onClick={handleCreateCompany}
                sx={{
                  bgcolor: "#ffbc62",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 188, 98, 0.8)",
                  },
                }}
              >
                Crear empresa
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCompanies.map((company) => (
                <Grid key={company.cif} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
                  <CompanyCard
                    company={company}
                    onSelect={handleSelectCompany}
                    onEdit={() => handleEditCompany(company)}
                    onDelete={handleDeleteCompany}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </ColumnLayout>
  )
}
