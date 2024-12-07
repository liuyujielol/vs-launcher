import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { InstallationProvider } from "@contexts/InstallationContext"
import { InstalledGameVersionsProvider } from "@contexts/InstalledGameVersionsContext"
import { InstallationsProvider } from "@contexts/InstallationsContext"
import MainMenu from "@components/MainMenu"
import Home from "@routes/Home"
import Mods from "@routes/Mods"
import News from "@routes/News"
import Versions from "@routes/Versions"

function App(): JSX.Element {
  return (
    <InstalledGameVersionsProvider>
      <InstallationsProvider>
        <InstallationProvider>
          <Router>
            <div className="w-full h-full grid grid-cols-[18rem_auto]">
              <MainMenu />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/versions" element={<Versions />} />
                <Route path="/mods" element={<Mods />} />
                <Route path="/news" element={<News />} />
              </Routes>
            </div>
          </Router>
        </InstallationProvider>
      </InstallationsProvider>
    </InstalledGameVersionsProvider>
  )
}

export default App
