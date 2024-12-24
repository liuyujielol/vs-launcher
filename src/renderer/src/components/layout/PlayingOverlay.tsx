import { motion, AnimatePresence } from "motion/react"
import { useTranslation } from "react-i18next"

import { usePlayingContext } from "@renderer/contexts/PlayingContext"

function PlayingOverlay(): JSX.Element {
  const { t } = useTranslation()

  const { playing } = usePlayingContext()

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 z-[500] bg-zinc-950/95 select-none"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-4xl font-bold">{t("components.gameRunningOverlay.title")}</h1>
          <p className="text-xl">{t("components.gameRunningOverlay.desc")}</p>
          <p className="text-zinc-500">{t("components.gameRunningOverlay.subDesc")}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default PlayingOverlay
