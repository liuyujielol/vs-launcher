import Button from "@components/Buttons"
import { useEffect, useState } from "react"
import { FaPlus, FaTrashCan, FaFolderOpen } from "react-icons/fa6"

type InstalledGameVersionType = {
  version: string
  path: string
}

const vrsns: InstalledGameVersionType[] = [
  {
    version: "1.19.7",
    path: "C:Users/YourUser/AppData/Roaming/VSLVersions/1.19.7"
  },
  {
    version: "1.19.6",
    path: "C:Users/YourUser/AppData/Roaming/VSLVersions/1.19.6"
  },
  {
    version: "1.18.3",
    path: "C:Users/YourUser/AppData/Roaming/VSLVersions/1.19.5"
  },
  {
    version: "1.18.2",
    path: "C:Users/YourUser/AppData/Roaming/VSLVersions/1.19.4"
  },
  {
    version: "1.18.1",
    path: "C:Users/YourUser/AppData/Roaming/VSLVersions/1.19.3"
  }
]

function Versions(): JSX.Element {
  const [selected, setSelected] = useState(vrsns[0])
  const [installMenu, setInstallMenu] = useState(false)

  return (
    <main className="relative flex flex-col gap-4 p-4 bg-zinc-800 text-zinc-200">
      <div className="h-full flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Version Manager</h1>

        <div className="w-full h-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {vrsns.length < 1 ? (
            <p>No versions found</p>
          ) : (
            <>
              {vrsns.map((version) => (
                <button
                  key={version.version}
                  onClick={() => setSelected(version)}
                  className={`flex justify-between px-4 py-2 font-bold rounded-md shadow-md shadow-zinc-950 hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${selected.version === version.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                >
                  <span>{version.version}</span>
                  <span>{version.path}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button btnType="sm" title="Add version" className="bg-zinc-900" onClick={() => setInstallMenu(true)}>
          <FaPlus />
        </Button>
        <Button btnType="sm" title="Delete selected version" className="bg-zinc-900">
          <FaTrashCan />
        </Button>
        <Button btnType="sm" title="Open selected version folder" className="bg-zinc-900">
          <FaFolderOpen />
        </Button>
      </div>

      <FormNewVersion installRef={installMenu} setInstallRef={setInstallMenu} installedVersions={vrsns} />
    </main>
  )
}

export default Versions

function FormNewVersion({
  installRef,
  setInstallRef,
  installedVersions
}: {
  installRef: boolean
  setInstallRef: React.Dispatch<React.SetStateAction<boolean>>
  installedVersions: InstalledGameVersionType[]
}): JSX.Element {
  const [versions, setVersions] = useState<GameVersionType[]>([])
  const [version, setVersion] = useState<GameVersionType>()

  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await fetch("http://localhost:3000/versions")
      const data = await res.json()

      setVersions(data)

      for (let i = 0; i < data.length; i++) {
        if (!installedVersions.find((iv) => iv.version === data[i].version)) {
          setVersion(data[i])
        }
      }

      setVersion(data[0])
    })()
  }, [])

  return (
    <div onClick={() => setInstallRef(false)} className={`${installRef ? "absolute" : "hidden"} w-full h-full top-0 left-0 flex items-center justify-center bg-zinc-950/50`}>
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="w-[500px] max-h-[400px] flex flex-col items-center p-4 gap-4 bg-zinc-800 rounded-md shadow-xl shadow-zinc-950"
      >
        <h2 className="text-2xl font-bold">Add Version</h2>
        <div className="w-full flex flex-col gap-2">
          <h3 className="font-bold">Select folder</h3>
          <div className="w-full flex gap-4 items-center">
            <Button btnType="custom" className="w-24 h-10 bg-zinc-900">
              Select
            </Button>
            <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900">Folder</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <h3 className="font-bold">Select version</h3>
          <div className="w-full h-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
            {versions.length < 1 ? (
              <p>No versions found</p>
            ) : (
              <>
                {versions.map((current) => (
                  <button
                    key={current.version}
                    className={`flex justify-between px-2 py-1 font-bold rounded-md shadow-md shadow-zinc-950 hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${current.version === version?.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                  >
                    <span>{current.version}</span>
                    <span>{installedVersions.find((v) => v.version === current.version) ? "Installed" : ""}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button btnType="custom" className="w-24 h-10 bg-zinc-900">
            Install
          </Button>
          <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setInstallRef(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
