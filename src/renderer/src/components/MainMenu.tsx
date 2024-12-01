import MainMenuButton from "@components/MainMenuButton"
import icon from "@assets/icon.png"
import iconModdb from "@assets/icon-moddb.png"
import iconNews from "@assets/icon-news.png"
import iconChangelog from "@assets/icon-changelog.png"

function MainMenu(): JSX.Element {
  return (
    <header className="bg-zinc-800 p-4 flex flex-col gap-4">
      <MainMenuButton icon={icon} text="Inicio" link="/" desc="Página principal" />
      <MainMenuButton icon={iconModdb} text="Mods" link="/mods" desc="Gestión de mods" />
      <MainMenuButton icon={iconNews} text="Novedades" link="/news" desc="Novedades y noticas" />
      <MainMenuButton icon={iconChangelog} text="Changelog" link="/changelog" desc="Versiones del juego" />
    </header>
  )
}

export default MainMenu
