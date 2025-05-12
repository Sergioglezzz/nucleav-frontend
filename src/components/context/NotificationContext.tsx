"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { Snackbar, IconButton, Typography } from "@mui/joy"
import { CheckCircle, Error, Info, Warning, Close } from "@mui/icons-material"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationState {
  open: boolean
  message: string
  type: NotificationType
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new globalThis.Error("useNotification debe usarse dentro de NotificationProvider")
  }
  return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "info",
  })

  const showNotification = (message: string, type: NotificationType = "info") => {
    setNotification({ open: true, message, type })
  }

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }))
  }

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle />
      case "error":
        return <Error />
      case "warning":
        return <Warning />
      default:
        return <Info />
    }
  }

  const getColor = () => {
    switch (notification.type) {
      case "success":
        return "success"
      case "error":
        return "danger"
      case "warning":
        return "warning"
      default:
        return "primary"
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        variant="soft"
        color={getColor()}
        open={notification.open}
        onClose={handleClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        startDecorator={getIcon()}
        endDecorator={
          <IconButton variant="plain" size="sm" color={getColor()} onClick={handleClose}>
            <Close />
          </IconButton>
        }
        sx={{ position: "fixed", zIndex: 9999, minWidth: 300, maxWidth: 500 }}
      >
        <Typography>{notification.message}</Typography>
      </Snackbar>
    </NotificationContext.Provider>
  )
}
