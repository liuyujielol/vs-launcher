import { useEffect, useContext } from "react"
import { NotificationsContext } from "@contexts/NotificationsContext"

function Mods(): JSX.Element {
  const { addNotification } = useContext(NotificationsContext)

  useEffect(() => {
    addNotification("Cargada page mods", "Cargada página mods", "info")
    addNotification("Cargada page mods", "Cargada página mods", "error")
    addNotification("Cargada page mods", "Cargada página mods", "success")
  }, [])

  return <h1>Mods</h1>
}

export default Mods
