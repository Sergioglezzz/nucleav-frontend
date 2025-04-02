'use client'

import { CssVarsProvider } from '@mui/joy/styles'
import theme from '../lib/theme' // o donde tengas tu `theme.ts`

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider theme={theme} defaultMode="system" disableNestedContext>
      {children}
    </CssVarsProvider>
  )
}
