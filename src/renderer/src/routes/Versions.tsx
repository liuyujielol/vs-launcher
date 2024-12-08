import { useState, useContext } from "react"
import { motion } from "motion/react"
import Button from "@components/Buttons"
import { FaPlus, FaTrashCan, FaSpinner } from "react-icons/fa6"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import MenuInstallNewVersion from "@components/MenuInstallNewVersion"
import AbsoluteMenu from "@components/AbsoluteMenu"

function Versions(): JSX.Element {
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const { addNotification } = useContext(NotificationsContext)
  const [selectedInstalledVersion, setSelectedInstalledVersion] = useState<InstalledGameVersionType>()
  const [isInstallMenuOpen, setIsInstallMenuOpen] = useState(false)
  const [isUninstallMenuOpen, setIsUninstallMenuOpen] = useState(false)
  const [isUninstalling, setIsUninstalling] = useState(false)

  const handleUninstalling = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [Versions] Starting game version instalaltion: ${selectedInstalledVersion?.version}`)
      setIsUninstalling(true)
      window.api.setPreventAppClose(true)
      const result = await window.api.uninstallGameVersion(selectedInstalledVersion as InstalledGameVersionType)

      if (result) {
        window.api.logMessage(
          "info",
          `[component] [Versions] Game version ${selectedInstalledVersion?.version} uninstalled successfully. Updating installed game versions and changing selected game version`
        )
        addNotification("Successfully uninstalled", `Game version ${selectedInstalledVersion?.version} uninstalled successfully`, "success")
        setInstalledGameVersions(installedGameVersions.filter((version) => version.version !== selectedInstalledVersion?.version))
      }

      window.api.logMessage("info", `[component] [Versions] Game version uninstallation finished: ${selectedInstalledVersion?.version}`)
      setIsUninstalling(false)
      window.api.setPreventAppClose(false)
      setIsUninstallMenuOpen(false)
      setSelectedInstalledVersion(undefined)
    } catch (err) {
      window.api.logMessage("error", `[component] [Versions] Error while uninstalling game version ${selectedInstalledVersion?.version}: ${err}`)
      addNotification("Error uninstalling", `An error ocurred while uninstalling game version ${selectedInstalledVersion?.version}`, "error")
      setIsUninstalling(false)
      window.api.setPreventAppClose(false)
      setIsUninstallMenuOpen(false)
      setSelectedInstalledVersion(undefined)
    }
  }

  return (
    <main className="flex flex-col gap-4 p-4 bg-zinc-800">
      <div className="h-full flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Version Manager</h1>

        <div className="w-full h-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {installedGameVersions.length < 1 ? (
            <div className="w-full h-full flex justify-center items-center">
              <p>No versions found</p>
            </div>
          ) : (
            <>
              {installedGameVersions.map((version) => (
                <button
                  key={version.version}
                  onClick={() => (selectedInstalledVersion && selectedInstalledVersion.version === version.version ? setSelectedInstalledVersion(undefined) : setSelectedInstalledVersion(version))}
                  className={`flex justify-between px-4 py-2 font-bold rounded-md shadow-md shadow-zinc-950 hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${selectedInstalledVersion?.version === version.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                >
                  <span>{version.version}</span>
                  <span>{version.path}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button btnType="sm" title="Add version" className="bg-zinc-900" onClick={() => setIsInstallMenuOpen(true)}>
          <FaPlus />
        </Button>
        <Button
          btnType="sm"
          title="Delete selected version"
          className="bg-zinc-900"
          onClick={() => {
            if (selectedInstalledVersion) {
              setIsUninstallMenuOpen(true)
            } else {
              addNotification("No version selected", "Please select a version to uninstall", "error")
            }
          }}
        >
          <FaTrashCan />
        </Button>
      </div>

      {/* MENUS */}

      <AbsoluteMenu title="Are you sure?" isMenuOpen={isUninstallMenuOpen} setIsMenuOpen={setIsUninstallMenuOpen} preventClose={isUninstalling}>
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
          <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setIsUninstallMenuOpen(false)} disabled={isUninstalling}>
            Cancel
          </Button>
        </div>
      </AbsoluteMenu>

      <MenuInstallNewVersion isInstallMenuOpen={isInstallMenuOpen} setIsInstallMenuOpen={setIsInstallMenuOpen} />
    </main>
  )
}

export default Versions
