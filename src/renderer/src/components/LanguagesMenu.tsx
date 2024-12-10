import { useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import { ResourceKey } from "i18next"

function LanguagesMenu({ className }: { className?: string }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const getLanguages = (): { code: string; name: ResourceKey }[] => {
    const resources = i18n.options.resources
    if (!resources) return []
    return Object.keys(resources).map((code) => ({
      code,
      name: resources[code]?.name || code
    }))
  }

  const languages = getLanguages()

  const handleLanguageChange = (lang): void => {
    window.api.logMessage("info", `[component] [LanguagesMenu] Changing language to ${lang}`)
    i18n.changeLanguage(lang)
    localStorage.setItem("lang", lang)
  }

  return (
    <>
      <div className={`absolute top-4 left-4 min-h-6 max-h-48 w-64 flex flex-col text-sm bg-zinc-800 rounded ${className}`}>
        <>
          {!window.localStorage.getItem("lang") ? (
            <button
              title={isOpen ? t("component-general-closeMenu") : t("component-general-openMenu")}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-2 py-1 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
            >
              <div className="flex gap-4 items-center">
                <span>{t("component-translationMenu-defaultTitle")}</span>
                <span className="text-zinc-400 text-xs">{t("credits")}</span>
              </div>
              {isOpen ? <FaAngleUp /> : <FaAngleDown />}
            </button>
          ) : (
            <>
              {languages.map(
                (lang) =>
                  lang.code === window.localStorage.getItem("lang") && (
                    <button
                      title={isOpen ? t("component-general-closeMenu") : t("component-general-openMenu")}
                      key={lang.code}
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full px-2 py-1 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
                    >
                      <div className="flex gap-4 items-center">
                        <span>{lang.name.toString()}</span>
                        <span className="text-zinc-400 text-xs">{t("credits")}</span>
                      </div>
                      {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                  )
              )}
            </>
          )}
          {isOpen && (
            <div className="w-full max-h-64 overflow-y-scroll">
              {languages.map(
                (lang) =>
                  lang.code != window.localStorage.getItem("lang") && (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code)
                        setIsOpen(false)
                      }}
                      className="w-full px-2 py-1 flex justify-between items-center rounded shrink-0"
                    >
                      <div className="flex gap-4 items-center">
                        <span>{lang.name.toString()}</span>
                        <span className="text-zinc-400 text-xs">{t("credits")}</span>
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
