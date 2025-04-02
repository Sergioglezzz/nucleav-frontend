'use client'
import { Box, Typography, IconButton, Link, useTheme } from '@mui/joy'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useColorScheme } from '@mui/joy/styles'

export default function Navbar() {
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        bgcolor: theme.vars.palette.navbar?.bg ?? 'transparent', // 👈 color dinámico
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.vars.palette.divider}`,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <Link href="/" underline="none" color="neutral">
        <Typography level="h4" fontWeight={600}>
          NucleAV
        </Typography>
      </Link>

      {/* ACCIONES */}
      <Box display="flex" alignItems="center" gap={1.5}>
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
      </Box>
    </Box>
  )
}
