import { createContext, useRef, useEffect } from "react"
import { useInstalledGameVersions } from "@hooks/useInstalledGameVersions"

interface InstalledGameVersionsContextType {
  installedGameVersions: InstalledGameVersionType[]
  setInstalledGameVersions: React.Dispatch<React.SetStateAction<InstalledGameVersionType[]>>
}

const defaultValue: InstalledGameVersionsContextType = { installedGameVersions: [], setInstalledGameVersions: () => {} }

const InstalledGameVersionsContext = createContext<InstalledGameVersionsContextType>(defaultValue)

const InstalledGameVersionsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [installedGameVersions, setInstalledGameVersions] = useInstalledGameVersions()

  const firstExecuted = useRef(true)
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (firstExecuted.current) {
        firstExecuted.current = false
        window.api.logMessage("info", `[context] [InstalledGameVersionsContext] Setting installed game versions from config file`)
        const config = await window.api.getConfig()
        setInstalledGameVersions(config.gameVersions)
      }
    })()
  }, [])

  return <InstalledGameVersionsContext.Provider value={{ installedGameVersions, setInstalledGameVersions }}>{children}</InstalledGameVersionsContext.Provider>
}

export { InstalledGameVersionsContext, InstalledGameVersionsProvider }
