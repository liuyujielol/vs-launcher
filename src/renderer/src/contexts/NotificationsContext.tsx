import { createContext, useState, useCallback, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

interface NotificationsContextType {
  notifications: NotificationType[]
  addNotification: (title: string, body: string, type?: "success" | "error" | "info", onClick?: () => void) => void
}

const defaultValue: NotificationsContextType = { notifications: [], addNotification: () => {} }

const NotificationsContext = createContext<NotificationsContextType>(defaultValue)

const NotificationsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const { t } = useTranslation()

  const firstExecuted = useRef(true)
  useEffect(() => {
    if (firstExecuted.current) {
      firstExecuted.current = false

      window.api.onUpdateAvailable(() => {
        addNotification(t("notification-title-updateAvailable"), t("notification-body-updateAvailable"), "info")
      })

      window.api.onUpdateDownloaded(() => {
        addNotification(t("notification-title-updateDownloaded"), t("notification-body-updateDownloaded"), "success", () => {
          window.api.updateAndRestart()
        })
      })
    }
  }, [])

  const addNotification = useCallback((title: string, body: string, type: "success" | "error" | "info" = "info", onClick?: () => void) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, title, body, type, onClick }])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, 6000)
  }, [])

  return <NotificationsContext.Provider value={{ notifications, addNotification }}>{children}</NotificationsContext.Provider>
}

export { NotificationsContext, NotificationsProvider }
