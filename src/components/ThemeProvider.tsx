"use client"

import type React from "react"

import { CssVarsProvider, useColorScheme } from "@mui/joy/styles"
import { useEffect, useState } from "react"
import theme from "../lib/theme"
import { CircularProgress, Box } from "@mui/joy"

// Componente para sincronizar el fondo del body con el tema
function BodyBackgroundSync() {
  const { mode } = useColorScheme()

  useEffect(() => {
    // Actualizar clases y estilos cuando cambia el modo
    if (mode === "dark") {
      document.documentElement.classList.add("dark-theme")
      document.body.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
      document.body.classList.remove("dark-theme")
    }

    // Guardar el modo en localStorage
    localStorage.setItem("theme-mode", mode || "light")
  }, [mode])

  return null
}

// Componente principal ThemeProvider
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Detectar cuando el componente está montado
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="system"
      attribute="data-color-scheme"
      disableNestedContext
      modeStorageKey="theme-mode"
    >
      <BodyBackgroundSync />

      {!mounted ? (
        // Mostrar un indicador de carga mientras se monta el componente
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "var(--joy-palette-background-body)",
            color: "var(--joy-palette-text-primary)",
          }}
        >
          <CircularProgress size="lg" />
        </Box>
      ) : (
        // Renderizar los hijos una vez montado
        children
      )}
    </CssVarsProvider>
  )
}
