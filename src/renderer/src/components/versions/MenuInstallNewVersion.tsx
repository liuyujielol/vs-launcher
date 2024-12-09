import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { motion } from "motion/react"
import { FaSpinner } from "react-icons/fa6"
import { LanguageContext } from "@contexts/LanguageContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { PreventClosingContext } from "@contexts/PreventClosingContext"
import Button from "@components/Buttons"

function MenuInstallNewVersion({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const { setPreventClosing } = useContext(PreventClosingContext)
  const { getKey } = useContext(LanguageContext)
  const [availableGameVersions, setAvailableGameVersions] = useState<GameVersionType[]>([])
  const [selectedGameVersion, setSelectedGameVersion] = useState<GameVersionType>()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [installing, setInstalling] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [extractProgress, setExtractProgress] = useState<number>(0)

  useEffect(() => {
    ;(async (): Promise<void> => {
      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Fetching available game versions`)
      const { data }: { data: GameVersionType[] } = await axios("http://localhost:3000/versions")
      setAvailableGameVersions(data)

      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Adding donwload and extract progress listeners`)
      window.api.onDownloadGameVersionProgress((_event, progress) => {
        setDownloadProgress(progress)
      })

      window.api.onExtractGameVersionProgress((_event, progress) => {
        setExtractProgress(progress)
      })
    })()
  }, [])

  useEffect(() => {
    setSelectedGameVersion(availableGameVersions.find((agv) => !installedGameVersions.some((igv) => igv.version === agv.version)))
  }, [availableGameVersions])

  useEffect(() => {
    ;(async (): Promise<void> => {
      const currentUserDataPath = await window.api.getCurrentUserDataPath()
      setSelectedFolder(`${currentUserDataPath}\\VSLGameVersions\\${selectedGameVersion?.version}`)
    })()
  }, [selectedGameVersion])

  const handleInstallation = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Starting version installation: ${selectedGameVersion?.version}`)
      setInstalling(true)
      setPreventClosing(true)

      const filePath = await window.api.downloadGameVersion(selectedGameVersion as GameVersionType, selectedFolder)
      const result = await window.api.extractGameVersion(filePath, selectedFolder)

      if (result) {
        window.api.logMessage(
          "info",
          `[component] [MenuInstallNewVersion] Game version ${selectedGameVersion?.version} installed successfully. Updating installed game versions and changing selected game version`
        )
        addNotification(
          getKey("notification-title-versionSuccesfullyInstalled"),
          getKey("niotification-body-versionSuccesfullyInstalled").replace("{version}", `${selectedGameVersion?.version}`),
          "success"
        )
        setInstalledGameVersions([...installedGameVersions, { version: selectedGameVersion?.version as string, path: selectedFolder }])
        setSelectedGameVersion(availableGameVersions.find((agv) => !installedGameVersions.some((igv) => igv.version === agv.version)))
      }

      window.api.logMessage("info", `[component] [MenuInstallNewVersion] Version installation finished: ${selectedGameVersion?.version}`)
    } catch (error) {
      window.api.logMessage("error", `[component] [MenuInstallNewVersion] Error while installing game version ${selectedGameVersion?.version}: ${error}`)
      addNotification(getKey("notification-title-versionErrorInstalling"), getKey("notification-body-versionErrorInstalling").replace("{version}", `${selectedGameVersion?.version}`), "error")
    } finally {
      setInstalling(false)
      setPreventClosing(false)
      setDownloadProgress(0)
      setExtractProgress(0)
    }
  }

  return (
    <>
      <div className="w-full max-h-[200px] flex flex-col gap-2">
        <h3 className="font-bold">{getKey("component-installNewVersionMenu-selectVersion")}</h3>
        <div className="w-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {availableGameVersions.length < 1 ? (
            <div className="w-full h-full flex justify-center items-center">
              <p>{getKey("component-installNewVersionMenu-noVersionsFound")}</p>
            </div>
          ) : (
            <>
              {availableGameVersions.map((current) => (
                <button
                  key={current.version}
                  className={`flex justify-between px-2 py-1 font-bold rounded-md shadow-md shadow-zinc-950 disabled:shadow-none disabled:opacity-50  hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${current.version === selectedGameVersion?.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                  onClick={() => setSelectedGameVersion(current)}
                  disabled={installedGameVersions.some((igv) => igv.version === current.version) || installing}
                >
                  <span>{current.version}</span>
                  <span>{installedGameVersions.find((igv) => igv.version === current.version) ? getKey("component-installNewVersionMenu-installed") : ""}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{getKey("component-installNewVersionMenu-selectFolder")}</h3>
        <div className="w-full flex gap-4 items-center">
          <Button
            btnType="custom"
            className="w-24 h-10 bg-zinc-900"
            disabled={installing}
            onClick={async () => {
              const userSelectedFolder = await window.api.selectFolderDialog()
              setSelectedFolder(userSelectedFolder)
            }}
          >
            {getKey("component-installNewVersionMenu-select")}
          </Button>
          <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none overflow-x-scroll whitespace-nowrap">{selectedFolder}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{getKey("component-installNewVersionMenu-downloaded")}</h3>
        <div className="w-full h-2 bg-zinc-900 rounded-full">
          <motion.div className={`h-full bg-vs rounded-full`} initial={{ width: 0 }} animate={{ width: `${downloadProgress}%` }} transition={{ ease: "easeInOut", duration: 0.2 }}></motion.div>
        </div>

        <h3 className="font-bold">{getKey("component-installNewVersionMenu-extracted")}</h3>
        <div className="w-full h-2 bg-zinc-900 rounded-full">
          <motion.div className={`h-full bg-vs rounded-full`} initial={{ width: 0 }} animate={{ width: `${extractProgress}%` }} transition={{ ease: "easeInOut", duration: 0.2 }}></motion.div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" disabled={!selectedGameVersion || installing} onClick={handleInstallation}>
          {installing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ ease: "linear", duration: 1, repeat: Infinity }}>
              <FaSpinner />
            </motion.div>
          ) : (
            getKey("component-installNewVersionMenu-install")
          )}
        </Button>
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)} disabled={installing}>
          {getKey("component-installNewVersionMenu-close")}
        </Button>
      </div>
    </>
  )
}

export default MenuInstallNewVersion
