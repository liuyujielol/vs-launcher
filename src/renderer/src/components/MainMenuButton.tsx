import { useLocation } from "react-router-dom"

function MainMenuButton({ icon, text, link, desc }: { icon: string; text: string; link: string; desc: string }): JSX.Element {
  const location = useLocation()

  return (
    <a href={link} className={`p-1 rounded flex gap-2 items-center text-zinc-300 hover:bg-zinc-900 border-l-4 ${location.pathname === link ? "border-zinc-300" : " border-transparent"}`}>
      <img src={icon} className="w-10" />
      <div className="flex flex-col">
        <span className="font-bold">{text}</span>
        <span className="text-sm text-zinc-400">{desc}</span>
      </div>
    </a>
  )
}

export default MainMenuButton
