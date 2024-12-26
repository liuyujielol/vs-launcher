import { useState, createContext, useContext } from "react"

interface IsOpenContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue: IsOpenContextType = { isOpen: false, setIsOpen: () => {} }

const IsOpenContext = createContext<IsOpenContextType>(defaultValue)

const IsOpenProvider = ({ children, initial = defaultValue.isOpen }: { children: React.ReactNode; initial?: boolean }): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(initial)

  return <IsOpenContext.Provider value={{ isOpen, setIsOpen }}>{children}</IsOpenContext.Provider>
}

const useIsOpenContext = (): IsOpenContextType => {
  const context = useContext(IsOpenContext)
  if (!context) {
    throw new Error("useIsOpenContext must be used within an IsOpenProvider")
  }
  return context
}

export { IsOpenProvider, useIsOpenContext }
