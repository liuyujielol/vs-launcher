import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { FaSpinner, FaDownload, FaStar, FaComment } from "react-icons/fa6"
// import { useTranslation } from "react-i18next"
import InViewItem from "@components/utils/InViewItem"
import AbsoluteMenu from "@components/utils/AbsoluteMenu"

function Mods(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedMod, setSelectedMod] = useState<number | undefined>()

  return (
    <main className="h-full flex flex-col gap-4 p-4 bg-zinc-800 items-center overflow-hidden">
      <h1 className="text-3xl font-bold">Mod Manager</h1>

      <ModsList setIsMenuOpen={setIsMenuOpen} setSelectedMod={setSelectedMod} />

      <AbsoluteMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
        <ModMenu modid={selectedMod} />
      </AbsoluteMenu>
    </main>
  )
}

function ModsList({
  setIsMenuOpen,
  setSelectedMod
}: {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedMod: React.Dispatch<React.SetStateAction<number | undefined>>
}): JSX.Element {
  const modManagerListParentRef = useRef(null)
  // const { t } = useTranslation()
  const [modList, setModList] = useState([])

  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await axios("/moddbapi/mods")
      setModList(res.data["mods"])
    })()
  }, [])

  return (
    <div ref={modManagerListParentRef} className="w-full h-full flex gap-4 flex-wrap p-4 bg-zinc-900 rounded-md overflow-y-scroll overflow-x-hidden">
      {modList.length < 1 ? (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-center px-24">
          <FaSpinner className="text-4xl animate-spin" />
        </div>
      ) : (
        <>
          {modList.map((mod) => (
            <InViewItem key={mod["modid"]} parent={modManagerListParentRef} className="flex-1">
              <div
                className="min-w-64 aspect-[8/7] rounded-md shadow-md shadow-zinc-950 hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 bg-zinc-800 overflow-hidden"
                onClick={() => {
                  setSelectedMod(mod["modid"])
                  setIsMenuOpen(true)
                }}
              >
                <img src={`https://mods.vintagestory.at/${mod["logo"] ? mod["logo"] : "web/img/mod-default.png"}`} alt="Test" className="w-full h-2/3 object-cover object-center" />
                <div className="h-1/3 flex flex-col justify-between p-2">
                  <div className="flex flex-col">
                    <span className="max-w-64 font-bold whitespace-nowrap overflow-hidden text-ellipsis">{mod["name"]}</span>
                    <span className="text-sm text-zinc-400">by {mod["author"]}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <FaDownload className="text-xs" /> {mod["downloads"]}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <FaStar className="text-xs" /> {mod["follows"]}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <FaComment className="text-xs" /> {mod["comments"]}
                    </span>
                  </div>
                </div>
              </div>
            </InViewItem>
          ))}
        </>
      )}
    </div>
  )
}

function ModMenu({ modid }: { modid: number | undefined }): JSX.Element {
  return <p>Hola Mundo {modid}</p>
}

export default Mods
