import { useContext } from "react"
import { motion, AnimatePresence } from "motion/react"
import { NotificationsContext } from "@contexts/NotificationsContext"

function NotificationsOVerlay(): JSX.Element {
  const { notifications } = useContext(NotificationsContext)

  return (
    <div className="w-[300px] h-fit absolute flex flex-col items-end top-0 right-0 z-[1000] p-2 gap-2">
      <AnimatePresence>
        {notifications.map(({ id, title, body, type, onClick }) => (
          <motion.div
            key={id}
            onClick={onClick}
            className={`w-[300px] flex flex-col p-2 rounded-md ${type === "success" ? `bg-green-700` : ""}${type === "info" ? `bg-vs` : ""}${type === "error" ? `bg-red-800` : ""}`}
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
          >
            <h3 className="font-bold select-none">{title}</h3>
            <p className="select-none">{body}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationsOVerlay
