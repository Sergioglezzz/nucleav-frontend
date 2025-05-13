"use client"

import { IconButton } from "@mui/joy"
import { useColorScheme } from "@mui/joy/styles"
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded"
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"

export default function ThemeToggleButton() {
  const { mode, setMode } = useColorScheme()

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark"
    setMode(newMode)
    localStorage.setItem("theme-mode", newMode)
    document.documentElement.classList.toggle("dark-theme", newMode === "dark")
    document.body.classList.toggle("dark-theme", newMode === "dark")
  }

  return (
    <IconButton
      variant="soft"
      size="sm"
      onClick={toggleMode}
      sx={{
        borderRadius: "50%",
        backgroundColor: "background.level1",
        "&:hover": {
          backgroundColor: "background.level2",
        },
        "&.Mui-focusVisible": {
          outline: "2px solid",
          outlineOffset: "2px",
          outlineColor: "primary.outlinedBorder",
        },
      }}
    >
      {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
    </IconButton>
  )
}
