"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useColorScheme } from "@mui/joy/styles"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
  IconButton,
  Sheet,
  Badge,
} from "@mui/joy"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import HomeIcon from "@mui/icons-material/Home"
import {
  FolderSpecial as ProjectIcon,
  People as NetworkIcon,
  Inventory as MaterialIcon,
  Business as CompanyIcon,
  Settings,
  Notifications,
} from "@mui/icons-material"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"


interface DrawerMenuProps {
  open: boolean
  onClose: () => void
  user?: {
    name: string
    image?: string
    role?: string
  }
}

export default function DrawerMenu({ open, onClose }: DrawerMenuProps) {
  const pathname = usePathname()
  const { mode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    { name: "Inicio", path: "/dashboard", icon: <HomeIcon /> },
    { name: "Proyectos", path: "/proyectos", icon: <ProjectIcon /> },
    { name: "Red", path: "/red", icon: <NetworkIcon /> },
    { name: "Material", path: "/material", icon: <MaterialIcon /> },
    { name: "Empresa", path: "/empresa", icon: <CompanyIcon /> },
  ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="sm"
      slotProps={{
        content: {
          sx: {
            bgcolor: "background.surface",
            borderTopRightRadius: { xs: 0, sm: "xl" },
            borderBottomRightRadius: { xs: 0, sm: "xl" },
            boxShadow: "lg",
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
          },
        },
      }}
    >
      {/* Header */}
      <Sheet
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Link
          href="/dashboard"
          onClick={onClose}
          style={{ display: "flex", alignItems: "center" }}
        >
          {mounted && (
            <Image
              src={mode === "light" ? "/Logo-nucleav-light.png" : "/Logo-nucleav-dark.png"}
              alt="NucleAV Logo"
              width={100}
              height={30}
              priority
              style={{
                filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          )}
        </Link>


        <IconButton
          variant="plain"
          color="neutral"
          onClick={onClose}
          sx={{ mt: 0.3, }}
        >
          <ArrowBackIosIcon sx={{ fontSize: 17, color: "#ffbc62", ml: 0.5 }} />
        </IconButton>

        {/* Decorative background element */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "linear-gradient(45deg, transparent, rgba(255, 188, 98, 0.1))",
            zIndex: -1,
          }}
        />
      </Sheet>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, mt: -3 }}>
        <List
          size="lg"
          sx={{
            "--List-gap": "12px",
            "--ListItem-radius": "var(--joy-radius-sm)",
          }}
        >
          <AnimatePresence>
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.path
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <ListItem>
                    <ListItemButton
                      component={Link}
                      href={item.path}
                      selected={isActive}
                      onClick={onClose}
                      sx={{
                        py: 1.5,
                        gap: 1.5,
                        borderRadius: "md",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                          transform: "translateX(4px)",
                        },
                        "&.Joy-selected": {
                          bgcolor: "primary.softBg",
                          color: "primary.softColor",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "25%",
                            bottom: "25%",
                            width: 3,
                            bgcolor: "primary.solidBg",
                            borderRadius: "0 4px 4px 0",
                          },
                        },
                      }}
                    >
                      <ListItemDecorator
                        sx={{
                          color: isActive ? "primary.solidBg" : "neutral.500",
                          transition: "transform 0.2s",
                          ".Joy-ListItemButton:hover &": {
                            transform: "scale(1.1) rotate(5deg)",
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">{item.name}</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </List>
      </Box>

      {/* Footer with actions */}
      <Sheet
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(to top, rgba(255, 188, 98, 0.05), transparent)",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>

          <IconButton variant="soft" color="neutral" size="sm">
            <Settings />
          </IconButton>
          <IconButton variant="soft" color="primary" size="sm">
            <Badge badgeContent={3} size="sm" color="danger">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>

      </Sheet>
    </Drawer>
  )
}
