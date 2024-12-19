import { useContext, useState } from "react"
import { FaPlus, FaWhmcs, FaTrashCan, FaFolderOpen } from "react-icons/fa6"
import { motion, AnimatePresence } from "motion/react"
import { useTranslation } from "react-i18next"
import icon from "@renderer/assets/icon.png"
import iconVersions from "@renderer/assets/icon-versions.png"
import iconModdb from "@renderer/assets/icon-moddb.png"
import iconNews from "@renderer/assets/icon-news.png"
import iconChangelog from "@renderer/assets/icon-changelog.png"
import { InstallationContext } from "@renderer/contexts/InstallationContext"
import { NotificationsContext } from "@renderer/contexts/NotificationsContext"
import { InstalledGameVersionsContext } from "@renderer/contexts/InstalledGameVersionsContext"
import { PreventClosingContext } from "@renderer/contexts/PreventClosingContext"
import { PlayingContext } from "@renderer/contexts/PlayingContext"
import LanguagesMenu from "@renderer/components/LanguagesMenu"
import AbsoluteMenu from "@renderer/components/utils/AbsoluteMenu"
import MainMenuLink from "@renderer/components/MainMenuLink"
import InstallationsMenu from "@renderer/components/InstallationsMenu"
import Button from "@renderer/components/utils/Buttons"
import MenuAddInstallation from "@renderer/components/installations/MenuAddInstallation"
import MenuEditInstallation from "@renderer/components/installations/MenuEditInstallation"
import MenuDeleteInstallation from "@renderer/components/installations/MenuDeleteInstallation"

function MainMenu(): JSX.Element {
  const { installation } = useContext(InstallationContext)
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { setPreventClosing } = useContext(PreventClosingContext)
  const { playing, setPlaying } = useContext(PlayingContext)
  const { t } = useTranslation()
  const [isAddInstallationMenuOpen, setIsAddInstallationMenuOpen] = useState(false)
  const [isEditInstallationMenuOpen, setIsEditInstallationMenuOpen] = useState(false)
  const [isDeleteInstallationMenuOpen, setIsDeleteInstallationMenuOpen] = useState(false)

  const executeGameManager = async (): Promise<void> => {
    try {
      if (!installedGameVersions.some((igv) => igv.version === installation?.version)) {
        addNotification(t("notification.title.error"), t("notification-body-errorVersionNotInstalled", { version: installation?.version }), "error")
        return
      }

      setPreventClosing(true)
      setPlaying(true)

      const res = await window.api.gameManager.executeGame(installedGameVersions.find((igv) => igv.version === installation?.version) as InstalledGameVersionType, installation as InstallationType)

      if (!res) {
        addNotification(t("notification.title.error"), t("notification-body-gameClosedWithError"), "error")
      }
    } catch (err) {
      addNotification(t("notification.title.error"), t("notification-body-errorExecutingGame"), "error")
    } finally {
      setPreventClosing(false)
      setPlaying(false)
    }
  }

  return (
    <header className="bg-zinc-900 p-4 gap-4 flex flex-col justify-between">
      <LanguagesMenu />
      <div className="flex flex-col gap-2 mt-10 overflow-y-scroll">
        <MainMenuLink icon={icon} text={t("component-mainMenu-homeTitle")} link="/" desc={t("component-mainMenu-homeDesc")} />
        <MainMenuLink icon={iconVersions} text={t("component-mainMenu-versionsTitle")} link="/versions" desc={t("component-mainMenu-versionsDesc")} />
        <MainMenuLink icon={iconModdb} text={t("component-mainMenu-modsTitle")} link="/mods" desc={t("component-mainMenu-modsDesc")} />
        <MainMenuLink
          icon={iconNews}
          text={t("component-mainMenu-newsTitle")}
          link="https://github.com/XurxoMF/vs-launcher/discussions/categories/announcements-news"
          onBrowser={true}
          desc={t("component-mainMenu-newsDesc")}
        />
        <MainMenuLink
          icon={iconChangelog}
          text={t("component-mainMenu-changelogTitle")}
          link="https://www.vintagestory.at/blog.html/news"
          onBrowser={true}
          desc={t("component-mainMenu-changelogDesc")}
        />
      </div>

      <div className="flex flex-col gap-4">
        <InstallationsMenu className="w-full" />
        <div className="flex gap-4">
          <Button onClick={executeGameManager} disabled={!installation} btnType="lg" title={t("component-mainMenu-playButtonName")} className="w-full bg-vs font-bold text-2xl">
            {t("component-mainMenu-playButtonName")}
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (installation) {
                    setIsEditInstallationMenuOpen(true)
                  } else {
                    addNotification(t("notification.title.warning"), t("notification-body-noInstallationSelectedToEdit"), "error")
                  }
                }}
                btnType="sm"
                title={t("component-mainMenu-modifyInstallationButtonName")}
                className="shrink-0 bg-zinc-800"
              >
                <FaWhmcs />
              </Button>
              <Button onClick={() => setIsAddInstallationMenuOpen(true)} btnType="sm" title={t("component-mainMenu-addInstallationButtonName")} className="shrink-0 bg-zinc-800">
                <FaPlus />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (installation) {
                    setIsDeleteInstallationMenuOpen(true)
                  } else {
                    addNotification(t("notification.title.warning"), t("notification-body-noInstallationSelectedToDelete"), "error")
                  }
                }}
                btnType="sm"
                title={t("component-mainMenu-deleteInstallationButtonName")}
                className="shrink-0 bg-zinc-800"
              >
                <FaTrashCan />
              </Button>
              <Button
                onClick={async () => {
                  if (installation) {
                    if (!(await window.api.pathsManager.checkPathExists(installation!.path))) {
                      addNotification(t("notification.title.warning"), t("notification-body-folderDoesntExists"), "error")
                    } else {
                      window.api.pathsManager.openPathOnFileExplorer(installation!.path)
                    }
                  } else {
                    addNotification(t("notification.title.warning"), t("notification-body-noInstallationSelectedToOpenInFileExlorer"), "error")
                  }
                }}
                btnType="sm"
                title={t("component-mainMenu-openInstallationFolderButtonName")}
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
            <h1 className="text-4xl font-bold">{t("component-mainMenu-gameRunningTitle")}</h1>
            <p className="text-xl">{t("component-mainMenu-gameRunningDesc")}</p>
            <p className="text-zinc-400">{t("component-mainMenu-gameRunningSubDesc")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AbsoluteMenu isMenuOpen={isAddInstallationMenuOpen} setIsMenuOpen={setIsAddInstallationMenuOpen}>
        <MenuAddInstallation setIsMenuOpen={setIsAddInstallationMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu isMenuOpen={isEditInstallationMenuOpen} setIsMenuOpen={setIsEditInstallationMenuOpen}>
        <MenuEditInstallation setIsMenuOpen={setIsEditInstallationMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu isMenuOpen={isDeleteInstallationMenuOpen} setIsMenuOpen={setIsDeleteInstallationMenuOpen}>
        <MenuDeleteInstallation setIsMenuOpen={setIsDeleteInstallationMenuOpen} />
      </AbsoluteMenu>
    </header>
  )
}

export default MainMenu
