import { Link, useLocation } from "react-router-dom"
import { FiExternalLink } from "react-icons/fi"

function MainMenuLink({ icon, text, link, desc, onBrowser }: { icon: string; text: string; link: string; desc: string; onBrowser?: boolean }): JSX.Element {
  const location = useLocation()

  return onBrowser ? (
    <a
      href={onBrowser ? undefined : link}
      onClick={() => onBrowser && window.api.openOnBrowser(link)}
      className={`p-1 cursor-pointer rounded select-none flex gap-2 items-center hover:bg-zinc-950 border-l-4 ${location.pathname === link ? "border-vs" : " border-transparent"}`}
    >
      <img src={icon} className="w-10" />
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-bold">{text}</span>
          {onBrowser && <FiExternalLink />}
        </div>
        <span className="text-sm text-zinc-400">{desc}</span>
      </div>
    </a>
  ) : (
    <Link to={link} className={`p-1 cursor-pointer rounded select-none flex gap-2 items-center hover:bg-zinc-950 border-l-4 ${location.pathname === link ? "border-vs" : " border-transparent"}`}>
      <img src={icon} className="w-10" />
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-bold">{text}</span>
          {onBrowser && <FiExternalLink />}
        </div>
        <span className="text-sm text-zinc-400">{desc}</span>
      </div>
    </Link>
  )
}

export default MainMenuLink
