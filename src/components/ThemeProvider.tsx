'use client'

import { CssVarsProvider, useColorScheme, useTheme } from '@mui/joy/styles'
// import { useEffect } from 'react'
import theme from '../lib/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider theme={theme} defaultMode="system"
      attribute="data-color-scheme" disableNestedContext>
      {/* <BodyBackgroundSync /> */}
      {children}
    </CssVarsProvider>
  )
}

// function BodyBackgroundSync() {
//   const theme = useTheme()
//   const { mode } = useColorScheme()

//   useEffect(() => {
//     const color = theme.vars.palette.background.body
//     document.body.style.backgroundColor = color
//     document.body.style.color = theme.vars.palette.text.primary ?? '#fff'
//   }, [theme, mode])

//   return null
// }
