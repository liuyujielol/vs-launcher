import { useState, useContext } from "react"
import { motion } from "motion/react"
import { FaSpinner } from "react-icons/fa6"
import { LanguageContext } from "@contexts/LanguageContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import { PreventClosingContext } from "@contexts/PreventClosingContext"
import Button from "@components/Buttons"

function MenuUninstallVersion({
  setIsMenuOpen,
  selectedInstalledVersion,
  setSelectedInstalledVersion
}: {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedInstalledVersion: InstalledGameVersionType | undefined
  setSelectedInstalledVersion: React.Dispatch<React.SetStateAction<InstalledGameVersionType | undefined>>
}): JSX.Element {
  const [isUninstalling, setIsUninstalling] = useState<boolean>(false)
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const { addNotification } = useContext(NotificationsContext)
  const { setPreventClosing } = useContext(PreventClosingContext)
  const { getKey } = useContext(LanguageContext)

  const handleUninstalling = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuUninstallNewVersion] Starting game version instalaltion: ${selectedInstalledVersion?.version}`)
      setIsUninstalling(true)
      setPreventClosing(true)
      const result = await window.api.uninstallGameVersion(selectedInstalledVersion as InstalledGameVersionType)

      if (result) {
        window.api.logMessage(
          "info",
          `[component] [MenuUninstallNewVersion] Game version ${selectedInstalledVersion?.version} uninstalled successfully. Updating installed game versions and changing selected game version`
        )
        addNotification(
          getKey("notification-title-versionSuccesfullyUninstalled"),
          getKey("niotification-body-versionSuccesfullyUninstalled").replace("{version}", `${selectedInstalledVersion?.version}`),
          "success"
        )
        setInstalledGameVersions(installedGameVersions.filter((version) => version.version !== selectedInstalledVersion?.version))
      }

      window.api.logMessage("info", `[component] [MenuUninstallNewVersion] Game version uninstallation finished: ${selectedInstalledVersion?.version}`)
    } catch (err) {
      window.api.logMessage("error", `[component] [MenuUninstallNewVersion] Error while uninstalling game version ${selectedInstalledVersion?.version}: ${err}`)
      addNotification(getKey("notification-title-versionErrorUninstalling"), getKey("notification-body-versionErrorUninstalling").replace("{version}", `${selectedInstalledVersion?.version}`), "error")
    } finally {
      setIsUninstalling(false)
      setPreventClosing(false)
      setIsMenuOpen(false)
      setSelectedInstalledVersion(undefined)
    }
  }

  return (
    <>
      <p>
        {getKey("component-uninstallVersionMenu-areYouSure")} <span className="font-bold">{selectedInstalledVersion?.version}</span>
      </p>
      <p>{getKey("component-uninstallVersionMenu-uninstallingNotReversible")}</p>
      <div className="flex gap-4">
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" disabled={isUninstalling} onClick={handleUninstalling}>
          {isUninstalling ? (
            <motion.div animate={{ rotate: 360 }} transition={{ ease: "linear", duration: 1, repeat: Infinity }}>
              <FaSpinner />
            </motion.div>
          ) : (
            getKey("component-uninstallVersionMenu-uninstall")
          )}
        </Button>
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)} disabled={isUninstalling}>
          {getKey("component-uninstallVersionMenu-cancel")}
        </Button>
      </div>
    </>
  )
}

export default MenuUninstallVersion
