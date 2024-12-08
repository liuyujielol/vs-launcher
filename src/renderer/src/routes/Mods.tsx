import { useContext } from "react"
import { LanguageContext } from "@contexts/LanguageContext"

function Mods(): JSX.Element {
  const { getKey } = useContext(LanguageContext)

  return (
    <main className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl">{getKey("page-general-notReadyYet")}</h1>
      <p>{getKey("page-general-comeBackLater")}</p>
    </main>
  )
}

export default Mods
