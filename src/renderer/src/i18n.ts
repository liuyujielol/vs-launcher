import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enUS from "@assets/lang/en-US.json"
import esES from "@assets/lang/es-ES.json"
import ruRU from "@assets/lang/ru-RU.json"
import zhCN from "@assets/lang/zh-CN.json"
import frFR from "@assets/lang/fr-FR.json"
import cs from "@assets/lang/cs.json"
import deDE from "@assets/lang/de-DE.json"

i18n.use(initReactI18next).init({
  resources: {
    "en-US": { translation: enUS, name: "English", credits: "by XuroMF" },
    "es-ES": { translation: esES, name: "Español", credits: "by XuroMF" },
    "ru-RU": { translation: ruRU, name: "Русский", credits: "by megabezdelnik" },
    "zh-CN": { translation: zhCN, name: "简体中文", credits: "by liuyujielol" },
    "fr-FR": { translation: frFR, name: "Français", credits: "by LorIlcs" },
    cs: { translation: cs, name: "Čeština", credits: "by DejFidOFF" },
    "de-DE": { translation: deDE, name: "Deutsch", credits: "by Brady_The" }
  },
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false
  }
})

export default i18n
