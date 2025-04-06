'use client';

import { Box, Stack } from '@mui/joy';

const NAVBAR_HEIGHT = 64; // 👈 define la altura del navbar

export default function ColumnLayout({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      direction="row"
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.body',
        overflowY: "auto",
        pt: `${NAVBAR_HEIGHT}px`,
      }}
    >
      {/* Columna izquierda */}
      <Box flex={1} />

      {/* Contenido principal */}
      <Box sx={{
        width: '100%',
        minHeight: "100%",
        maxWidth: "800px",
        minWidth: "320px",
        p: 4,
        mx: 'auto',

        boxSizing: "border-box",
      }}>
        {children}
      </Box>

      {/* Columna derecha */}
      <Box flex={1} />
    </Stack>
  );
}
