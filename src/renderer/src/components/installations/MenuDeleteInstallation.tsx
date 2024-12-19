import { useState, useContext } from "react"
import { useTranslation } from "react-i18next"
import { InstallationsContext } from "@renderer/contexts/InstallationsContext"
import { InstallationContext } from "@renderer/contexts/InstallationContext"
import { NotificationsContext } from "@renderer/contexts/NotificationsContext"
import Button from "@renderer/components/utils/Buttons"

function MenuDeleteInstallation({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { installations, setInstallations } = useContext(InstallationsContext)
  const { installation } = useContext(InstallationContext)
  const { addNotification } = useContext(NotificationsContext)
  const { t } = useTranslation()
  const [deleteData, setDeleteData] = useState<boolean>(false)

  const handleDeleting = async (): Promise<void> => {
    try {
      window.api.utils.logMessage("info", `[component] [MenuDeleteInstallation] Deleting installation ${installation?.name} with path ${installation?.path}`)

      if (deleteData) {
        window.api.utils.logMessage("info", `[component] [MenuDeleteInstallation] Deleting installation data from ${installation?.name} with path ${installation?.path}`)
        const deleted = await window.api.pathsManager.deletePath(installation!.path)

        if (!deleted) {
          window.api.utils.logMessage("error", `[component] [MenuDeleteInstallation] Error deleting installation data from ${installation?.name} with path ${installation?.path}`)
          throw new Error("Error deleting installation data")
        }
      }

      setInstallations(installations.filter((current) => current.id !== installation!.id))

      window.api.utils.logMessage("info", `[component] [MenuDeleteInstallation] Deleted installation ${installation?.name} with path ${installation?.path}`)
      addNotification(t("notification.title.success"), t("notification-body-installationSuccesfullyDeleted", { installation: installation!.name }), "success")
    } catch (err) {
      window.api.utils.logMessage("error", `[component] [MenuDeleteInstallation] Error while deleting installation ${installation?.name} with path ${installation?.path}: ${err}`)
      addNotification(t("notification.title.error"), t("notification-body-installationErrorDeleting", { installation: installation!.name }), "error")
    } finally {
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="w-[600px] flex flex-col items-center p-4 gap-6">
      <h2 className="text-2xl font-bold">{t("component-deleteInstallationMenu-title")}</h2>
      <p className="text-center">
        {t("component-deleteInstallationMenu-areYouSure")} <span className="font-bold">{installation?.name}</span>
      </p>
      <div className="flex gap-2 justify-end text-center">
        <span>{t("component-deleteInstallationMenu-deleteData")}</span>
        <input type="checkbox" name="Delete data?" onChange={(e) => setDeleteData(e.target.checked)} />
      </div>
      <div className="flex flex-col items-center text-sm text-zinc-400 text-center">
        <p>{t("component-deleteInstallationMenu-ifDontDeleteData")}</p>
        <p>{installation?.path}</p>
      </div>
      <div className="flex gap-4">
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" onClick={handleDeleting}>
          {t("component-deleteInstallationMenu-delete")}
        </Button>
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)}>
          {t("component-deleteInstallationMenu-cancel")}
        </Button>
      </div>
    </div>
  )
}

export default MenuDeleteInstallation
