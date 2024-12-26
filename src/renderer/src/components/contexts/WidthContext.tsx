import { useState, createContext, useContext } from "react"

import { WIDTHS_TYPES } from "@renderer/configs/types"

interface WidthContextType {
  width: WIDTHS_TYPES
  setWidth: React.Dispatch<React.SetStateAction<WIDTHS_TYPES>>
}

const defaultValue: WidthContextType = { width: "fit", setWidth: () => {} }

const WidthContext = createContext<WidthContextType>(defaultValue)

const WidthProvider = ({ children, initial = defaultValue.width }: { children: React.ReactNode; initial?: WIDTHS_TYPES }): JSX.Element => {
  const [width, setWidth] = useState<WIDTHS_TYPES>(initial)

  return <WidthContext.Provider value={{ width, setWidth }}>{children}</WidthContext.Provider>
}

const useWidthContext = (): WidthContextType => {
  const context = useContext(WidthContext)
  if (!context) {
    throw new Error("useWidthContext must be used within an WidthProvider")
  }
  return context
}

export { WidthProvider, useWidthContext }
