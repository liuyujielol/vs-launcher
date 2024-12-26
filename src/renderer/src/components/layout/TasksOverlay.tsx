import { AnimatePresence, motion } from "motion/react"
import { PiDownloadFill, PiFileZipFill, PiXBold } from "react-icons/pi"

import { useTaskContext } from "@renderer/contexts/TaskManagerContext"
import { useTranslation } from "react-i18next"

import { FloatingMenuButton, FloatingMenuItem, FloatingMenuList, FloatingMenuWrapper } from "@renderer/components/ui/inputs/FloatingMenu"

const NAME_BY_TYPE = {
  download: "components.tasksOverlay.download",
  extract: "components.tasksOverlay.extract"
}

const FONT_COLOR_TYPES = {
  pending: "text-vs",
  "in-progress": "text-yellow-400",
  failed: "text-red-800",
  completed: "text-lime-600"
}

const ICON_TYPES = {
  download: <PiDownloadFill />,
  extract: <PiFileZipFill />
}

function PlayingOverlay(): JSX.Element {
  const { t } = useTranslation()
  const { state, removeTask } = useTaskContext()

  return (
    <FloatingMenuWrapper width="sm" height="sm">
      <FloatingMenuButton>
        <PiDownloadFill className="text-2xl" />
      </FloatingMenuButton>
      <FloatingMenuList>
        <AnimatePresence>
          {state.tasks.length < 1 && (
            <FloatingMenuItem>
              <h3 className="w-80 text-sm font-bold text-center p-2">{t("components.tasksOverlay.noTasksAvailable")}</h3>
            </FloatingMenuItem>
          )}
          {state.tasks.map((task) => {
            return (
              <FloatingMenuItem key={task.id}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-80 flex flex-col">
                  <div className="w-full flex justify-between gap-2 p-1">
                    <div className="w-full flex items-center gap-2">
                      <span className={`text-xl p-2 ${FONT_COLOR_TYPES[task.status]}`}>{ICON_TYPES[task.type]}</span>
                      <div className="flex flex-col items-start justify-center select-none">
                        <h3 className="font-bold text-sm">{`${t(NAME_BY_TYPE[task.type])} - ${task.name}`}</h3>
                        <p className="text-xs text-zinc-500">{task.desc}</p>
                        {task.status === "failed" && <p className={`text-xs ${FONT_COLOR_TYPES["failed"]}`}>{t("components.tasksOverlay.error")}</p>}
                      </div>
                    </div>
                    {(task.status === "completed" || task.status === "failed") && (
                      <button className="p-1 text-zinc-500" title={t("generic.discard")} onClick={() => removeTask(task.id)}>
                        <PiXBold />
                      </button>
                    )}
                  </div>
                  {task.status === "in-progress" && (
                    <div className="w-full h-1 bg-zinc-900 rounded-full">
                      <motion.div
                        className={`h-full bg-vs rounded-full`}
                        initial={{ width: `${task.progress}%` }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ ease: "easeInOut", duration: 0.2 }}
                      ></motion.div>
                    </div>
                  )}
                </motion.div>
              </FloatingMenuItem>
            )
          })}
        </AnimatePresence>
      </FloatingMenuList>
    </FloatingMenuWrapper>
  )
}

export default PlayingOverlay
