import { createContext, useState } from "react"

interface InstallationContextType {
  installation: InstallationType
  setInstallation: React.Dispatch<React.SetStateAction<InstallationType>>
}

const defaultValue: InstallationContextType = { installation: { id: "", name: "", path: "", version: "", mods: [] }, setInstallation: () => {} }

const InstallationContext = createContext<InstallationContextType>(defaultValue)

const InstallationProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [installation, setInstallation] = useState<InstallationType>(defaultValue.installation)

  return <InstallationContext.Provider value={{ installation, setInstallation }}>{children}</InstallationContext.Provider>
}

export { InstallationContext, InstallationProvider }
