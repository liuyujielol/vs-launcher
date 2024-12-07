import { useContext } from "react"
import { NotificationsContext } from "@contexts/NotificationsContext"

function NotificationsOVerlay(): JSX.Element {
  const { notifications } = useContext(NotificationsContext)

  return (
    <div className="w-fit h-fit absolute flex flex-col items-end top-0 right-0 z-[1000] p-2">
      {notifications.map(({ id, title, body, type, onClick }) => (
        <div
          key={id}
          onClick={onClick}
          className={`w-fit flex flex-col p-2 rounded-md ${type === "success" ? `bg-green-700` : ""}${type === "info" ? `bg-vs` : ""}${type === "error" ? `bg-red-800` : ""}`}
        >
          <h3 className="font-bold text-zinc-200">{title}</h3>
          <p className="text-zinc-200">{body}</p>
        </div>
      ))}
    </div>
  )
}

export default NotificationsOVerlay
