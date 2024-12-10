import { useEffect, useState, useContext } from "react"
import { useTranslation } from "react-i18next"
import { NotificationsContext } from "@contexts/NotificationsContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import Button from "@components/Buttons"

function MenuSearchForAVersion({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const { t } = useTranslation()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [gameVersionFound, setGameVersionFound] = useState<InstalledGameVersionType>()

  useEffect(() => {
    if (selectedFolder) {
      ;(async (): Promise<void> => {
        const res = await window.api.lookForAGameVersion(selectedFolder)

        if (!res.exists) {
          window.api.logMessage("info", `[component] [MenuInstallNewVersion] Game not found at ${selectedFolder}`)
          addNotification(t("notification-title-versionNotFound"), t("notification-body-versionNotFound"), "error")
          setGameVersionFound(undefined)
          return
        }

        if (installedGameVersions.some((igv) => igv.version === res.installedGameVersion?.version || igv.path === res.installedGameVersion?.path)) {
          window.api.logMessage("info", `[component] [MenuInstallNewVersion] Game version ${res.installedGameVersion?.version} already installed`)
          addNotification(t("notification-title-versionAlreadyInstalled"), t("notification-body-versionAlreadyInstalled").replace("{version}", `${res.installedGameVersion?.version}`), "error")
          return
        }

        setGameVersionFound(res.installedGameVersion)
      })()
    }
  }, [selectedFolder])

  const handleSelection = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Trying to add the selected version: ${gameVersionFound?.version}`)

      setInstalledGameVersions([...installedGameVersions, { version: gameVersionFound?.version as string, path: selectedFolder }])
      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Game version ${gameVersionFound?.version} found at: ${selectedFolder}`)
      addNotification(t("notification-title-versionSuccesfullyFound"), t("notification-body-versionSuccesfullyFound").replace("{version}", `${gameVersionFound?.version}`), "success")
    } catch (error) {
      window.api.logMessage("error", `[component] [MenuInstallNewVersion] Error while looking for the game at ${selectedFolder}: ${error}`)
      addNotification(t("notification-title-versionErrorLookingForAVersion"), t("notification-body-versionErrorLookingForAVersion"), "error")
    }
  }

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{t("component-searchForAVersionMenu-selectFolder")}</h3>
        <div className="w-full flex gap-4 items-center">
          <Button
            btnType="custom"
            className="w-fit h-10 bg-zinc-900"
            onClick={async () => {
              const userSelectedFolder = await window.api.selectFolderDialog()
              setSelectedFolder(userSelectedFolder)
            }}
          >
            {t("component-searchForAVersionMenu-select")}
          </Button>
          <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none overflow-x-scroll whitespace-nowrap">{selectedFolder}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{t("component-searchForAVersionMenu-versionDetected")}</h3>
        <div className="w-full flex gap-4 items-center">
          <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none">{gameVersionFound?.version}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" disabled={!selectedFolder || !gameVersionFound} onClick={handleSelection}>
          {t("component-searchForAVersionMenu-addIt")}
        </Button>
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)}>
          {t("component-searchForAVersionMenu-close")}
        </Button>
      </div>
    </>
  )
}

export default MenuSearchForAVersion
