import { createContext, useContext, useEffect, useRef } from "react"

import { useInstallations } from "@renderer/hooks/useInstallations"

interface InstallationsContextType {
  installations: InstallationType[]
  setInstallations: React.Dispatch<React.SetStateAction<InstallationType[]>>
}

const defaultValue: InstallationsContextType = { installations: [], setInstallations: () => {} }

const InstallationsContext = createContext<InstallationsContextType>(defaultValue)

const InstallationsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [installations, setInstallations] = useInstallations()

  const firstExecutedInstallationsProvider = useRef(true)
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (firstExecutedInstallationsProvider.current) {
        firstExecutedInstallationsProvider.current = false
        window.api.utils.logMessage("info", `[context] [InstallationsContext] Setting installations from config file`)
        const config = await window.api.configManager.getConfig()
        setInstallations(config.installations)
      }
    })()
  }, [])

  return <InstallationsContext.Provider value={{ installations, setInstallations }}>{children}</InstallationsContext.Provider>
}

const useInstallationsContext = (): InstallationsContextType => {
  const context = useContext(InstallationsContext)
  if (!context) {
    throw new Error("useInstallationsContext must be used within an InstallationsProvider")
  }
  return context
}

export { InstallationsProvider, useInstallationsContext }
