"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import { Box } from "@mui/joy"

const publicRoutes = ["/", "/login", "/register"]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNavbar = !publicRoutes.includes(pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      <Box sx={{ pt: showNavbar ? "8px" : 0 }}>
        {children}
      </Box>
    </>
  )
}
