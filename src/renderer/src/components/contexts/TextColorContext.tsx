import { useState, createContext, useContext } from "react"

import { TEXT_COLORS_TYPES } from "@renderer/configs/types"

interface TextColorContextType {
  textColor: TEXT_COLORS_TYPES
  setTextColor: React.Dispatch<React.SetStateAction<TEXT_COLORS_TYPES>>
}

const defaultValue: TextColorContextType = { textColor: "dark", setTextColor: () => {} }

const TextColorContext = createContext<TextColorContextType>(defaultValue)

const TextColorProvider = ({ children, initial = defaultValue.textColor }: { children: React.ReactNode; initial?: TEXT_COLORS_TYPES }): JSX.Element => {
  const [textColor, setTextColor] = useState<TEXT_COLORS_TYPES>(initial)

  return <TextColorContext.Provider value={{ textColor, setTextColor }}>{children}</TextColorContext.Provider>
}

const useTextColorContext = (): TextColorContextType => {
  const context = useContext(TextColorContext)
  if (!context) {
    throw new Error("useTextColorContext must be used within an TextColorProvider")
  }
  return context
}

export { TextColorProvider, useTextColorContext }
