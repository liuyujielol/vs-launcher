import { createContext, useState, useEffect, useContext } from "react"
import { InstallationsContext } from "@contexts/InstallationsContext"

interface InstallationContextType {
  installation: InstallationType | undefined
  setInstallation: React.Dispatch<React.SetStateAction<InstallationType | undefined>>
}

const defaultValue: InstallationContextType = { installation: undefined, setInstallation: () => {} }

const InstallationContext = createContext<InstallationContextType>(defaultValue)

const InstallationProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { installations } = useContext(InstallationsContext)
  const [installation, setInstallation] = useState<InstallationType | undefined>()

  useEffect(() => {
    ;(async (): Promise<void> => {
      window.api.logMessage("info", `[context] [InstallationContext] Setting local stored or latest created installation`)
      const localStorageInstallation = window.localStorage.getItem("installation") || installations[0]?.id
      const newInstallation = installations.find((current) => current.id === localStorageInstallation)
      setInstallation(newInstallation || installations[0])
    })()
  }, [installations])

  return <InstallationContext.Provider value={{ installation, setInstallation }}>{children}</InstallationContext.Provider>
}

export { InstallationContext, InstallationProvider }
