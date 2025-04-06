'use client';

import { IconButton } from '@mui/joy';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useColorScheme } from '@mui/joy/styles';

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode); // 👈 Guardar el nuevo modo
  };

  return (
    <IconButton
      variant="soft"
      color="neutral"
      onClick={toggleTheme}
      sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1500 }}
    >
      <span suppressHydrationWarning>
        {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </span>
    </IconButton>
  );
}
