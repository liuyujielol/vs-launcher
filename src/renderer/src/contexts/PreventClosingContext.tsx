import { createContext, useContext } from "react"

import { usePreventClosing } from "@renderer/hooks/usePreventClosing"

interface PreventClosingContextType {
  preventClosing: boolean
  setPreventClosing: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue: PreventClosingContextType = { preventClosing: false, setPreventClosing: () => {} }

const PreventClosingContext = createContext<PreventClosingContextType>(defaultValue)

const PreventClosingProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [preventClosing, setPreventClosing] = usePreventClosing()

  return <PreventClosingContext.Provider value={{ preventClosing, setPreventClosing }}>{children}</PreventClosingContext.Provider>
}

const usePreventClosingContext = (): PreventClosingContextType => {
  const context = useContext(PreventClosingContext)
  if (!context) {
    throw new Error("usePreventClosingContext must be used within an PreventClosingContextType")
  }
  return context
}

export { PreventClosingProvider, usePreventClosingContext }
