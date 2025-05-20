"use client"

import { useState } from "react"
import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"

interface TabOption {
  value: string
  label: string
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

          return (
            <Button
              key={option.value}
              variant="plain"
              color="neutral"
              onClick={() => handleTabChange(option.value)}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: "lg",
                position: "relative",
                zIndex: 1,
                color: isActive ? "#ffbc62" : "text.primary",
                "&:hover": {
                  bgcolor: "transparent",
                  color: isActive ? "#ffbc62" : "text.secondary",
                },
                transition: "color 0.2s ease",
              }}
            >
              {option.label}

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
