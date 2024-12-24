import { motion, AnimatePresence } from "motion/react"

import { useTaskContext } from "@renderer/contexts/TaskManagerContext"

function PlayingOverlay(): JSX.Element {
  const { state } = useTaskContext()

  return (
    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex flex-col items-center justify-center gap-4 z-[500] bg-zinc-950/95 select-none" onClick={(e) => e.stopPropagation()}>
      <AnimatePresence>
        {state.tasks.map((task) => {
          return (
            <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-4xl font-bold">{task.id}</h1>
              {task.status === "in-progress" && (
                <div className="w-full h-2 bg-zinc-900 rounded-full">
                  <motion.div className={`h-full bg-vs rounded-full`} initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ ease: "easeInOut", duration: 0.2 }}></motion.div>
                </div>
              )}
              {task.status === "failed" && <p className="text-2xl font-bold">Error</p>}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default PlayingOverlay
