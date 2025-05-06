"use client"

import { IconButton } from "@mui/joy"
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded"
import { useColorScheme } from "@mui/joy/styles"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  // Asegurarse de que el componente está montado antes de mostrar el icono correcto
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark"
    setMode(newMode)
    localStorage.setItem("theme-mode", newMode)

    // Actualizar clases para estilos inmediatos
    if (newMode === "dark") {
      document.documentElement.classList.add("dark-theme")
      document.body.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
      document.body.classList.remove("dark-theme")
    }
  }

  // No mostrar nada hasta que el componente esté montado para evitar errores de hidratación
  if (!mounted) {
    return <IconButton variant="soft" color="neutral" sx={{ visibility: "hidden" }} />
  }

  return (
    <IconButton
      variant="soft"
      color="neutral"
      onClick={toggleTheme}
      sx={{ position: "fixed", top: 16, right: 16, zIndex: 1500 }}
    >
      {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
    </IconButton>
  )
}
