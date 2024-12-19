import { useEffect } from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { InstallationProvider } from "@renderer/contexts/InstallationContext"
import { InstalledGameVersionsProvider } from "@renderer/contexts/InstalledGameVersionsContext"
import { InstallationsProvider } from "@renderer/contexts/InstallationsContext"
import { NotificationsProvider } from "@renderer/contexts/NotificationsContext"
import { PreventClosingProvider } from "@renderer/contexts/PreventClosingContext"
import { PlayingProvider } from "@renderer/contexts/PlayingContext"
import MainMenu from "@renderer/components/MainMenu"
import NotificationsOverlay from "@renderer/components/NotificationsOverlay"
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
