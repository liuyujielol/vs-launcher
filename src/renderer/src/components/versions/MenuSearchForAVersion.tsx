import { useEffect, useState, useContext } from "react"
import { useTranslation } from "react-i18next"
import { NotificationsContext } from "@contexts/NotificationsContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import Button from "@components/utils/Buttons"

function MenuSearchForAVersion({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const { t } = useTranslation()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [gameVersionFound, setGameVersionFound] = useState<string>("")

  useEffect(() => {
    if (selectedFolder) {
      ;(async (): Promise<void> => {
        const res = await window.api.lookForAGameVersion(selectedFolder)

        if (!res.exists) {
          window.api.logMessage("info", `[component] [MenuInstallNewVersion] Game not found at ${selectedFolder}`)
          addNotification(t("notification-title-versionNotFound"), t("notification-body-versionNotFound"), "error")
          setGameVersionFound("")
          return
        }

        if (installedGameVersions.some((igv) => igv.version === res.installedGameVersion || igv.path === selectedFolder)) {
          window.api.logMessage("info", `[component] [MenuInstallNewVersion] Game version ${res.installedGameVersion} already installed`)
          addNotification(t("notification-title-versionAlreadyInstalled"), t("notification-body-versionAlreadyInstalled").replace("{version}", `${res.installedGameVersion}`), "error")
          return
        }

        setGameVersionFound(res.installedGameVersion as string)
      })()
    }
  }, [selectedFolder])

  const handleSelection = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Trying to add the selected version: ${gameVersionFound}`)

      setInstalledGameVersions([...installedGameVersions, { version: gameVersionFound as string, path: selectedFolder }])
      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Game version ${gameVersionFound} found at: ${selectedFolder}`)
      addNotification(t("notification-title-versionSuccesfullyFound"), t("notification-body-versionSuccesfullyFound").replace("{version}", `${gameVersionFound}`), "success")
    } catch (error) {
      window.api.logMessage("error", `[component] [MenuInstallNewVersion] Error while looking for the game at ${selectedFolder}: ${error}`)
      addNotification(t("notification-title-versionErrorLookingForAVersion"), t("notification-body-versionErrorLookingForAVersion"), "error")
    } finally {
      setGameVersionFound("")
      setSelectedFolder("")
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="w-[600px] flex flex-col items-center p-4 gap-6">
      <h2 className="text-2xl font-bold">{t("component-searchForAVersionMenu-titleSearchForAAversion")}</h2>
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
          <input
            className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none"
            onChange={(e) => setGameVersionFound(e.target.value)}
            value={gameVersionFound}
          />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2 text-sm text-zinc-400">
        <p>{t("component-searchForAVersionMenu-info")}</p>
      </div>

      <div className="flex gap-4">
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" disabled={!selectedFolder || !gameVersionFound} onClick={handleSelection}>
          {t("component-searchForAVersionMenu-addIt")}
        </Button>
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)}>
          {t("component-searchForAVersionMenu-close")}
        </Button>
      </div>
    </div>
  )
}

export default MenuSearchForAVersion
