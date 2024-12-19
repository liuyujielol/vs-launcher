import { useState } from "react"

export const useInstallations = (): [InstallationType[], React.Dispatch<React.SetStateAction<InstallationType[]>>] => {
  const [installations, setInstallations] = useState<InstallationType[]>([])

  const setInstallationsCustom = async (value: React.SetStateAction<InstallationType[]>): Promise<void> => {
    window.api.utils.logMessage("info", `[hook] [useInstallations] Setting new installations`)
    const config = await window.api.configManager.getConfig()
    const newInstallations = typeof value === "function" ? value(config.installations) : value
    config.installations = newInstallations
    window.api.configManager.saveConfig(config)
    setInstallations(newInstallations)
  }

  return [installations, setInstallationsCustom]
}
