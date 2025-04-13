'use client'
import { Stack, IconButton, Link, useTheme, Box } from '@mui/joy'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useColorScheme } from '@mui/joy/styles'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import router from "next/router";
import ExitModal from "./ExitModal";

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
        {/* Modo oscuro */}
        <IconButton
          variant="plain"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>

        <IconButton variant="plain" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <SettingsIcon />
        </IconButton>
        {/* Logout */}
        <IconButton variant="plain" onClick={() => setExitModalOpen(true)} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <LogoutIcon />
        </IconButton>
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
