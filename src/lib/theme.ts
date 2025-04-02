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
          bg: 'rgba(255, 255, 255, 0.85)', // navbar fondo claro con glass
        },

        // 🔲 BACKGROUND GENERAL (body) solo en modo claro
        background: {
          body: '#f5f5f5', // color de fondo de la app en modo claro
        },
      },
    },

    dark: {
      palette: {
        // 🎨 PRIMARY en modo oscuro
        primary: {
          solidBg: '#ffbc62',
          solidColor: '#000000',
          solidHoverBg: '#e69224',
          solidActiveBg: '#d17600',

          softColor: '#ffbc62',
          softBg: '#2a1c00',
          softHoverBg: '#3a2800',

          plainColor: '#ffbc62',
          outlinedBorder: '#ffbc62',
        },

        // 🎨 SECONDARY en modo oscuro
        secondary: {
          solidBg: '#a78bfa',
          solidColor: '#0f172a',
          solidHoverBg: '#8b5cf6',
          solidActiveBg: '#7c3aed',

          softColor: '#c4b5fd',
          softBg: '#2e1065',
          softHoverBg: '#3b0764',

          plainColor: '#c084fc',
          outlinedBorder: '#a78bfa',
        },

        // 🧊 NAVBAR en modo oscuro
        navbar: {
          bg: 'rgba(37, 36, 47, 0.7)', // navbar oscuro transparente
        },

        // 🔲 BACKGROUND GENERAL en modo oscuro
        background: {
          body: '#25242f', // fondo general del body
        },
      },
    },
  },

  // 🔤 TIPOGRAFÍA GENERAL
  fontFamily: {
    display: 'Poppins, sans-serif', // para headings
    body: 'Poppins, sans-serif',    // para texto general
  },
})

export default theme
