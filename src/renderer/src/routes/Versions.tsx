import { useState, useContext } from "react"
import Button from "@components/Buttons"
import { FaPlus, FaTrashCan } from "react-icons/fa6"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import MenuInstallNewVersion from "@components/versions/MenuInstallNewVersion"
import MenuUninstallNewVersion from "@renderer/components/versions/MenuUninstallNewVersion"
import AbsoluteMenu from "@components/AbsoluteMenu"

function Versions(): JSX.Element {
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { addNotification } = useContext(NotificationsContext)
  const [selectedInstalledVersion, setSelectedInstalledVersion] = useState<InstalledGameVersionType>()
  const [isInstallMenuOpen, setIsInstallMenuOpen] = useState(false)
  const [isUninstallMenuOpen, setIsUninstallMenuOpen] = useState(false)

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

      <AbsoluteMenu title="Are you sure?" isMenuOpen={isUninstallMenuOpen} setIsMenuOpen={setIsUninstallMenuOpen}>
        <MenuUninstallNewVersion setIsMenuOpen={setIsUninstallMenuOpen} selectedInstalledVersion={selectedInstalledVersion} setSelectedInstalledVersion={setSelectedInstalledVersion} />
      </AbsoluteMenu>
      <AbsoluteMenu title="Install new version" isMenuOpen={isInstallMenuOpen} setIsMenuOpen={setIsInstallMenuOpen}>
        <MenuInstallNewVersion setIsMenuOpen={setIsInstallMenuOpen} />
      </AbsoluteMenu>
    </main>
  )
}

export default Versions
