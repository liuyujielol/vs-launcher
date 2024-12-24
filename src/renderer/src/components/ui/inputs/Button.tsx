import React from "react"
import { motion } from "motion/react"

import { BG_COLORS, BG_COLORS_TYPES, HEIGHTS, HEIGHTS_TYPES, WIDTHS, WIDTHS_TYPES } from "@renderer/configs/types"

interface ButtonProps {
  /**
   * @default "fit"
   */
  width?: WIDTHS_TYPES
  /**
   * @default "fit"
   */
  height?: HEIGHTS_TYPES
  /**
   * @default "dark"
   */
  color?: BG_COLORS_TYPES
  title?: string
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function Button({ width = "fit", height = "fit", color = "dark", title, disabled, onClick, children }: ButtonProps): JSX.Element {
  return (
    <motion.button
      className={`${WIDTHS[width]} ${HEIGHTS[height]} ${BG_COLORS[color]} shrink-0 shadow shadow-zinc-900 hover:shadow-none p-1 flex items-center justify-center font-bold rounded disabled:opacity-50`}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

export default Button
