import { useState, useContext } from "react"
import { InstallationsContext } from "@contexts/InstallationsContext"
import { InstallationContext } from "@contexts/InstallationContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import Button from "@components/Buttons"

function MenuDeleteInstallation({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { installations, setInstallations } = useContext(InstallationsContext)
  const { installation } = useContext(InstallationContext)
  const { addNotification } = useContext(NotificationsContext)
  const [deleteData, setDeleteData] = useState<boolean>(false)

  const handleDeleting = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuDeleteInstallation] Deleting installation ${installation?.name} with path ${installation?.path}`)

      if (deleteData) {
        window.api.logMessage("info", `[component] [MenuDeleteInstallation] Deleting installation data from ${installation?.name} with path ${installation?.path}`)
        const deleted = await window.api.deletePath(installation!.path)

        if (!deleted) {
          window.api.logMessage("error", `[component] [MenuDeleteInstallation] Error deleting installation data from ${installation?.name} with path ${installation?.path}`)
          throw new Error("Error deleting installation data")
        }
      }

      setInstallations(installations.filter((current) => current.id !== installation!.id))

      window.api.logMessage("info", `[component] [MenuDeleteInstallation] Deleted installation ${installation?.name} with path ${installation?.path}`)
      addNotification("Successfully deteled installation", `Installation ${installation?.name} deleted successfully`, "success")
    } catch (err) {
      window.api.logMessage("error", `[component] [MenuDeleteInstallation] Error while deleting installation ${installation?.name} with path ${installation?.path}: ${err}`)
      addNotification("Error deleting installation", `An error ocurred while deleting installation ${installation?.name}`, "error")
    } finally {
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <p>
        Are you sure you want to delete this installation? <span className="font-bold">{installation?.name}</span>
      </p>
      <div className="flex gap-2 justify-end">
        <span>Delete data (Not reversible):</span>
        <input type="checkbox" name="Delete data?" onChange={(e) => setDeleteData(e.target.checked)} />
      </div>
      <div className="flex flex-col items-center text-sm text-zinc-400">
        <p>If you dont delete data you will be able to access it here:</p>
        <p>{installation?.path}</p>
      </div>
      <div className="flex gap-4">
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={handleDeleting}>
          Delete
        </Button>
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)}>
          Cancel
        </Button>
      </div>
    </>
  )
}

export default MenuDeleteInstallation
