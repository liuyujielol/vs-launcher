import { useEffect, useContext } from "react"
import { NotificationsContext } from "@contexts/NotificationsContext"

function Mods(): JSX.Element {
  const { addNotification } = useContext(NotificationsContext)

  useEffect(() => {
    addNotification("Cargada page mods", "Cargada página mods", "info")
  }, [])

  return <h1>Mods</h1>
}

export default Mods
