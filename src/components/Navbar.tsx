'use client'
import {
  Stack,
  IconButton,
  Link,
  useTheme,
  Box,
  Typography,
  Avatar,
  Divider,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Tooltip,
  ListDivider,
} from '@mui/joy'
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useColorScheme } from '@mui/joy/styles'
import Image from 'next/image'
import { useState } from 'react';
import ExitModal from "./ExitModal";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientOnly from "./ClientOnly"
import ThemeToggleButton from "./ThemeToggleButton"
import DrawerMenu from "./DrawerMenu";
import { navigationItems } from "@/utils/Navigation"
import { usePathname } from "next/navigation"
import PeopleIcon from "@mui/icons-material/People"


export default function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false)

  const router = useRouter();
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const { data: session, status } = useSession();

  const user = session?.user as { name?: string; email?: string; image?: string; role?: string } | undefined

  if (status === "loading") return null;

  return (
    <>

      <Stack
        component="nav"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          px: 3,
          bgcolor: theme.vars.palette.navbar?.bg ?? 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
          zIndex: 1000,
        }}
      >
        <Box>
          <>
            {/* XS: logo como botón para abrir el drawer */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "flex", sm: "none" }, p: 0.5, pl: 1 }}
            >
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
              <ArrowForwardIosIcon sx={{ fontSize: 18, mt: 0.3, color: "#ffbc62", ml: 0.5, pr: 0.5 }} />
            </IconButton>

            {/* SM+: logo como link */}
            <Link
              href="/dashboard"
              underline="none"
              color="neutral"
              sx={{ display: { xs: "none", sm: "flex" }, p: 0.5, pl: 1 }}
            >
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
            </Link>
          </>
        </Box>

        {/* ACCIONES */}
        <Stack direction="row" alignItems="center" gap={2}>
          {navigationItems.map(({ name, path }) => {
            const isActive = pathname === path
            return (
              <Link
                key={path}
                href={path}
                underline="none"
                level="body-sm"
                fontWeight="lg"
                color="neutral"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  cursor: "pointer",
                  mx: 0.5,
                  transition: "color 0.2s",
                  color: isActive ? "#ffbc62" : undefined,
                  "&:hover": {
                    color: "#ffbc62",
                  },
                }}
              >
                {name}
              </Link>
            )
          })}

          <Divider orientation="vertical" inset="none" sx={{ display: { xs: 'none', sm: 'block' } }} />

          {/* Modo oscuro */}
          <Stack alignItems={'center'} justifyContent="center">
            <ClientOnly>
              <ThemeToggleButton />
            </ClientOnly>
          </Stack>

          <Dropdown>
            <Tooltip title={user?.name} placement="bottom-end" variant="soft">
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                  root: {
                    variant: 'plain',
                    size: 'sm',
                    sx: {
                      borderRadius: '50%',
                      padding: 0,
                      '&:hover, &:focus, &.Mui-focusVisible': {
                        borderRadius: '50%',
                        backgroundColor: 'background.level1',
                      },
                      transition: 'background 0.2s',
                    },
                  },
                }}
              >
                <Avatar src={user?.image || ''} alt={user?.name || 'Usuario'} size="sm" />
              </MenuButton>
            </Tooltip>
            <Menu placement="bottom-end" sx={{
              minWidth: 220,
              bgcolor: 'background.body',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'md',
              boxShadow: 'md',
              p: 1
            }}>
              <MenuItem
                onClick={() => router.push('/profile')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 0.3,
                  py: 0.5,
                  px: 2,
                  borderRadius: 'md',
                }}
              >
                <Avatar src={user?.image || ''} alt={user?.name || 'Usuario'} size="sm" />
                <Box>
                  <Typography level="body-md" fontWeight="md">
                    {user?.name}
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>

              <ListDivider />

              <MenuItem>
                <SettingsIcon fontSize="small" />
                Configuración
              </MenuItem>
              {user?.role === "admin" && (
                <>
                  <MenuItem
                    onClick={() => router.push("/ManageUsers")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      py: 0.5,
                      px: 2,
                      borderRadius: "md",
                    }}
                  >
                    <PeopleIcon fontSize="small" />
                    Gestión de Usuarios
                  </MenuItem>
                  <ListDivider />
                </>
              )}
              <MenuItem onClick={() => alert("Aún no implementado 😅")}>
                <HelpOutlineIcon fontSize="small" />
                Ayuda
              </MenuItem>

              <ListDivider />

              <MenuItem onClick={() => setExitModalOpen(true)} color="neutral">
                <LogoutIcon fontSize="small" />
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Dropdown>
        </Stack>
        {/* Modal de Logout */}
        <ExitModal
          open={exitModalOpen}
          onClose={() => setExitModalOpen(false)}
          onConfirm={handleLogout}
        />
      </Stack>
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
