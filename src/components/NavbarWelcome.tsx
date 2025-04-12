'use client'
import { Stack, IconButton, Link, useTheme, Box } from '@mui/joy'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useColorScheme } from '@mui/joy/styles'
import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function NavbarWelcome() {
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()
  const [mounted, setMounted] = useState(false);

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

      {/* ACCIONES */}
      <Stack direction="row" alignItems="center" gap={1.5}>
        {/* Modo oscuro */}
        <IconButton
          variant="soft"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Stack>
    </Stack>
  )
}
