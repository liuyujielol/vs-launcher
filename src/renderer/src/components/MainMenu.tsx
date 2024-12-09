import { useContext, useState } from "react"
import { FaPlus, FaWhmcs, FaTrashCan, FaFolderOpen } from "react-icons/fa6"
import { motion, AnimatePresence } from "motion/react"
import icon from "@assets/icon.png"
import iconVersions from "@assets/icon-versions.png"
import iconModdb from "@assets/icon-moddb.png"
import iconNews from "@assets/icon-news.png"
import iconChangelog from "@assets/icon-changelog.png"
import { InstallationContext } from "@contexts/InstallationContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { PreventClosingContext } from "@contexts/PreventClosingContext"
import { PlayingContext } from "@contexts/PlayingContext"
import { LanguageContext } from "@contexts/LanguageContext"
import LanguagesMenu from "@components/LanguagesMenu"
import AbsoluteMenu from "@components/AbsoluteMenu"
import MainMenuLink from "@components/MainMenuLink"
import InstallationsMenu from "@components/InstallationsMenu"
import Button from "@components/Buttons"
import MenuAddInstallation from "@components/installations/MenuAddInstallation"
import MenuEditInstallation from "@components/installations/MenuEditInstallation"
import MenuDeleteInstallation from "@components/installations/MenuDeleteInstallation"

function MainMenu(): JSX.Element {
  const { installation } = useContext(InstallationContext)
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { setPreventClosing } = useContext(PreventClosingContext)
  const { playing, setPlaying } = useContext(PlayingContext)
  const { getKey } = useContext(LanguageContext)
  const [isAddInstallationMenuOpen, setIsAddInstallationMenuOpen] = useState(false)
  const [isEditInstallationMenuOpen, setIsEditInstallationMenuOpen] = useState(false)
  const [isDeleteInstallationMenuOpen, setIsDeleteInstallationMenuOpen] = useState(false)

  const executeGameManager = async (): Promise<void> => {
    try {
      if (!installedGameVersions.some((igv) => igv.version === installation?.version)) {
        addNotification(getKey("notification-title-errorExecutingGame"), getKey("notification-body-errorVersionNotInstalled").replace("{version}", `${installation?.version}`), "error")
        return
      }

      setPreventClosing(true)
      setPlaying(true)

      const res = await window.api.executeGame(installedGameVersions.find((igv) => igv.version === installation?.version) as InstalledGameVersionType, installation as InstallationType)

      if (!res) {
        addNotification(getKey("notification-title-gameClosedWithError"), getKey("notification-body-gameClosedWithError"), "error")
      }
    } catch (err) {
      addNotification(getKey("notification-title-gameClosedWithError"), getKey("notification-body-errorExecutingGame"), "error")
    } finally {
      setPreventClosing(false)
      setPlaying(false)
    }
  }

  return (
    <header className="bg-zinc-900 p-4 gap-4 flex flex-col justify-between">
      <LanguagesMenu />
      <div className="flex flex-col gap-2 mt-10">
        <MainMenuLink icon={icon} text={getKey("component-mainMenu-homeTitle")} link="/" desc={getKey("component-mainMenu-homeDesc")} />
        <MainMenuLink icon={iconVersions} text={getKey("component-mainMenu-versionsTitle")} link="/versions" desc={getKey("component-mainMenu-versionsDesc")} />
        <MainMenuLink icon={iconModdb} text={getKey("component-mainMenu-modsTitle")} link="/mods" desc={getKey("component-mainMenu-modsDesc")} />
        <MainMenuLink icon={iconNews} text={getKey("component-mainMenu-newsTitle")} link="/news" desc={getKey("component-mainMenu-newsDesc")} />
        <MainMenuLink
          icon={iconChangelog}
          text={getKey("component-mainMenu-changelogTitle")}
          link="https://www.vintagestory.at/blog.html/news"
          onBrowser={true}
          desc={getKey("component-mainMenu-changelogDesc")}
        />
      </div>

      <div className="flex flex-col gap-4">
        <InstallationsMenu className="w-full" />
        <div className="flex gap-4">
          <Button onClick={executeGameManager} disabled={!installation} btnType="lg" title={getKey("component-mainMenu-playButtonName")} className="w-full bg-vs font-bold text-2xl">
            {getKey("component-mainMenu-playButtonName")}
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (installation) {
                    setIsEditInstallationMenuOpen(true)
                  } else {
                    addNotification(getKey("notification-title-noInstallationSelected"), getKey("notification-body-noInstallationSelectedToEdit"), "error")
                  }
                }}
                btnType="sm"
                title={getKey("component-mainMenu-modifyInstallationButtonName")}
                className="shrink-0 bg-zinc-800"
              >
                <FaWhmcs />
              </Button>
              <Button onClick={() => setIsAddInstallationMenuOpen(true)} btnType="sm" title={getKey("component-mainMenu-addInstallationButtonName")} className="shrink-0 bg-zinc-800">
                <FaPlus />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (installation) {
                    setIsDeleteInstallationMenuOpen(true)
                  } else {
                    addNotification(getKey("notification-title-noInstallationSelected"), getKey("notification-body-noInstallationSelectedToDelete"), "error")
                  }
                }}
                btnType="sm"
                title={getKey("component-mainMenu-deleteInstallationButtonName")}
                className="shrink-0 bg-zinc-800"
              >
                <FaTrashCan />
              </Button>
              <Button
                onClick={async () => {
                  if (installation) {
                    window.api.openPathOnFileExplorer(installation!.path)
                  } else {
                    addNotification(getKey("notification-title-noInstallationSelected"), getKey("notification-body-noInstallationSelectedToOpenInFileExlorer"), "error")
                  }
                }}
                btnType="sm"
                title={getKey("component-mainMenu-openInstallationFolderButtonName")}
                className="shrink-0 bg-zinc-800"
              >
                <FaFolderOpen />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {playing && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 z-[500] bg-zinc-950/95 select-none"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-4xl font-bold">{getKey("component-mainMenu-gameRunningTitle")}</h1>
            <p className="text-xl">{getKey("component-mainMenu-gameRunningDesc")}</p>
            <p className="text-zinc-400">{getKey("component-mainMenu-gameRunningSubDesc")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AbsoluteMenu title={getKey("component-addInstallationMenu-title")} isMenuOpen={isAddInstallationMenuOpen} setIsMenuOpen={setIsAddInstallationMenuOpen}>
        <MenuAddInstallation setIsMenuOpen={setIsAddInstallationMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu title={getKey("component-editInstallationMenu-title")} isMenuOpen={isEditInstallationMenuOpen} setIsMenuOpen={setIsEditInstallationMenuOpen}>
        <MenuEditInstallation setIsMenuOpen={setIsEditInstallationMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu title={getKey("component-deleteInstallationMenu-title")} isMenuOpen={isDeleteInstallationMenuOpen} setIsMenuOpen={setIsDeleteInstallationMenuOpen}>
        <MenuDeleteInstallation setIsMenuOpen={setIsDeleteInstallationMenuOpen} />
      </AbsoluteMenu>
    </header>
  )
}

export default MainMenu
