import { useState, useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { InstallationsContext } from "@contexts/InstallationsContext"
import { InstallationContext } from "@contexts/InstallationContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import Button from "@components/utils/Buttons"
import InViewItem from "@components/utils/InViewItem"

function MenuEditInstallation({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const editInstallationListParentRef = useRef(null)
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { installations, setInstallations } = useContext(InstallationsContext)
  const { installation } = useContext(InstallationContext)
  const { t } = useTranslation()
  const [selectedInstalledVersion, setSelectedInstalledVersion] = useState<InstalledGameVersionType>(
    installedGameVersions.find((igv) => igv.version === installation!.version) || installedGameVersions[0]
  )
  const [installationName, setInstallationName] = useState<string>(installation!.name)

  const handleEditInstallation = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuEditInstallation] Editing installation ${installationName}`)
      const newInstallation: InstallationType = {
        name: installationName,
        version: selectedInstalledVersion.version,
        path: installation!.path,
        id: installation!.id,
        mods: installation!.mods
      }

      setInstallations([...installations.filter((ins) => ins.id !== installation!.id), newInstallation])
      window.localStorage.setItem("installation", newInstallation.id)

      window.api.logMessage("info", `[component] [MenuEditInstallation] Edited installation ${installationName}`)
      addNotification(t("notification-title-installationSuccesfullyEdited"), t("notification-body-installationSuccesfullyEdited").replace("{installation}", installationName), "success")
    } catch (err) {
      window.api.logMessage("error", `[component] [MenuEditInstallation] Error while editing installation ${installationName}: ${err}`)
      addNotification(t("notification-title-installationErrorEditing"), t("notification-body-installationErrorEditing").replace("{installation}", installationName), "error")
    } finally {
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="w-[600px] flex flex-col items-center p-4 gap-6">
      <h2 className="text-2xl font-bold">{t("component-editInstallationMenu-title")}</h2>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{t("component-edditInstallationMenu-changeName")}</h3>
          <span className="text-zinc-400">({t("component-addInstallationMenu-minMaxCharacters").replace("{min}", "5").replace("{max}", "50")})</span>
        </div>
        <input
          type="text"
          className={`w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 ${installationName.length < 5 || installationName.length > 50 ? "bg-red-800" : "bg-zinc-900"} select-none overflow-x-scroll whitespace-nowrap`}
          placeholder="Installation name"
          value={installationName}
          onChange={(e) => setInstallationName(e.target.value)}
        />
      </div>

      <div className="w-full max-h-[200px] flex flex-col gap-2">
        <h3 className="font-bold">{t("component-edditInstallationMenu-selectVersion")}</h3>
        <div ref={editInstallationListParentRef} className="w-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {installedGameVersions.length < 1 ? (
            <div className="w-full h-full flex flex-col justify-center gap-2 p-2 items-center text-center">
              <p className="font-bold">{t("component-edditInstallationMenu-noVersionsFound")}</p>
              <p className="text-zinc-400 text-xs">
                {t("component-addInstallationMenu-noVersionsFoundInstallHere")}{" "}
                <Link to={"/versions"} className="text-vs" onClick={() => setIsMenuOpen(false)}>
                  {t("component-mainMenu-versionsTitle")}
                </Link>
              </p>
            </div>
          ) : (
            <>
              {installedGameVersions.map((current) => (
                <InViewItem key={current.version} parent={editInstallationListParentRef}>
                  <button
                    className={`w-full flex justify-between px-2 py-1 font-bold rounded-md shadow-md shadow-zinc-950 disabled:shadow-none disabled:opacity-50  hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${current.version === selectedInstalledVersion?.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                    onClick={() => setSelectedInstalledVersion(current)}
                  >
                    <span>{current.version}</span>
                  </button>
                </InViewItem>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          btnType="custom"
          className="w-24 h-10 bg-zinc-900"
          disabled={installationName.length < 5 || installationName.length > 50 || !selectedInstalledVersion}
          onClick={() => handleEditInstallation()}
        >
          {t("component-edditInstallationMenu-edit")}
        </Button>
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)}>
          {t("component-edditInstallationMenu-close")}
        </Button>
      </div>
    </div>
  )
}

export default MenuEditInstallation
