import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { InstallationProvider } from "@contexts/InstallationContext"
import { InstalledGameVersionsProvider } from "@contexts/InstalledGameVersionsContext"
import { InstallationsProvider } from "@contexts/InstallationsContext"
import { NotificationsProvider } from "@contexts/NotificationsContext"
import { PreventClosingProvider } from "@contexts/PreventClosingContext"
import { PlayingProvider } from "@contexts/PlayingContext"
import { LanguageProvider } from "@contexts/LanguageContext"
import MainMenu from "@components/MainMenu"
import NotificationsOverlay from "@components/NotificationsOverlay"
import Home from "@routes/Home"
import Mods from "@routes/Mods"
import News from "@routes/News"
import Versions from "@routes/Versions"

function App(): JSX.Element {
  return (
    <LanguageProvider>
      <InstalledGameVersionsProvider>
        <InstallationsProvider>
          <InstallationProvider>
            <NotificationsProvider>
              <PreventClosingProvider>
                <PlayingProvider>
                  <Router>
                    <div className="w-full h-full relative grid grid-cols-[18rem_auto]">
                      <NotificationsOverlay />
                      <MainMenu />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/versions" element={<Versions />} />
                        <Route path="/mods" element={<Mods />} />
                        <Route path="/news" element={<News />} />
                      </Routes>
                    </div>
                  </Router>
                </PlayingProvider>
              </PreventClosingProvider>
            </NotificationsProvider>
          </InstallationProvider>
        </InstallationsProvider>
      </InstalledGameVersionsProvider>
    </LanguageProvider>
  )
}

export default App
