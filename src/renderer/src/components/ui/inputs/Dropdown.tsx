import { useEffect } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "motion/react"

import { BG_COLORS, BG_COLORS_TYPES, HEIGHTS, HEIGHTS_TYPES, WIDTHS, WIDTHS_TYPES, OPEN_DIRECTIONS_TYPES } from "@renderer/configs/types"

import { IsOpenProvider, useIsOpenContext } from "@renderer/components/contexts/IsOpenContext"
import { BgColorProvider, useBgColorContext } from "@renderer/components/contexts/BgColorContext"
import { OpenDirectionProvider, useOpenDirectionContext } from "@renderer/components/contexts/OpenDirectionContext"
import { IsDisabledProvider, useIsDisabledContext } from "@renderer/components/contexts/IsDisabledContext"

interface DropdownProps {
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
  bgColor?: BG_COLORS_TYPES
  openDirection?: OPEN_DIRECTIONS_TYPES
  disabled?: boolean
  children: React.ReactNode
}

function DropdownWrapper({ width = "fit", height = "fit", bgColor = "dark", openDirection = "bottom", disabled = false, children }: DropdownProps): JSX.Element {
  return (
    <IsOpenProvider>
      <IsDisabledProvider>
        <BgColorProvider>
          <OpenDirectionProvider>
            <DropdownInner width={width} height={height} bgColor={bgColor} openDirection={openDirection} disabled={disabled}>
              {children}
            </DropdownInner>
          </OpenDirectionProvider>
        </BgColorProvider>
      </IsDisabledProvider>
    </IsOpenProvider>
  )
}

function DropdownInner({ width = "fit", height = "fit", bgColor = "dark", openDirection = "bottom", disabled = false, children }: DropdownProps): JSX.Element {
  const { setBgColor } = useBgColorContext()
  const { setOpenDirection } = useOpenDirectionContext()
  const { setIsDisabled } = useIsDisabledContext()
  const { setIsOpen } = useIsOpenContext()

  useEffect(() => {
    setBgColor(bgColor)
    setOpenDirection(openDirection)
  }, [])

  useEffect(() => {
    setIsDisabled(disabled)

    disabled && setIsOpen(false)
  }, [disabled])

  return <div className={`relative ${WIDTHS[width]} ${HEIGHTS[height]}`}>{children}</div>
}

function DropdownSelected({ children }: { children: React.ReactNode }): JSX.Element {
  const { t } = useTranslation()

  const { isOpen, setIsOpen } = useIsOpenContext()
  const { isDisabled } = useIsDisabledContext()
  const { bgColor } = useBgColorContext()
  const { openDirection } = useOpenDirectionContext()

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      title={isOpen ? t("generic.closeMenu") : t("generic.openMenu")}
      onClick={() => (isOpen ? setIsOpen(false) : isDisabled ? null : setIsOpen(true))}
      className={`${BG_COLORS[bgColor]} shadow shadow-zinc-900 hover:shadow-none w-full h-full flex items-center justify-between gap-2 px-2 py-1 rounded overflow-hidden`}
    >
      {children}
      {isOpen ? (
        <PiCaretDownBold className={`${openDirection === "bottom" ? "-rotate-180" : "rotate-0"} duration-200 text-lg shrink-0`} />
      ) : (
        <PiCaretDownBold className={`${openDirection === "bottom" ? "rotate-0" : "-rotate-180"} duration-200 text-lg shrink-0`} />
      )}
    </motion.button>
  )
}

function DropdownList({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = useIsOpenContext()
  const { openDirection } = useOpenDirectionContext()
  const { bgColor } = useBgColorContext()
  const { isDisabled } = useIsDisabledContext()

  useEffect(() => {
    console.log("IsDisabled cambiado")
  }, [isDisabled])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          className={`${BG_COLORS[bgColor]} ${isDisabled ? "pointer-events-none opacity-50" : ""} snap-y snap-mandatory absolute bg-zinc-800 left-0 z-10 w-full flex flex-col max-h-40 overflow-y-scroll overflow-x-hidden rounded shadow shadow-zinc-900 ${openDirection === "bottom" ? "top-full mt-1" : "bottom-full mb-1"}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DropdownItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }): JSX.Element {
  const { setIsOpen } = useIsOpenContext()

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        onClick()
        setIsOpen(false)
      }}
      className={`snap-start w-full flex items-center justify-start px-2 py-1 hover:pl-3 hover:pr-1 duration-100 even:bg-zinc-800`}
    >
      {children}
    </motion.button>
  )
}

export { DropdownWrapper, DropdownSelected, DropdownList, DropdownItem }
