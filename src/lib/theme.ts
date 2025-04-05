'use client'

import { extendTheme } from '@mui/joy/styles'

// 👇 EXTENSIÓN de los tipos de Joy UI para permitir `secondary` y `navbar`
declare module '@mui/joy/styles' {
  interface Palette {
    navbar?: {
      bg?: string;
    };
    secondary?: {
      solidBg?: string;
      solidColor?: string;
      solidHoverBg?: string;
      solidActiveBg?: string;
      softBg?: string;
      softColor?: string;
      softHoverBg?: string;
      plainColor?: string;
      outlinedBorder?: string;
    };
  }

  interface PaletteVarOverrides {
    secondary: true;
    navbar: true;
  }
}

// 🎨 THEME PRINCIPAL
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        // 🎨 PRIMARY COLOR — color corporativo base (botones, links, inputs)
        primary: {
          solidBg: '#ffbc62',        // Fondo botón "solid"
          solidColor: '#000000',     // Texto sobre fondo solid
          solidHoverBg: '#fca638',   // Hover
          solidActiveBg: '#e69224',  // Click

          softColor: '#8c4c00',
          softBg: '#fff3e0',         // Fondo "soft"
          softHoverBg: '#ffe0b2',

          plainColor: '#8c4c00',
          outlinedBorder: '#ffbc62',
        },

        // 🎨 SECONDARY COLOR — uso alternativo (menos prioritario que primary)
        secondary: {
          solidBg: '#8b5cf6',
          solidColor: '#ffffff',
          solidHoverBg: '#7c3aed',
          solidActiveBg: '#6d28d9',

          softColor: '#7c3aed',
          softBg: '#ede9fe',
          softHoverBg: '#ddd6fe',

          plainColor: '#5b21b6',
          outlinedBorder: '#8b5cf6',
        },

        // 🧊 NAVBAR — fondo con transparencia (modificable aquí)
        navbar: {
          bg: 'rgba(255, 255, 255, 0.5)', // navbar fondo claro con glass
        },

        // 🔲 BACKGROUND GENERAL (body) solo en modo claro
        background: {
          body: '#f5f5f3', // color de fondo de la app en modo claro
        },
      },
    },

    dark: {
      palette: {
        // 🎨 PRIMARY en modo oscuro (naranja pastel)
        primary: {
          solidBg: '#ffbc62',        // Fondo sólido del botón
          solidColor: '#000000',     // Texto oscuro legible
          solidHoverBg: '#e69224',
          solidActiveBg: '#d17600',

          softColor: '#ffbc62',      // Texto en soft
          softBg: '#2a1c00',         // Fondo suave relacionado con el naranja
          softHoverBg: '#3a2800',

          plainColor: '#ffbc62',
          outlinedBorder: '#ffbc62',
        },

        // 🎨 SECONDARY (opcional, en estilo apagado)
        secondary: {
          solidBg: '#1a1c20',         // fondo casi neutro (más oscuro que el navbar)
          solidColor: '#f6f7f8',      // texto claro
          solidHoverBg: '#2b2e34',
          solidActiveBg: '#373a41',

          softColor: '#c4c4cc',
          softBg: '#202227',
          softHoverBg: '#2a2d33',

          plainColor: '#bcbcc6',
          outlinedBorder: '#2a2d33',
        },

        // 🧊 NAVBAR — fondo transparente con blur
        navbar: {
          bg: 'rgba(15, 18, 20, 0.5)', // 0f1214 con transparencia para efecto glass
        },

        // 🔲 BACKGROUND GENERAL
        background: {
          body: '#0f1214', // fondo global de la app
        },

        // ✍️ TEXTO
        text: {
          primary: '#f6f7f8',  // texto principal
          secondary: '#a1a1aa', // texto más suave o deshabilitado
        },

        // 📏 LÍNEAS Y DIVISORES
        divider: '#2c2f36',
      },
    }

  },

  // 🔤 TIPOGRAFÍA GENERAL
  fontFamily: {
    display: 'Poppins, sans-serif', // para headings
    body: 'Poppins, sans-serif',    // para texto general
  },
})

export default theme
