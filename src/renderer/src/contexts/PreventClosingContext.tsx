import { createContext } from "react"
import { usePreventClosing } from "@hooks/usePreventClosing"

interface PreventClosingType {
  preventClosing: boolean
  setPreventClosing: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue: PreventClosingType = { preventClosing: false, setPreventClosing: () => {} }

const PreventClosingContext = createContext<PreventClosingType>(defaultValue)

const PreventClosingProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [preventClosing, setPreventClosing] = usePreventClosing()

  return <PreventClosingContext.Provider value={{ preventClosing, setPreventClosing }}>{children}</PreventClosingContext.Provider>
}

export { PreventClosingContext, PreventClosingProvider }
