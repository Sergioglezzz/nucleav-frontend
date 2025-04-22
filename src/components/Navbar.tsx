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
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useColorScheme } from '@mui/joy/styles'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExitModal from "./ExitModal";
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session } = useSession();
  const user = session?.user;



  return (
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
      {/* LOGO */}
      <Link href="/dashboard" underline="none" color="neutral" sx={{ pt: 0.5 }}>
        {mounted ? (
          <Image
            src={mode === 'light' ? '/Logo-nucleav-light.png' : '/Logo-nucleav-dark.png'}
            alt="NucleAV Logo"
            width={100}
            height={30}
            priority
          />
        ) : (
          // Placeholder mientras no se monta para evitar saltos
          <Box sx={{ width: 100, height: 30 }} />
        )}
      </Link>

      {/* ACCIONES */}
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Typography level="body-sm" fontWeight="lg" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          Proyectos
        </Typography>
        <Typography level="body-sm" fontWeight="lg" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          Red
        </Typography>
        <Typography level="body-sm" fontWeight="lg" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          Material
        </Typography>
        <Typography level="body-sm" fontWeight="lg" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          Empresa
        </Typography>
        <Divider orientation="vertical" inset="none" />


        {/* Modo oscuro */}
        <IconButton
          variant="plain"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>

       
          <Dropdown>
            <Tooltip title={user?.name} placement="bottom-end" variant="soft">
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', size: 'sm' } }}
              >
                <Avatar src={user?.image || ''} alt={user?.name || 'Usuario'} size="sm" />

              </MenuButton>
            </Tooltip>
            <Menu placement="bottom-end" sx={{ minWidth: 220 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1 }}>
                <Avatar src={user?.image || ''} alt={user?.name || 'Usuario'} size="sm" />

                <Box>
                  <Typography level="body-md" fontWeight="md">
                    {user?.name}
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <ListDivider />

              <MenuItem>
                <SettingsIcon fontSize="small" />
                Configuración
              </MenuItem>
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
        



        {/* Menú hamburguesa (opcional) */}
        <IconButton variant="soft" sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Stack>
      {/* Modal de Logout */}
      <ExitModal
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        onConfirm={handleLogout}
      />
    </Stack>
  )
}
