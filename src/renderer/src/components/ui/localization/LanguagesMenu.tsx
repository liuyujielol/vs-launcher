import { useTranslation } from "react-i18next"

import { DropdownItem, DropdownList, DropdownSelected, DropdownWrapper } from "@renderer/components/ui/inputs/Dropdown"

function LanguagesMenu({ disabled }: { disabled?: boolean }): JSX.Element {
  const { t, i18n } = useTranslation()

  const getLanguages = (): { code: string; name: string; credits: string }[] => {
    const resources = i18n.options.resources
    if (!resources) return []
    return Object.keys(resources).map((code) => ({
      code,
      name: resources[code]?.name.toString() || code,
      credits: resources[code]?.credits.toString() || "by anonymous"
    }))
  }

  const languages = getLanguages()

  const handleLanguageChange = (lang): void => {
    window.api.utils.logMessage("info", `[component] [LanguagesMenu] Changing language to ${lang}`)
    i18n.changeLanguage(lang)
    localStorage.setItem("lang", lang)
  }

  const hasLanguageSelected = (): boolean => {
    return languages.some((lang) => lang.code === window.localStorage.getItem("lang"))
  }

  return (
    <DropdownWrapper width="full" height="sm" bgColor="dark" disabled={disabled}>
      <DropdownSelected>
        {!hasLanguageSelected() ? (
          <div className="flex items-center">
            <span>{t("generic.default")}</span>
          </div>
        ) : (
          languages
            .filter((lang) => lang.code === window.localStorage.getItem("lang"))
            .map((lang) => (
              <div key={lang.code} className="flex gap-2 items-center overflow-hidden">
                <span className="whitespace-nowrap">{lang.name}</span>
                <span className="text-zinc-500 text-xs whitespace-nowrap text-ellipsis overflow-hidden">{lang.credits}</span>
              </div>
            ))
        )}
      </DropdownSelected>
      <DropdownList>
        {languages.map((lang) => (
          <DropdownItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
            <div className="flex gap-2 items-center overflow-hidden" title={`${lang.name} - ${lang.credits}`}>
              <span className="whitespace-nowrap">{lang.name}</span>
              <span className="text-zinc-500 text-xs whitespace-nowrap text-ellipsis overflow-hidden">{lang.credits}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownList>
    </DropdownWrapper>
  )
}

export default LanguagesMenu
