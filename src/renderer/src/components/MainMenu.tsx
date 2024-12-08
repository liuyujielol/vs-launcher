import { useContext, useState } from "react"
import { FaPlus, FaWhmcs, FaTrashCan, FaFolderOpen } from "react-icons/fa6"
import icon from "@assets/icon.png"
import iconVersions from "@assets/icon-versions.png"
import iconModdb from "@assets/icon-moddb.png"
import iconNews from "@assets/icon-news.png"
import iconChangelog from "@assets/icon-changelog.png"
import { InstallationContext } from "@contexts/InstallationContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
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
  const [isAddInstallationMenuOpen, setIsAddInstallationMenuOpen] = useState(false)
  const [isEditInstallationMenuOpen, setIsEditInstallationMenuOpen] = useState(false)
  const [isDeleteInstallationMenuOpen, setIsDeleteInstallationMenuOpen] = useState(false)

  return (
    <header className="bg-zinc-900 p-4 gap-4 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <MainMenuLink icon={icon} text="Home" link="/" desc="Main page" />
        <MainMenuLink icon={iconVersions} text="Versions" link="/versions" desc="Manage/Install game versions" />
        <MainMenuLink icon={iconModdb} text="Mods" link="/mods" desc="Manage/Install mods" />
        <MainMenuLink icon={iconNews} text="News" link="/news" desc="VS Launcher news" />
        <MainMenuLink icon={iconChangelog} text="Changelog" link="https://www.vintagestory.at/blog.html/news" onBrowser={true} desc="Vintage Story changelog" />
      </div>

      <div className="flex flex-col gap-4">
        <InstallationsMenu className="w-full" />
        <div className="flex gap-4">
          <Button btnType="lg" title="Play" className="w-full bg-vs font-bold text-2xl">
            Play
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (installation) {
                    setIsEditInstallationMenuOpen(true)
                  } else {
                    addNotification("No installation selected", "Please, select an installation to delete", "error")
                  }
                }}
                btnType="sm"
                title="Edit installation"
                className="shrink-0 bg-zinc-800"
              >
                <FaWhmcs />
              </Button>
              <Button onClick={() => setIsAddInstallationMenuOpen(true)} btnType="sm" title="Add installation" className="shrink-0 bg-zinc-800">
                <FaPlus />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (installation) {
                    setIsDeleteInstallationMenuOpen(true)
                  } else {
                    addNotification("No installation selected", "Please, select an installation to delete", "error")
                  }
                }}
                btnType="sm"
                title="Delete installation"
                className="shrink-0 bg-zinc-800"
              >
                <FaTrashCan />
              </Button>
              <Button btnType="sm" title="Open installation folder" className="shrink-0 bg-zinc-800">
                <FaFolderOpen />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AbsoluteMenu title="Add installation" isMenuOpen={isAddInstallationMenuOpen} setIsMenuOpen={setIsAddInstallationMenuOpen}>
        <MenuAddInstallation setIsMenuOpen={setIsAddInstallationMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu title="Edit installation" isMenuOpen={isEditInstallationMenuOpen} setIsMenuOpen={setIsEditInstallationMenuOpen}>
        <MenuEditInstallation setIsMenuOpen={setIsEditInstallationMenuOpen} />
      </AbsoluteMenu>
      <AbsoluteMenu title="Are you sure?" isMenuOpen={isDeleteInstallationMenuOpen} setIsMenuOpen={setIsDeleteInstallationMenuOpen}>
        <MenuDeleteInstallation setIsMenuOpen={setIsDeleteInstallationMenuOpen} />
      </AbsoluteMenu>
    </header>
  )
}

export default MainMenu
