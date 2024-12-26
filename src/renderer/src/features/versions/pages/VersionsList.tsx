import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@headlessui/react"
import { PiFolderFill, PiPlusCircleFill, PiTrashFill } from "react-icons/pi"

import { useInstalledGameVersionsContext } from "@renderer/contexts/InstalledGameVersionsContext"

function VersionsList(): JSX.Element {
  const { installedGameVersions } = useInstalledGameVersionsContext()

  const [selected, setSelected] = useState<InstalledGameVersionType | undefined>()

  return (
    <>
      <h1 className="text-3xl text-center font-bold">Versions list</h1>

      <div className="mx-auto w-full max-w-[800px]">
        <ul className="w-full flex flex-col">
          {installedGameVersions.map((gv) => (
            <li
              key={gv.version}
              onClick={() => setSelected(gv)}
              className={`w-full px-2 py-1 hover:pl-3 hover:pr-1 duration-100 border-l-4 odd:bg-zinc-850 ${selected?.version === gv.version ? "border-vs bg-vs/15 odd:bg-vs/15" : "border-transparent"} rounded cursor-pointer`}
            >
              <div className="flex justify-between">
                <span>{gv.version}</span>
                <span className="text-sm text-zinc-500">{gv.path}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 justify-center items-center">
        <Link to="/versions/add" className="w-7 h-7 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <PiPlusCircleFill className="text-lg" />
        </Link>
        <Button className="w-7 h-7 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <PiTrashFill className="text-lg" />
        </Button>
        <Button className="w-7 h-7 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <PiFolderFill className="text-lg" />
        </Button>
      </div>
    </>
  )
}

export default VersionsList
