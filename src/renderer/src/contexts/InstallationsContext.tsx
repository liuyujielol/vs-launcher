import { createContext, useState, useEffect, useRef } from "react"

interface InstallationsContextType {
  installations: InstallationType[]
  setInstallations: React.Dispatch<React.SetStateAction<InstallationType[]>>
}

const defaultValue: InstallationsContextType = { installations: [], setInstallations: () => {} }

const InstallationsContext = createContext<InstallationsContextType>(defaultValue)

const InstallationsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [installations, setInstallations] = useState<InstallationType[]>(defaultValue.installations)

  const firstExecuted = useRef(true)
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (firstExecuted.current) {
        firstExecuted.current = false
        const config = await window.api.getConfig()
        setInstallations(config.installations)
      }
    })()
  }, [])

  return <InstallationsContext.Provider value={{ installations, setInstallations }}>{children}</InstallationsContext.Provider>
}

export { InstallationsContext, InstallationsProvider }
