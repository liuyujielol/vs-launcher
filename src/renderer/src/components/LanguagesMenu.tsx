import { useContext, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6"
import { LanguageContext } from "@contexts/LanguageContext"

const AVAILABLE_LANGS = [
  { name: "English", code: "en-US" },
  { name: "Español", code: "es-ES" }
]

function LanguagesMenu({ className }: { className?: string }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const { changeLang, getKey } = useContext(LanguageContext)

  return (
    <>
      <div className={`absolute top-4 left-4 min-h-6 max-h-48 w-64 flex flex-col text-sm bg-zinc-800 rounded ${className}`}>
        <>
          {!window.localStorage.getItem("lang") ? (
            <button
              title={isOpen ? getKey("component-general-closeMenu") : getKey("component-general-openMenu")}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-2 py-1 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
            >
              <div className="flex gap-4 items-center">
                <span>{getKey("component-translationMenu-deffaultTitle")}</span>
                <span className="text-zinc-400 text-xs">{getKey("component-general-byPerson").replace("{person}", "XurxoMF")}</span>
              </div>
              {isOpen ? <FaAngleUp /> : <FaAngleDown />}
            </button>
          ) : (
            <>
              {AVAILABLE_LANGS.map(
                (current) =>
                  current.code === window.localStorage.getItem("lang") && (
                    <button
                      title={isOpen ? getKey("component-general-closeMenu") : getKey("component-general-openMenu")}
                      key={current.code}
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full px-2 py-1 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
                    >
                      <div className="flex gap-4 items-center">
                        <span>{current.name}</span>
                        <span className="text-zinc-400 text-xs">{getKey("component-general-byPerson").replace("{person}", getKey("credits"))}</span>
                      </div>
                      {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                  )
              )}
            </>
          )}

          {isOpen && (
            <div className="w-full max-h-64 overflow-y-scroll">
              {AVAILABLE_LANGS.map(
                (current) =>
                  current.code != window.localStorage.getItem("lang") && (
                    <button
                      key={current.code}
                      onClick={() => {
                        changeLang(current.code)
                        setIsOpen(false)
                      }}
                      className="w-full px-2 py-1 flex justify-between items-center rounded shrink-0"
                    >
                      <div className="flex gap-4 items-center">
                        <span>{current.name}</span>
                        <span className="text-zinc-400 text-xs">{getKey("component-general-byPerson").replace("{person}", getKey("credits"))}</span>
                      </div>
                    </button>
                  )
              )}
            </div>
          )}
        </>
      </div>
    </>
  )
}

export default LanguagesMenu
