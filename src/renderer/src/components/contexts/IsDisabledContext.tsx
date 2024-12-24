import { useState, createContext, useContext } from "react"

interface IsDisabledContextType {
  isDisabled: boolean
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue: IsDisabledContextType = { isDisabled: false, setIsDisabled: () => {} }

const IsDisabledContext = createContext<IsDisabledContextType>(defaultValue)

const IsDisabledProvider = ({ children, initial = defaultValue.isDisabled }: { children: React.ReactNode; initial?: boolean }): JSX.Element => {
  const [isDisabled, setIsDisabled] = useState<boolean>(initial)

  return <IsDisabledContext.Provider value={{ isDisabled, setIsDisabled }}>{children}</IsDisabledContext.Provider>
}

const useIsDisabledContext = (): IsDisabledContextType => {
  const context = useContext(IsDisabledContext)
  if (!context) {
    throw new Error("useIsDisabledContext must be used within an IsDisabledProvider")
  }
  return context
}

export { IsDisabledProvider, useIsDisabledContext }
