import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MainMenu from "@components/MainMenu"
import Home from "@routes/Home"
import Mods from "@routes/Mods"
import News from "@routes/News"
import Changelog from "@routes/Changelog"
import Versions from "@routes/Versions"
import { InstallationProvider } from "@contexts/InstallationContext"

function App(): JSX.Element {
  return (
    <InstallationProvider>
      <Router>
        <div className="w-full h-full grid grid-cols-[18rem_auto]">
          <MainMenu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/mods" element={<Mods />} />
            <Route path="/news" element={<News />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </div>
      </Router>
    </InstallationProvider>
  )
}

export default App
