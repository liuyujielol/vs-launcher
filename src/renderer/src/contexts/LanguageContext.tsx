import { createContext, useState, useEffect, useRef } from "react"
import enUS from "@assets/lang/en-US.json"
import esES from "@assets/lang/es-ES.json"

interface LanguageType {
  getKey: (key: string) => string
  changeLang: (lang?: string) => void
}

const defaultValue: LanguageType = { getKey: () => "", changeLang: () => {} }

const LanguageContext = createContext<LanguageType>(defaultValue)

const LanguageProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [lang, setLang] = useState<{ target: LangFileType; deffault: LangFileType }>({ target: {}, deffault: {} })

  const firstExecutedLanguageProvider = useRef(true)
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (firstExecutedLanguageProvider.current) {
        firstExecutedLanguageProvider.current = false
        changeLang()
      }
    })()
  }, [])

  const getKey = (key: string): string => {
    const res = lang.target[key] || lang.deffault[key]
    console.log("Key", res)
    console.log(lang)

    return res
  }

  const changeLang = (lang?: string): void => {
    if (lang) {
      window.api.logMessage("info", `[context] [InstalledGameVersionsContext] Changing local stored lang to ${lang}`)
      window.localStorage.setItem("lang", lang)
    }

    window.api.logMessage("info", `[context] [InstalledGameVersionsContext] Setting lang saved on local storage from lang file`)

    const localStorageLang = window.localStorage.getItem("lang")

    let targetLang

    switch (localStorageLang) {
      case "en-US":
        targetLang = enUS
        break
      case "es-ES":
        targetLang = esES
        break
      default:
        targetLang = enUS
    }

    console.log(targetLang)

    setLang({ target: targetLang, deffault: enUS })
  }

  return <LanguageContext.Provider value={{ getKey, changeLang }}>{children}</LanguageContext.Provider>
}

export { LanguageContext, LanguageProvider }
