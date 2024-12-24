import { useState, createContext, useContext } from "react"

import { OPEN_DIRECTIONS_TYPES } from "@renderer/configs/types"

interface OpenDirectionContextType {
  openDirection: OPEN_DIRECTIONS_TYPES
  setOpenDirection: React.Dispatch<React.SetStateAction<OPEN_DIRECTIONS_TYPES>>
}

const defaultValue: OpenDirectionContextType = { openDirection: "bottom", setOpenDirection: () => {} }

const OpenDirectionContext = createContext<OpenDirectionContextType>(defaultValue)

const OpenDirectionProvider = ({ children, initial = defaultValue.openDirection }: { children: React.ReactNode; initial?: OPEN_DIRECTIONS_TYPES }): JSX.Element => {
  const [openDirection, setOpenDirection] = useState<OPEN_DIRECTIONS_TYPES>(initial)

  return <OpenDirectionContext.Provider value={{ openDirection, setOpenDirection }}>{children}</OpenDirectionContext.Provider>
}

const useOpenDirectionContext = (): OpenDirectionContextType => {
  const context = useContext(OpenDirectionContext)
  if (!context) {
    throw new Error("useOpenDirectionContext must be used within an OpenDirectionProvider")
  }
  return context
}

export { OpenDirectionProvider, useOpenDirectionContext }
