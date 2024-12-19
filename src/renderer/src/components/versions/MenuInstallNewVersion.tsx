import { useEffect, useState, useContext, useRef } from "react"
import axios from "axios"
import { motion } from "motion/react"
import { FaSpinner } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import { NotificationsContext } from "@renderer/contexts/NotificationsContext"
import { InstalledGameVersionsContext } from "@renderer/contexts/InstalledGameVersionsContext"
import { PreventClosingContext } from "@renderer/contexts/PreventClosingContext"
import Button from "@renderer/components/utils/Buttons"
import InViewItem from "@renderer/components/utils/InViewItem"

function MenuInstallNewVersion({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const installNewVersionListParentRef = useRef(null)
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const { preventClosing, setPreventClosing } = useContext(PreventClosingContext)
  const { t } = useTranslation()
  const [availableGameVersions, setAvailableGameVersions] = useState<GameVersionType[]>([])
  const [selectedGameVersion, setSelectedGameVersion] = useState<GameVersionType>()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [extractProgress, setExtractProgress] = useState<number>(0)

  useEffect(() => {
    ;(async (): Promise<void> => {
      window.api.utils.logMessage("info", `[component] [MenuInstallNewVersion] Fetching available game versions`)
      const { data }: { data: GameVersionType[] } = await axios("https://vslapi.xurxomf.xyz/versions")
      setAvailableGameVersions(data)

      window.api.utils.logMessage("info", `[component] [MenuInstallNewVersion] Adding donwload and extract progress listeners`)
      window.api.gameVersionsManager.onDownloadGameVersionProgress((_event, progress) => {
        setDownloadProgress(progress)
      })

      window.api.gameVersionsManager.onExtractGameVersionProgress((_event, progress) => {
        setExtractProgress(progress)
      })
    })()
  }, [])

  useEffect(() => {
    setSelectedGameVersion(availableGameVersions.find((agv) => !installedGameVersions.some((igv) => igv.version === agv.version)))
  }, [availableGameVersions])

  useEffect(() => {
    ;(async (): Promise<void> => {
      if (selectedGameVersion === undefined) return
      const currentUserDataPath = await window.api.pathsManager.getCurrentUserDataPath()
      setSelectedFolder(await window.api.pathsManager.formatPath([currentUserDataPath, "VSLGameVersions", selectedGameVersion.version]))
    })()
  }, [selectedGameVersion])

  const handleInstallation = async (): Promise<void> => {
    try {
      window.api.utils.logMessage("info", `[component] [MenuInstallNewVersion] Starting version installation: ${selectedGameVersion?.version}`)
      setPreventClosing(true)

      const filePath = await window.api.gameVersionsManager.downloadGameVersion(selectedGameVersion as GameVersionType, selectedFolder)
      const result = await window.api.gameVersionsManager.extractGameVersion(filePath, selectedFolder)

      if (result) {
        window.api.utils.logMessage(
          "info",
          `[component] [MenuInstallNewVersion] Game version ${selectedGameVersion?.version} installed successfully. Updating installed game versions and changing selected game version`
        )
        addNotification(t("notification-title-versionSuccesfullyInstalled"), t("notification-body-versionSuccesfullyInstalled", { version: selectedGameVersion?.version }), "success")
        setInstalledGameVersions([...installedGameVersions, { version: selectedGameVersion?.version as string, path: selectedFolder }])
        setSelectedGameVersion(availableGameVersions.find((agv) => !installedGameVersions.some((igv) => igv.version === agv.version)))
      }

      window.api.utils.logMessage("info", `[component] [MenuInstallNewVersion] Version installation finished: ${selectedGameVersion?.version}`)
    } catch (error) {
      window.api.utils.logMessage("error", `[component] [MenuInstallNewVersion] Error while installing game version ${selectedGameVersion?.version}: ${error}`)
      addNotification(t("notification-title-versionErrorInstalling"), t("notification-body-versionErrorInstalling", { version: selectedGameVersion?.version }), "error")
    } finally {
      setPreventClosing(false)
      setDownloadProgress(0)
      setExtractProgress(0)
    }
  }

  return (
    <div className="w-[600px] flex flex-col items-center p-4 gap-6">
      <h2 className="text-2xl font-bold">{t("component-installNewVersionMenu-titleInstallNewVersion")}</h2>
      <div className="w-full max-h-[200px] flex flex-col gap-2">
        <h3 className="font-bold">{t("component-installNewVersionMenu-selectVersion")}</h3>
        <div ref={installNewVersionListParentRef} className="w-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {availableGameVersions.length < 1 ? (
            <div className="w-full h-full flex justify-center items-center text-center">
              <p>{t("component-installNewVersionMenu-noVersionsFound")}</p>
            </div>
          ) : (
            <>
              {availableGameVersions.map((current) => (
                <InViewItem key={current.version} parent={installNewVersionListParentRef}>
                  <button
                    className={`w-full flex justify-between px-2 py-1 font-bold rounded-md shadow-md shadow-zinc-950 disabled:shadow-none disabled:opacity-50  hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${current.version === selectedGameVersion?.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                    onClick={() => setSelectedGameVersion(current)}
                    disabled={installedGameVersions.some((igv) => igv.version === current.version) || preventClosing}
                  >
                    <span>{current.version}</span>
                    <span>{installedGameVersions.find((igv) => igv.version === current.version) ? t("component-installNewVersionMenu-installed") : ""}</span>
                  </button>
                </InViewItem>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{t("component-installNewVersionMenu-selectFolder")}</h3>
        <div className="w-full flex gap-4 items-center">
          <Button
            btnType="custom"
            className="w-fit h-10 bg-zinc-900"
            disabled={preventClosing}
            onClick={async () => {
              const userSelectedFolder = await window.api.utils.selectFolderDialog()
              setSelectedFolder(userSelectedFolder)
            }}
          >
            {t("component-installNewVersionMenu-select")}
          </Button>
          <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none overflow-x-scroll whitespace-nowrap">{selectedFolder}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{t("component-installNewVersionMenu-downloaded")}</h3>
        <div className="w-full h-2 bg-zinc-900 rounded-full">
          <motion.div className={`h-full bg-vs rounded-full`} initial={{ width: 0 }} animate={{ width: `${downloadProgress}%` }} transition={{ ease: "easeInOut", duration: 0.2 }}></motion.div>
        </div>

        <h3 className="font-bold">{t("component-installNewVersionMenu-extracted")}</h3>
        <div className="w-full h-2 bg-zinc-900 rounded-full">
          <motion.div className={`h-full bg-vs rounded-full`} initial={{ width: 0 }} animate={{ width: `${extractProgress}%` }} transition={{ ease: "easeInOut", duration: 0.2 }}></motion.div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" disabled={!selectedGameVersion || preventClosing || !selectedFolder} onClick={handleInstallation}>
          {preventClosing ? (
            <div>
              <FaSpinner className="animate-spin" />
            </div>
          ) : (
            t("component-installNewVersionMenu-install")
          )}
        </Button>
        <Button btnType="custom" className="w-fit h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)} disabled={preventClosing}>
          {t("component-installNewVersionMenu-close")}
        </Button>
      </div>
    </div>
  )
}

export default MenuInstallNewVersion
