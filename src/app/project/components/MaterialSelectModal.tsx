"use client"

import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Box,
  Select,
  Option,
  Input,
  FormControl,
  FormLabel,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Sheet,
} from "@mui/joy"
import { Add, Search, Folder } from "@mui/icons-material"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

interface Material {
  id: number
  name: string
  description?: string
  category?: string
  location?: string
  serial_number?: string
  is_consumable: boolean
  quantity: number
}

interface MaterialSelectModalProps {
  open: boolean
  onClose: () => void
  onAddMaterial: (materialId: number, quantity: number) => void
  projectId: number
}

export default function MaterialSelectModal({ open, onClose, onAddMaterial, }: MaterialSelectModalProps) {
  const { data: session } = useSession()
  const [materials, setMaterials] = useState<Material[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Cargar materiales disponibles
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!open || !session?.accessToken) return

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/materials`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const materialsData = response.data.data || response.data || []
        setMaterials(materialsData)
        setFilteredMaterials(materialsData)
      } catch (err: unknown) {
        console.error("Error al cargar materiales:", err)
        setError("No se pudieron cargar los materiales disponibles")
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [open, session?.accessToken])

  // Filtrar materiales
  useEffect(() => {
    let filtered = materials

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (material) =>
          material.name.toLowerCase().includes(query) ||
          material.description?.toLowerCase().includes(query) ||
          material.category?.toLowerCase().includes(query),
      )
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter((material) => material.category === categoryFilter)
    }

    setFilteredMaterials(filtered)
  }, [materials, searchQuery, categoryFilter])

  // Obtener categorías únicas
  const categories = Array.from(new Set(materials.map((m) => m.category).filter(Boolean)))

  // Manejar selección de material
  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material)
    setQuantity(1)
  }

  // Manejar adición de material
  const handleAdd = () => {
    if (!selectedMaterial) return

    onAddMaterial(selectedMaterial.id, quantity)
    handleClose()
  }

  // Cerrar modal y limpiar estado
  const handleClose = () => {
    setSelectedMaterial(null)
    setQuantity(1)
    setSearchQuery("")
    setCategoryFilter("all")
    setError(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: { xs: "95vw", sm: 600 },
          width: "100%",
          maxHeight: { xs: "90vh", sm: "80vh" },
          overflow: "auto",
        }}
      >
        <ModalClose />

        <Typography level="h4" sx={{ mb: 2, color: "#ffbc62" }}>
          Agregar Material al Proyecto
        </Typography>

        {error && (
          <Alert variant="soft" color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Input
            placeholder="Buscar materiales..."
            startDecorator={<Search />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />

          <Select
            placeholder="Filtrar por categoría"
            value={categoryFilter}
            onChange={(_, value) => setCategoryFilter(value as string)}
            size="sm"
          >
            <Option value="all">Todas las categorías</Option>
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Stack>

        {/* Lista de materiales */}
        <Box sx={{ mb: 3, maxHeight: 300, overflow: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size="sm" />
            </Box>
          ) : filteredMaterials.length === 0 ? (
            <Sheet
              variant="soft"
              sx={{
                p: 3,
                borderRadius: "md",
                textAlign: "center",
                bgcolor: "background.level1",
              }}
            >
              <Typography level="body-sm" color="neutral">
                {searchQuery || categoryFilter !== "all"
                  ? "No se encontraron materiales con los filtros aplicados"
                  : "No hay materiales disponibles"}
              </Typography>
            </Sheet>
          ) : (
            <Stack spacing={1}>
              {filteredMaterials.map((material) => (
                <Sheet
                  key={material.id}
                  variant={selectedMaterial?.id === material.id ? "solid" : "outlined"}
                  color={selectedMaterial?.id === material.id ? "primary" : "neutral"}
                  sx={{
                    p: 2,
                    borderRadius: "md",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: selectedMaterial?.id === material.id ? undefined : "background.level1",
                    },
                    ...(selectedMaterial?.id === material.id && {
                      bgcolor: "rgba(255, 188, 98, 0.2)",
                      borderColor: "#ffbc62",
                      color: "inherit",
                    }),
                  }}
                  onClick={() => handleMaterialSelect(material)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "md",
                        bgcolor: selectedMaterial?.id === material.id ? "#ffbc62" : "rgba(255, 188, 98, 0.2)",
                        color: selectedMaterial?.id === material.id ? "white" : "#ffbc62",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Folder />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography level="body-sm" fontWeight="md">
                        {material.name}
                      </Typography>
                      <Typography level="body-xs" color="neutral">
                        {material.category && `${material.category} • `}
                        Disponible: {material.quantity}
                        {material.location && ` • ${material.location}`}
                      </Typography>
                      {material.description && (
                        <Typography
                          level="body-xs"
                          color="neutral"
                          sx={{
                            mt: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {material.description}
                        </Typography>
                      )}
                    </Box>
                    <Chip variant="soft" size="sm" color={material.is_consumable ? "warning" : "primary"}>
                      {material.is_consumable ? "Consumible" : "Reutilizable"}
                    </Chip>
                  </Box>
                </Sheet>
              ))}
            </Stack>
          )}
        </Box>

        {/* Selección de cantidad */}
        {selectedMaterial && (
          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Cantidad a asignar al proyecto</FormLabel>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(selectedMaterial.quantity, Number(e.target.value))))}
              slotProps={{
                input: {
                  min: 1,
                  max: selectedMaterial.quantity,
                },
              }}
              endDecorator={
                <Typography level="body-xs" color="neutral">
                  / {selectedMaterial.quantity}
                </Typography>
              }
            />
          </FormControl>
        )}

        {/* Acciones */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" color="neutral" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="solid"
            startDecorator={<Add />}
            onClick={handleAdd}
            disabled={!selectedMaterial}
            sx={{
              bgcolor: "#ffbc62",
              color: "white",
              "&:hover": {
                bgcolor: "#ff9b44",
              },
              "&:disabled": {
                bgcolor: "rgba(255, 188, 98, 0.4)",
                color: "rgba(255, 255, 255, 0.6)",
              },
            }}
          >
            Agregar Material
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
