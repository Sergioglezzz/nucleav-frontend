"use client"

import type React from "react"

import { useState } from "react"
import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"

interface TabOption {
  value: string
  label: string
  icon?: React.ReactNode
  badge?: number
  shortLabel?: string
}

interface CustomTabsProps {
  options: TabOption[]
  defaultValue?: string
  onChange?: (value: string) => void
}

export default function CustomTabs({ options, defaultValue = options[0]?.value, onChange }: CustomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (onChange) onChange(value)
  }

  // Calcular la posición del indicador activo
  const activeIndex = options.findIndex((opt) => opt.value === activeTab)
  const tabWidth = 100 / options.length

  return (
    <Box
      sx={{
        position: "relative",
        p: 0.5,
        bgcolor: "background.level1",
        borderRadius: "xl",
        overflow: "hidden",
        // Usar boxShadow en lugar de border para evitar problemas de aliasing
        boxShadow: "inset 0 0 0 1px var(--joy-palette-divider)",
        mb: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          borderRadius: "lg",
          overflow: "hidden",
        }}
      >
        {/* Indicador de fondo que se mueve */}
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            width: `${tabWidth}%`,
            left: `${activeIndex * tabWidth}%`,
            bgcolor: "background.surface",
            borderRadius: "lg",
            transition: "all 0.2s ease-out",
            boxShadow: "var(--joy-shadowRing, 0 0 #000), 0 2px 4px -1px rgba(0,0,0,0.05)",
            zIndex: 0,
          }}
        />

        {/* Botones de pestañas */}
        {options.map((option) => {
          const isActive = activeTab === option.value
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const displayLabel = option.shortLabel && window.innerWidth < 600 ? option.shortLabel : option.label

          return (
            <Button
              key={option.value}
              variant="plain"
              color="neutral"
              onClick={() => handleTabChange(option.value)}
              sx={{
                flex: 1,
                py: 1.5,
                px: { xs: 1, sm: 2 },
                borderRadius: "lg",
                position: "relative",
                zIndex: 1,
                color: isActive ? "#ffbc62" : "text.primary",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                minWidth: { xs: "auto", sm: "120px" },
                "&:hover": {
                  bgcolor: "transparent",
                  color: isActive ? "#ffbc62" : "text.secondary",
                },
                transition: "color 0.2s ease",
              }}
            >
              {/* Icono */}
              {option.icon && (
                <Box
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {option.icon}
                </Box>
              )}

              {/* Texto responsive */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                <Box sx={{ display: { xs: "none", sm: "block" } }}>{option.label}</Box>
                <Box sx={{ display: { xs: "block", sm: "none" } }}>{option.shortLabel || option.label}</Box>

                {/* Badge */}
                {option.badge !== undefined && option.badge > 0 && (
                  <Box
                    sx={{
                      bgcolor: isActive ? "#ffbc62" : "primary.500",
                      color: isActive ? "black" : "white",
                      borderRadius: "50%",
                      minWidth: "18px",
                      height: "18px",
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      ml: { xs: 0, sm: 0.5 },
                    }}
                  >
                    {option.badge > 99 ? "99+" : option.badge}
                  </Box>
                )}
              </Box>

              {/* Indicador inferior para la pestaña activa */}
              {isActive && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    left: "15%",
                    right: "15%",
                    height: "3px",
                    bgcolor: "#ffbc62",
                    borderRadius: "3px 3px 0 0",
                  }}
                />
              )}
            </Button>
          )
        })}
      </Box>
    </Box>
  )
}
