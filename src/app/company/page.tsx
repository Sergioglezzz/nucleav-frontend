"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Grid,
  Input,
  IconButton,
  Sheet,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/joy"
import { Add, Search, FilterList, Business, SortByAlpha, Clear } from "@mui/icons-material"
import ColumnLayout from "@/components/ColumnLayout"
// import { useColorScheme } from "@mui/joy/styles"
import { useNotification } from "@/components/context/NotificationContext"
import CompanyProfile, { type Company } from "@/components/company/CompanyProfile"
import CompanyCard from "@/components/company/CompanyCard"
import CompanyFormModal from "@/app/company/CompanyFormModal"
import axios from "axios"
import CustomTabs from "@/components/CustomTabs"

export default function CompaniesPage() {
  // const router = useRouter()
  // const { mode } = useColorScheme()
  const { data: session, status } = useSession()
  const { showNotification } = useNotification()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>("my")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isEditing, setIsEditing] = useState(false)

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

  // Manejar la creación de una empresa
  const handleCreateCompany = async (
    companyData: Omit<Company, "created_at" | "updated_at" | "created_by" | "is_active">,
  ) => {
    if (!session?.accessToken) {
      showNotification("Debes iniciar sesión para realizar esta acción", "error")
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/companies`,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      )

      const createdCompany = response.data as Company
      setCompanies((prev) => [...prev, createdCompany])
      showNotification("Empresa creada correctamente", "success")
      setIsFormModalOpen(false)
    } catch (error) {
      console.error("Error al crear empresa:", error)

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showNotification("Ya existe una empresa con este CIF", "error")
      } else {
        showNotification("No se pudo crear la empresa", "error")
      }
    }

  }


  // Manejar la edición de una empresa
  const handleEditCompany = async (
    companyData: Omit<Company, "created_at" | "updated_at" | "created_by" | "is_active">,
  ) => {
    if (!session?.accessToken) {
      showNotification("Debes iniciar sesión para realizar esta acción", "error")
      return
    }

    setIsEditing(true)

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${companyData.cif}`,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      )

      const updatedCompany = response.data as Company

      setCompanies((prev) =>
        prev.map((company) => (company.cif === updatedCompany.cif ? updatedCompany : company))
      )

      if (selectedCompany?.cif === updatedCompany.cif) {
        setSelectedCompany(updatedCompany)
      }

      showNotification("Empresa actualizada correctamente", "success")
      setEditingCompany(null)
    } catch (error) {
      console.error("Error al actualizar la empresa:", error)
      showNotification("No se pudo actualizar la empresa", "error")
    } finally {
      setIsEditing(false)
    }
  }



  // Manejar la eliminación de una empresa
  const handleDeleteCompany = async (company: Company) => {
    if (!session?.accessToken) {
      showNotification("Debes iniciar sesión para realizar esta acción", "error")
      return
    }

    try {
      // Aquí se haría la llamada a la API para eliminar la empresa
      // Por ahora, simulamos una respuesta exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Eliminar la empresa del estado local
      const updatedCompanies = companies.filter((c) => c.cif !== company.cif)
      setCompanies(updatedCompanies)

      // Si la empresa que se está eliminando es la seleccionada, volver a la lista
      if (selectedCompany && selectedCompany.cif === company.cif) {
        setSelectedCompany(null)
      }

      showNotification("Empresa eliminada correctamente", "success")
    } catch (error) {
      console.error("Error al eliminar la empresa:", error)
      showNotification("No se pudo eliminar la empresa", "error")
    }
  }

  // Abrir el modal de edición
  const openEditModal = (company: Company) => {
    setEditingCompany(company)
  }

  // Manejar el envío del formulario (crear o editar)
  const handleFormSubmit = (values: Omit<Company, "created_at" | "updated_at" | "created_by" | "is_active">) => {
    if (editingCompany) {
      handleEditCompany(values)
    } else {
      handleCreateCompany(values)
    }
  }

  return (
    <>
      <ColumnLayout>
        {error && (
          <Alert color="danger" variant="soft" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Si hay una empresa seleccionada, mostrar su perfil */}
        {selectedCompany ? (
          <CompanyProfile
            companyId={selectedCompany.cif}
            onBack={() => setSelectedCompany(null)}
            onEdit={openEditModal}
            onDelete={handleDeleteCompany}
          />
        ) : (
          <>
            {/* Cabecera */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography level="h2" sx={{ color: "#ffbc62" }}>Empresa</Typography>
              <Button
                variant="solid"
                startDecorator={<Add />}
                onClick={() => {
                  setEditingCompany(null)
                  setIsFormModalOpen(true)
                }}
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

            <CustomTabs
              options={tabOptions}
              defaultValue={activeTab}
              onChange={(value) => setActiveTab(value)}
            />

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
                  onClick={() => {
                    setEditingCompany(null)
                    setIsFormModalOpen(true)
                  }}
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
                      onSelect={setSelectedCompany}
                      onEdit={openEditModal}
                      onDelete={handleDeleteCompany}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Modal de formulario (crear/editar) */}
        <CompanyFormModal
          open={isFormModalOpen || !!editingCompany}
          onClose={() => {
            setIsFormModalOpen(false)
            setEditingCompany(null)
          }}
          onSubmit={handleFormSubmit}
          initialValues={editingCompany || undefined}
          isEdit={!!editingCompany}
          loading={isEditing}
        />
      </ColumnLayout>
    </>
  )
}
