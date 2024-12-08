import { useState, useContext } from "react"
import { motion } from "motion/react"
import { FaSpinner } from "react-icons/fa6"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import { PreventClosingContext } from "@contexts/PreventClosingContext"
import Button from "@components/Buttons"

function MenuUninstallNewVersion({
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
        addNotification("Successfully uninstalled", `Game version ${selectedInstalledVersion?.version} uninstalled successfully`, "success")
        setInstalledGameVersions(installedGameVersions.filter((version) => version.version !== selectedInstalledVersion?.version))
      }

      window.api.logMessage("info", `[component] [MenuUninstallNewVersion] Game version uninstallation finished: ${selectedInstalledVersion?.version}`)
    } catch (err) {
      window.api.logMessage("error", `[component] [MenuUninstallNewVersion] Error while uninstalling game version ${selectedInstalledVersion?.version}: ${err}`)
      addNotification("Error uninstalling", `An error ocurred while uninstalling game version ${selectedInstalledVersion?.version}`, "error")
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
        Are you sure you want to uninstall this version? <span className="font-bold">{selectedInstalledVersion?.version}</span>
      </p>
      <p>Uninstalling is not reversible!</p>
      <div className="flex gap-4">
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" disabled={isUninstalling} onClick={handleUninstalling}>
          {isUninstalling ? (
            <motion.div animate={{ rotate: 360 }} transition={{ ease: "linear", duration: 1, repeat: Infinity }}>
              <FaSpinner />
            </motion.div>
          ) : (
            "Uninstall"
          )}
        </Button>
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)} disabled={isUninstalling}>
          Cancel
        </Button>
      </div>
    </>
  )
}

export default MenuUninstallNewVersion
