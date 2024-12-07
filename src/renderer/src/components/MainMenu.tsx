import MainMenuLink from "@renderer/components/MainMenuLink"
import InstallationsMenu from "@components/InstallationsMenu"
import icon from "@assets/icon.png"
import iconVersions from "@assets/icon-versions.png"
import iconModdb from "@assets/icon-moddb.png"
import iconNews from "@assets/icon-news.png"
import iconChangelog from "@assets/icon-changelog.png"
import { FaPlus, FaWhmcs, FaTrashCan, FaFolderOpen } from "react-icons/fa6"
import Button from "@components/Buttons"

function MainMenu(): JSX.Element {
  return (
    <header className="bg-zinc-900 p-4 gap-4 flex flex-col justify-between relative">
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
              <Button btnType="sm" title="Edit installation" className="shrink-0 bg-zinc-800">
                <FaWhmcs />
              </Button>
              <Button btnType="sm" title="Add installation" className="shrink-0 bg-zinc-800">
                <FaPlus />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button btnType="sm" title="Delete installation" className="shrink-0 bg-zinc-800">
                <FaTrashCan />
              </Button>
              <Button btnType="sm" title="Open installation folder" className="shrink-0 bg-zinc-800">
                <FaFolderOpen />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainMenu
