"use client"

import { Card, CardContent, AspectRatio, Typography, Box, Button, Stack, Chip, Avatar } from "@mui/joy"
import { Business, LocationOn, VerifiedUser } from "@mui/icons-material"
import type { Company } from "./CompanyProfile"
import { useColorScheme } from "@mui/joy/styles"
import Image from "next/image"

interface CompanyCardProps {
  company: Company
  onSelect: (company: Company) => void
  onEdit: (company: Company) => void
  onDelete?: (cif: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CompanyCard({ company, onSelect, onEdit, onDelete }: CompanyCardProps) {
  const { mode } = useColorScheme()

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    })
  }

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "md",
        },
        background:
          mode === "dark"
            ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
            : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <AspectRatio ratio="21/9">
          <Image
            src={`https://picsum.photos/seed/${company.cif}/800/400`}
            alt={company.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 800px"
            priority={false}
          />
        </AspectRatio>
        <Avatar
          src={company.logo_url || undefined}
          alt={company.name}
          sx={{
            position: "absolute",
            bottom: "-24px",
            left: "16px",
            width: 48,
            height: 48,
            border: "2px solid",
            borderColor: "background.surface",
            boxShadow: "sm",
          }}
        >
          {company.name.charAt(0) || <Business />}
        </Avatar>
      </Box>

      <CardContent sx={{ pt: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography level="title-lg">{company.name}</Typography>
            <Chip
              size="sm"
              variant="soft"
              color="neutral"
              sx={{ bgcolor: "rgba(255, 188, 98, 0.2)", color: "#ffbc62" }}
              startDecorator={<VerifiedUser fontSize="small" />}
            >
              {company.cif}
            </Chip>
          </Box>


          {company.address && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
              <LocationOn fontSize="small" sx={{ color: "text.tertiary" }} />
              <Typography level="body-sm" noWrap>
                {company.address}
              </Typography>
            </Box>
          )}

          {/* Descripción */}
          <Typography
            level="body-sm"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {company.description || "Sin descripción"}
          </Typography>
        </Box>
        {/* FOOTER FIJO ABAJO */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2, // separación del contenido
          }}
        >
          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
            Creada: {formatDate(company.created_at)}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              onClick={() => onEdit(company)}
              sx={{ minWidth: "auto" }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="solid"
              onClick={() => onSelect(company)}
              sx={{
                bgcolor: "#ffbc62",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 188, 98, 0.8)",
                },
              }}
            >
              Ver
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
