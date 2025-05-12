"use client"

import { Box } from "@mui/joy"
import { useColorScheme } from "@mui/joy/styles"

export default function ThemeTransitionWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useColorScheme()

  const backgroundColor = mode === "dark" ? "#0f1214" : "#f5f5f3"
  const textColor = mode === "dark" ? "#f6f7f8" : "#000000"

  return (
    <Box
      sx={{
        backgroundColor,
        color: textColor,
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {children}
    </Box>
  )
}
