import { createContext, useState, useCallback, useEffect } from "react"

interface NotificationsContextType {
  notifications: NotificationType[]
  addNotification: (title: string, body: string, type?: "success" | "error" | "info", onClick?: () => void) => void
}

const defaultValue: NotificationsContextType = { notifications: [], addNotification: () => {} }

const NotificationsContext = createContext<NotificationsContextType>(defaultValue)

const NotificationsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])

  useEffect(() => {
    window.api.onUpdateAvailable(() => {
      addNotification("Update Available", "A new version is available. Donwloading...", "info")
    })

    window.api.onUpdateDownloaded(() => {
      addNotification("Update Downloaded", "Update downloaded successfully. Click to restart and install...", "info", () => {
        window.api.updateAndRestart()
      })
    })
  })

  const addNotification = useCallback((title: string, body: string, type: "success" | "error" | "info" = "info", onClick?: () => void) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, title, body, type, onClick }])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, 5000)
  }, [])

  return <NotificationsContext.Provider value={{ notifications, addNotification }}>{children}</NotificationsContext.Provider>
}

export { NotificationsContext, NotificationsProvider }
