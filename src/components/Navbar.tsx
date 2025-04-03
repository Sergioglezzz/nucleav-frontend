'use client'
import { Stack, IconButton, Link, useTheme } from '@mui/joy'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useColorScheme } from '@mui/joy/styles'
import Image from 'next/image'

export default function Navbar() {
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()

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
      <Link href="/" underline="none" color="neutral" sx={{ pt: 1 }}>
        {mode === 'light' ? (
          <Image src="/Logo-nucleav-light.png" alt="NucleAV Logo Light" width={110} height={110} priority />
        ) : (
          <Image src="/Logo-nucleav-dark.png" alt="NucleAV Logo Dark" width={110} height={110} priority />
        )}
      </Link>

      {/* ACCIONES */}
      <Stack direction="row" alignItems="center" gap={1.5}>
        {/* Modo oscuro */}
        <IconButton
          variant="soft"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>

        {/* Menú hamburguesa (opcional) */}
        <IconButton variant="solid" sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}
