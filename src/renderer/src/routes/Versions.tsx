import { useState, useContext } from "react"
import { FaPlus, FaTrashCan } from "react-icons/fa6"
import { LanguageContext } from "@contexts/LanguageContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import MenuInstallNewVersion from "@components/versions/MenuInstallNewVersion"
import MenuUninstallVersion from "@components/versions/MenuUninstallVersion"
import AbsoluteMenu from "@components/AbsoluteMenu"
import Button from "@components/Buttons"

function Versions(): JSX.Element {
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { addNotification } = useContext(NotificationsContext)
  const { getKey } = useContext(LanguageContext)
  const [selectedInstalledVersion, setSelectedInstalledVersion] = useState<InstalledGameVersionType>()
  const [isInstallMenuOpen, setIsInstallMenuOpen] = useState(false)
  const [isUninstallMenuOpen, setIsUninstallMenuOpen] = useState(false)

  return (
    <main className="flex flex-col gap-4 p-4 bg-zinc-800">
      <div className="h-full flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">{getKey("page-versions-title")}</h1>

        <div className="w-full h-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {installedGameVersions.length < 1 ? (
            <div className="w-full h-full flex justify-center items-center">
              <p>{getKey("page-versions-noVersionsFound")}</p>
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
        <Button btnType="sm" title={getKey("page-versions-btnTitleAddVersion")} className="bg-zinc-900" onClick={() => setIsInstallMenuOpen(true)}>
          <FaPlus />
        </Button>
        <Button
          btnType="sm"
          title={getKey("page-versions-btnTitleDeleteVersion")}
          className="bg-zinc-900"
          onClick={() => {
            if (selectedInstalledVersion) {
              setIsUninstallMenuOpen(true)
            } else {
              addNotification(getKey("notification-title-noVersionSelected"), getKey("notification-body-noVersionSelectedToUnistall"), "error")
            }
          }}
        >
          <FaTrashCan />
        </Button>
      </div>

      <AbsoluteMenu title={getKey("component-uninstallVersionMenu-titleAreyouSure")} isMenuOpen={isUninstallMenuOpen} setIsMenuOpen={setIsUninstallMenuOpen}>
        <MenuUninstallVersion setIsMenuOpen={setIsUninstallMenuOpen} selectedInstalledVersion={selectedInstalledVersion} setSelectedInstalledVersion={setSelectedInstalledVersion} />
      </AbsoluteMenu>
      <AbsoluteMenu title={getKey("component-installNewVersionMenu-titleInstallNewVersion")} isMenuOpen={isInstallMenuOpen} setIsMenuOpen={setIsInstallMenuOpen}>
        <MenuInstallNewVersion setIsMenuOpen={setIsInstallMenuOpen} />
      </AbsoluteMenu>
    </main>
  )
}

export default Versions
