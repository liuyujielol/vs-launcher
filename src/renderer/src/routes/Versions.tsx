import { useState, useContext, useRef } from "react"
import { FaPlus, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import { InstalledGameVersionsContext } from "@renderer/contexts/InstalledGameVersionsContext"
import { NotificationsContext } from "@renderer/contexts/NotificationsContext"
import MenuInstallNewVersion from "@renderer/components/versions/MenuInstallNewVersion"
import MenuUninstallVersion from "@renderer/components/versions/MenuUninstallVersion"
import MenuSearchForAVersion from "@renderer/components/versions/MenuSearchForAVersion"
import AbsoluteMenu from "@renderer/components/utils/AbsoluteMenu"
import Button from "@renderer/components/utils/Buttons"
import InViewItem from "@renderer/components/utils/InViewItem"

function Versions(): JSX.Element {
  const installedVersionListParentRef = useRef(null)
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { addNotification } = useContext(NotificationsContext)
  const { t } = useTranslation()
  const [selectedInstalledVersion, setSelectedInstalledVersion] = useState<InstalledGameVersionType>()
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false)
  const [isInstallMenuOpen, setIsInstallMenuOpen] = useState(false)
  const [isUninstallMenuOpen, setIsUninstallMenuOpen] = useState(false)

  return (
    <main className="flex flex-col gap-4 p-4 bg-zinc-800 items-center overflow-hidden">
      <h1 className="text-3xl font-bold">{t("page-versions-title")}</h1>

      <div ref={installedVersionListParentRef} className="w-full h-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll overflow-x-hidden">
        {installedGameVersions.length < 1 ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-center px-24">
            <h2 className="text-2xl">{t("page-versions-noVersionsFound")}</h2>
            <p className="text-zinc-400">{t("page-versions-noVersionsFoundSub")}</p>
          </div>
        ) : (
          <>
            {installedGameVersions.map((version) => (
              <InViewItem key={version.version} parent={installedVersionListParentRef}>
                <button
                  onClick={() => (selectedInstalledVersion && selectedInstalledVersion.version === version.version ? setSelectedInstalledVersion(undefined) : setSelectedInstalledVersion(version))}
                  className={`w-full flex justify-between px-4 py-2 font-bold rounded-md shadow-md shadow-zinc-950 hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${selectedInstalledVersion?.version === version.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                >
                  <span>{version.version}</span>
                  <span>{version.path}</span>
                </button>
              </InViewItem>
            ))}
          </>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        <Button btnType="sm" title={t("page-versions-btnTitleAddVersion")} className="bg-zinc-900" onClick={() => setIsInstallMenuOpen(true)}>
          <FaPlus />
        </Button>
        <Button btnType="sm" title={t("page-versions-btnTitleSearchForVersion")} className="bg-zinc-900" onClick={() => setIsSearchMenuOpen(true)}>
          <FaMagnifyingGlass />
        </Button>
        <Button
          btnType="sm"
          title={t("page-versions-btnTitleDeleteVersion")}
          className="bg-zinc-900"
          onClick={() => {
            if (selectedInstalledVersion) {
              setIsUninstallMenuOpen(true)
            } else {
              addNotification(t("notification-title-noVersionSelected"), t("notification-body-noVersionSelectedToUnistall"), "error")
            }
          }}
        >
          <FaTrashCan />
        </Button>
      </div>

      <AbsoluteMenu isMenuOpen={isUninstallMenuOpen} setIsMenuOpen={setIsUninstallMenuOpen}>
        <MenuUninstallVersion setIsMenuOpen={setIsUninstallMenuOpen} selectedInstalledVersion={selectedInstalledVersion} setSelectedInstalledVersion={setSelectedInstalledVersion} />
      </AbsoluteMenu>
      <AbsoluteMenu isMenuOpen={isSearchMenuOpen} setIsMenuOpen={setIsSearchMenuOpen}>
        <MenuSearchForAVersion setIsMenuOpen={setIsSearchMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu isMenuOpen={isInstallMenuOpen} setIsMenuOpen={setIsInstallMenuOpen}>
        <MenuInstallNewVersion setIsMenuOpen={setIsInstallMenuOpen} />
      </AbsoluteMenu>
    </main>
  )
}

export default Versions
