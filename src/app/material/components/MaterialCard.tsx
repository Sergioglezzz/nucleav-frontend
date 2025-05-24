"use client"

import type React from "react"

import { useState } from "react"
import { Card, AspectRatio, Chip, Box, Typography, Divider, IconButton, Tooltip, Sheet, Badge, Stack } from "@mui/joy"
import {
  VideoLibrary,
  Image as ImageIcon,
  AudioFile,
  Description,
  Favorite,
  FavoriteBorder,
  MoreVert,
  Edit,
  Delete,
  Inventory,
  VisibilityOutlined,
  ConstructionOutlined,
} from "@mui/icons-material"
import Image from "next/image"
import { useColorScheme } from "@mui/joy/styles"
import { useRouter } from "next/navigation"
import DeleteMaterialModal from "./DeleteMaterialModal"

// Tipos para los materiales
export type MaterialType = "video" | "image" | "audio" | "document" | "equipment" | "other"

export interface MaterialCardProps {
  id: string
  name: string
  type?: MaterialType
  thumbnail?: string | null
  createdAt: string
  owner?: string
  description?: string | null
  category?: string | null
  quantity?: number
  is_consumable?: boolean
  location?: string | null
  serial_number?: string | null
  tags?: string[]
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export default function MaterialCard({
  id,
  name,
  type = "equipment",
  thumbnail = null,
  createdAt,
  owner,
  description,
  category,
  quantity = 1,
  is_consumable = false,
  location,
  serial_number,
  tags = [],
  isFavorite = false,
  onToggleFavorite,
  onEdit,
  onDelete,
  onView,
}: MaterialCardProps) {
  const { mode } = useColorScheme()
  const router = useRouter()
  const [showActions, setShowActions] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Función para obtener el icono según el tipo de material
  const getMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case "video":
        return <VideoLibrary />
      case "image":
        return <ImageIcon />
      case "audio":
        return <AudioFile />
      case "document":
        return <Description />
      case "equipment":
        return <ConstructionOutlined />
      default:
        return <Inventory />
    }
  }

  // Función para obtener el color del chip según el tipo de material
  const getMaterialColor = (type: MaterialType): "primary" | "success" | "warning" | "neutral" | "danger" => {
    switch (type) {
      case "video":
        return "primary"
      case "image":
        return "success"
      case "audio":
        return "warning"
      case "document":
        return "neutral"
      case "equipment":
        return "danger"
      default:
        return "neutral"
    }
  }

  // Generar un placeholder basado en el nombre y categoría, o usar la imagen real
  const getPlaceholderImage = () => {
    // Si hay una imagen real (thumbnail), usarla
    if (thumbnail) {
      return thumbnail
    }
    // Si no hay imagen, retornar null para mostrar el icono
    return null
  }

  const handleCardClick = () => {
    if (onView) {
      onView(id)
    } else {
      router.push(`/material/${id}`)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = (materialId: string) => {
    if (onDelete) {
      onDelete(materialId)
    }
  }

  return (
    <>
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
            cursor: "pointer",
          },
          overflow: "hidden",
          borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          background:
            mode === "dark"
              ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
              : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 100%)",
          backdropFilter: "blur(10px)",
          position: "relative",
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <Box sx={{ position: "relative" }}>
          <AspectRatio ratio="16/9">
            {getPlaceholderImage() ? (
              <Image
                src={getPlaceholderImage() || "/placeholder.svg"}
                alt={name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 300px"
                onError={(e) => {
                  // Si la imagen falla al cargar, ocultar la imagen y mostrar el icono
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  bgcolor: mode === "dark" ? "rgba(45,45,45,0.3)" : "rgba(250,250,250,0.8)",
                  color: mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
                }}
              >
                <ConstructionOutlined sx={{ fontSize: 64 }} />
              </Box>
            )}
          </AspectRatio>

          {/* Overlay con tipo de material */}
          <Chip
            variant="soft"
            color={getMaterialColor(type)}
            startDecorator={getMaterialIcon(type)}
            size="sm"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            {type === "equipment" ? "Equipo" : type.charAt(0).toUpperCase() + type.slice(1)}
          </Chip>

          {/* Cantidad para equipos */}
          {type === "equipment" && quantity > 0 && (
            <Badge
              badgeContent={quantity}
              color={quantity > 5 ? "success" : quantity > 1 ? "warning" : "danger"}
              size="sm"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  height: "1.3rem",
                  minWidth: "1.3rem",
                },
              }}
            >
              <Sheet
                variant="solid"
                color="neutral"
                sx={{
                  p: 0.5,
                  borderRadius: "sm",
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              >
                {is_consumable ? "Fungible" : "No fungible"}
              </Sheet>
            </Badge>
          )}

          {/* Acciones rápidas que aparecen al hacer hover */}
          {showActions && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(0,0,0,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0,
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <Stack direction="row" spacing={1}>
                <Tooltip title="Ver detalles" arrow>
                  <IconButton
                    variant="soft"
                    color="neutral"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onView) onView(id)
                      else router.push(`/material/${id}`)
                    }}
                    sx={{ bgcolor: "rgba(255,255,255,0.8)", color: "black" }}
                  >
                    <VisibilityOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar" arrow>
                  <IconButton
                    variant="soft"
                    color="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onEdit) onEdit(id)
                      else router.push(`/material/edit/${id}`)
                    }}
                    sx={{ bgcolor: "rgba(255,255,255,0.8)", color: "#1976d2" }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar" arrow>
                  <IconButton
                    variant="soft"
                    color="danger"
                    size="sm"
                    onClick={handleDeleteClick}
                    sx={{ bgcolor: "rgba(255,255,255,0.8)", color: "#d32f2f" }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography level="title-md" sx={{ mb: 0.5 }}>
            {name}
          </Typography>

          <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
            {owner && `${owner} • `}
            {new Date(createdAt).toLocaleDateString()}
          </Typography>

          {description && (
            <Typography
              level="body-sm"
              sx={{
                mb: 1.5,
                color: "text.secondary",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </Typography>
          )}

          <Box sx={{ mb: 1.5, flexGrow: 1 }}>
            {category && (
              <Chip
                size="sm"
                variant="soft"
                color="primary"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                }}
              >
                {category}
              </Chip>
            )}

            {tags.map((tag) => (
              <Chip
                key={tag}
                size="sm"
                variant="soft"
                color="neutral"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  bgcolor: "rgba(255, 188, 98, 0.2)",
                  color: mode === "dark" ? "#ffbc62" : "#ff9b44",
                }}
              >
                {tag}
              </Chip>
            ))}
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography level="body-xs" color="neutral">
              {location && `${location}`}
              {serial_number && ` • S/N: ${serial_number}`}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                variant="plain"
                color={isFavorite ? "danger" : "neutral"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onToggleFavorite) onToggleFavorite(id)
                }}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Aquí se podría abrir un menú con más opciones
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Modal de eliminación */}
      <DeleteMaterialModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        material={
          deleteModalOpen
            ? {
              id,
              name,
              category,
              quantity,
            }
            : null
        }
        onDeleted={handleDeleteConfirm}
      />
    </>
  )
}
