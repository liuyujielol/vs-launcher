import { useState, createContext, useContext } from "react"

import { BG_COLORS_TYPES } from "@renderer/configs/types"

interface BgColorContextType {
  bgColor: BG_COLORS_TYPES
  setBgColor: React.Dispatch<React.SetStateAction<BG_COLORS_TYPES>>
}

const defaultValue: BgColorContextType = { bgColor: "dark", setBgColor: () => {} }

const BgColorContext = createContext<BgColorContextType>(defaultValue)

const BgColorProvider = ({ children, initial = defaultValue.bgColor }: { children: React.ReactNode; initial?: BG_COLORS_TYPES }): JSX.Element => {
  const [bgColor, setBgColor] = useState<BG_COLORS_TYPES>(initial)

  return <BgColorContext.Provider value={{ bgColor, setBgColor }}>{children}</BgColorContext.Provider>
}

const useBgColorContext = (): BgColorContextType => {
  const context = useContext(BgColorContext)
  if (!context) {
    throw new Error("useBgColorContext must be used within an BgColorProvider")
  }
  return context
}

export { BgColorProvider, useBgColorContext }
