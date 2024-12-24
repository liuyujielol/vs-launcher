import { PiGearFill } from "react-icons/pi"
import { FiExternalLink } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

import icon from "@renderer/assets/icon.png"
import iconVersions from "@renderer/assets/icon-versions.png"
import iconMods from "@renderer/assets/icon-moddb.png"
import iconNews from "@renderer/assets/icon-news.png"
import iconChangelog from "@renderer/assets/icon-changelog.png"

import { usePreventClosingContext } from "@renderer/contexts/PreventClosingContext"

import LanguagesMenu from "@renderer/components/ui/localization/LanguagesMenu"
import Button from "@renderer/components/ui/inputs/Button"
import InstallationsDropdownMenu from "@renderer/features/installations/components/InstallationsDropdownMenu"
import { useTaskContext } from "@renderer/contexts/TaskManagerContext"

interface MainMenuLinkProps {
  icon: string
  text: string
  desc: string
  to: string
}

interface MainMenuAProps {
  icon: string
  text: string
  desc: string
  href: string
}

function MainMenu(): JSX.Element {
  const { t } = useTranslation()

  const { preventClosing } = usePreventClosingContext()
  const { startDownload, startExtract } = useTaskContext()

  const LINKS: MainMenuLinkProps[] = [
    {
      icon: icon,
      text: t("components.mainMenu.homeTitle"),
      desc: t("components.mainMenu.homeDesc"),
      to: "/"
    },
    {
      icon: iconVersions,
      text: t("components.mainMenu.installationsTitle"),
      desc: t("components.mainMenu.installationsDesc"),
      to: "/installations"
    },
    {
      icon: iconVersions,
      text: t("components.mainMenu.versionsTitle"),
      desc: t("components.mainMenu.versionsDesc"),
      to: "/versions"
    },
    {
      icon: iconMods,
      text: t("components.mainMenu.modsTitle"),
      desc: t("components.mainMenu.modsDesc"),
      to: "/mods"
    }
  ]

  const AS: MainMenuAProps[] = [
    {
      icon: iconNews,
      text: t("components.mainMenu.newsTitle"),
      desc: t("components.mainMenu.newsDesc"),
      href: "https://github.com/XurxoMF/vs-launcher/discussions/categories/announcements-news"
    },
    {
      icon: iconChangelog,
      text: t("components.mainMenu.changelogTitle"),
      desc: t("components.mainMenu.changelogDesc"),
      href: "https://www.vintagestory.at/blog.html/news"
    }
  ]

  return (
    <header className="z-50 shrink-0 w-72 flex flex-col gap-4 p-2 shadow-[0_0_5px_2px] shadow-zinc-900">
      <div className={`flex shrink-0 gap-2`}>
        <Button width="sm" height="sm" title={t("generic.settings")}>
          <PiGearFill className="text-lg" />
        </Button>
        <LanguagesMenu />
      </div>

      <div className="h-full flex flex-col gap-2">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to} className={`${preventClosing && "pointer-events-none opacity-50"} flex items-start`}>
            <LinkContent icon={link.icon} text={link.text} desc={link.desc} link={link.to} external={false} />
          </Link>
        ))}
        {AS.map((link) => (
          <a key={link.href} onClick={() => window.api.utils.openOnBrowser(link.href)} className="flex items-start cursor-pointer">
            <LinkContent icon={link.icon} text={link.text} desc={link.desc} link={link.href} external={true} />
          </a>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <InstallationsDropdownMenu disabled={preventClosing} />
        <Button width="full" height="md" color="vs" title={t("generic.play")} disabled={preventClosing}>
          <span className="text-2xl">{t("generic.play")}</span>
        </Button>
        <Button
          onClick={() =>
            startDownload("Test de descarga", "https://vslapi.xurxomf.xyz/versions/files/linux/1.19.8.zip", "/home/xurxomf/Descargas/TEST", (status, path, error) => {
              if (status) {
                startExtract("Test de extracción", path, "/home/xurxomf/Descargas/TEST", (status, error) => {
                  console.log(status, error)
                })
              } else {
                console.log(status, path, error)
              }
            })
          }
          width="full"
          height="md"
          color="vs"
          title="Test download and extract"
          disabled={preventClosing}
        >
          <span className="text-2xl">Test download and extract</span>
        </Button>
      </div>
    </header>
  )
}

interface LinkContentProps {
  icon: string
  text: string
  desc: string
  link: string
  external: boolean
}

function LinkContent({ icon, text, desc, link, external }: LinkContentProps): JSX.Element {
  const location = useLocation()

  return (
    <div
      className={`w-full flex items-center gap-2 px-2 py-1 rounded duration-100 group hover:translate-x-1 border-l-4 ${location.pathname === link ? "border-vs bg-vs/15" : "border-transparent"} duration-100`}
    >
      <img src={icon} alt={text} className="w-7" />
      <div className={`flex flex-col overflow-hidden whitespace-nowrap`}>
        <div className="font-bold text-sm flex items-center gap-2">
          <span className="overflow-hidden text-ellipsis">{text}</span>
          {external && <FiExternalLink className="text-zinc-500" />}
        </div>
        <span className="text-zinc-500 text-xs overflow-hidden text-ellipsis">{desc}</span>
      </div>
    </div>
  )
}

export default MainMenu
