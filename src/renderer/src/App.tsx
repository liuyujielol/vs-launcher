import { useEffect } from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { InstallationProvider } from "@contexts/InstallationContext"
import { InstalledGameVersionsProvider } from "@contexts/InstalledGameVersionsContext"
import { InstallationsProvider } from "@contexts/InstallationsContext"
import { NotificationsProvider } from "@contexts/NotificationsContext"
import { PreventClosingProvider } from "@contexts/PreventClosingContext"
import { PlayingProvider } from "@contexts/PlayingContext"
import MainMenu from "@components/MainMenu"
import NotificationsOverlay from "@components/NotificationsOverlay"
import Home from "@routes/Home"
import Mods from "@routes/Mods"
import Versions from "@routes/Versions"
import "./i18n"
import i18n from "./i18n"

function App(): JSX.Element {
  useEffect(() => {
    const lang = window.localStorage.getItem("lang")
    if (lang) i18n.changeLanguage(lang)
  }, [])

  return (
    <InstalledGameVersionsProvider>
      <InstallationsProvider>
        <InstallationProvider>
          <NotificationsProvider>
            <PreventClosingProvider>
              <PlayingProvider>
                <Router>
                  <div className="w-screen h-screen relative grid grid-cols-[20rem_auto] font-mono">
                    <NotificationsOverlay />
                    <MainMenu />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/versions" element={<Versions />} />
                      <Route path="/mods" element={<Mods />} />
                    </Routes>
                  </div>
                </Router>
              </PlayingProvider>
            </PreventClosingProvider>
          </NotificationsProvider>
        </InstallationProvider>
      </InstallationsProvider>
    </InstalledGameVersionsProvider>
  )
}

export default App
