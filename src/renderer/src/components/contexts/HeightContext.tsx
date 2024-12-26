import { useState, createContext, useContext } from "react"

import { HEIGHTS_TYPES } from "@renderer/configs/types"

interface HeightContextType {
  height: HEIGHTS_TYPES
  setHeight: React.Dispatch<React.SetStateAction<HEIGHTS_TYPES>>
}

const defaultValue: HeightContextType = { height: "fit", setHeight: () => {} }

const HeightContext = createContext<HeightContextType>(defaultValue)

const HeightProvider = ({ children, initial = defaultValue.height }: { children: React.ReactNode; initial?: HEIGHTS_TYPES }): JSX.Element => {
  const [height, setHeight] = useState<HEIGHTS_TYPES>(initial)

  return <HeightContext.Provider value={{ height, setHeight }}>{children}</HeightContext.Provider>
}

const useHeightContext = (): HeightContextType => {
  const context = useContext(HeightContext)
  if (!context) {
    throw new Error("useHeightContext must be used within an HeightProvider")
  }
  return context
}

export { HeightProvider, useHeightContext }
