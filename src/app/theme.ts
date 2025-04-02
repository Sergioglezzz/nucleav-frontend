// theme.ts
import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidColor: '#1976d2',
          // otros colores...
        },
        // más configuraciones para el modo claro
      },
    },
    dark: {
      palette: {
        primary: {
          solidColor: '#90caf9',
          // otros colores...
        },
        // más configuraciones para el modo oscuro
      },
    },
  },
  // Otras personalizaciones...
});

export default theme;
