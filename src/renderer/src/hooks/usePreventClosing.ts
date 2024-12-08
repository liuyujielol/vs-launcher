import { useState } from "react"

export const usePreventClosing = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [preventClosing, setPreventClosing] = useState<boolean>(false)

  const setPreventClosingCustom = async (value: React.SetStateAction<boolean>): Promise<void> => {
    window.api.logMessage("info", `[hook] [useInstallations] Setting new installations`)
    const newPreventClosing = typeof value === "function" ? value(preventClosing) : value
    window.api.setPreventAppClose(newPreventClosing)
    setPreventClosing(newPreventClosing)
  }

  return [preventClosing, setPreventClosingCustom]
}
