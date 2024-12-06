import { useState } from "react"

export const useInstalledGameVersions = (): [InstalledGameVersionType[], React.Dispatch<React.SetStateAction<InstalledGameVersionType[]>>] => {
  const [installedGameVersions, setInstalledGameVersions] = useState<InstalledGameVersionType[]>([])

  const setInstalledGameVersionsCustom = async (value: React.SetStateAction<InstalledGameVersionType[]>): Promise<void> => {
    const config = await window.api.getConfig()
    const newGameVersions = typeof value === "function" ? value(config.gameVersions) : value
    config.gameVersions = newGameVersions
    window.api.saveConfig(config)
    setInstalledGameVersions(newGameVersions)
  }

  return [installedGameVersions, setInstalledGameVersionsCustom]
}
