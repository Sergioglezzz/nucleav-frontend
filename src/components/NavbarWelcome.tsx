'use client'
import { Stack, useTheme, Box } from '@mui/joy'
import { useColorScheme } from '@mui/joy/styles'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import ClientOnly from "./ClientOnly"
import ThemeToggleButton from "./ThemeToggleButton"

export default function NavbarWelcome() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          style={{
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
          }}
        />
      ) : (
        // Placeholder mientras no se monta para evitar saltos
        <Box sx={{ width: 100, height: 30 }} />
      )}

      {/* ACCIONES */}
      <Stack direction="row" alignItems="center" gap={1.5}>
        {/* Modo oscuro */}
        <Box sx={{ mb: 1 }}>
          <ClientOnly>
            <ThemeToggleButton />
          </ClientOnly>
        </Box>
      </Stack>
    </Stack>
  )
}
