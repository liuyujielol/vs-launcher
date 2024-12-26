import { createContext, useState, useContext, useEffect } from "react"

import { useInstallationsContext } from "@renderer/contexts/InstallationsContext"

interface InstallationContextType {
  installation: InstallationType | undefined
  setInstallation: React.Dispatch<React.SetStateAction<InstallationType | undefined>>
}

const defaultValue: InstallationContextType = { installation: undefined, setInstallation: () => {} }

const InstallationContext = createContext<InstallationContextType>(defaultValue)

const InstallationProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { installations } = useInstallationsContext()
  const [installation, setInstallation] = useState<InstallationType | undefined>()

  useEffect(() => {
    ;(async (): Promise<void> => {
      window.api.utils.logMessage("info", `[context] [InstallationContext] Setting local stored or latest created installation`)
      const localStorageInstallation = window.localStorage.getItem("installation") || installations[0]?.id
      const newInstallation = installations.find((current) => current.id === localStorageInstallation)
      setInstallation(newInstallation || installations[0])
    })()
  }, [installations])

  return <InstallationContext.Provider value={{ installation, setInstallation }}>{children}</InstallationContext.Provider>
}

const useInstallationContext = (): InstallationContextType => {
  const context = useContext(InstallationContext)
  if (!context) {
    throw new Error("useInstallationContext must be used within an InstallationProvider")
  }
  return context
}

export { InstallationProvider, useInstallationContext }
