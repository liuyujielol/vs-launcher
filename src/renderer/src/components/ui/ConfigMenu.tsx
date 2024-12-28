import { AnimatePresence, motion } from "motion/react"
import { PiGearFill } from "react-icons/pi"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"

function ConfigMenu(): JSX.Element {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton className="w-7 h-7 bg-zinc-850 rounded flex items-center justify-center shadow shadow-zinc-900 hover:shadow-none">
            <PiGearFill />
          </PopoverButton>
          <AnimatePresence>
            {open && (
              <PopoverPanel static as={motion.div} initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} anchor="bottom" className="w-80 m-1 z-50 bg-zinc-850 rounded">
                <div className="flex flex-col max-h-80">
                  <AnimatePresence>
                    <div>
                      <h3 className="text-sm font-bold text-center p-2">Config Menu</h3>
                    </div>
                  </AnimatePresence>
                </div>
              </PopoverPanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  )
}

export default ConfigMenu
