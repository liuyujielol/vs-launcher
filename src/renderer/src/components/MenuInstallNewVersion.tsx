import { useEffect, useState, useContext, useRef } from "react"
import axios from "axios"
import Button from "@components/Buttons"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"

function MenuInstallNewVersion({ installRef, setInstallRef }: { installRef: boolean; setInstallRef: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { installedGameVersions, setInstalledGameVersions } = useContext(InstalledGameVersionsContext)
  const [availableGameVersions, setAvailableGameVersions] = useState<GameVersionType[]>([])
  const [selectedGameVersion, setSelectedGameVersion] = useState<GameVersionType>()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [installing, setInstalling] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [extractProgress, setExtractProgress] = useState<number>(0)
  const downloadProgressBar = useRef<HTMLDivElement>(null)
  const extractProgressBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const { data }: { data: GameVersionType[] } = await axios("http://localhost:3000/versions")
      setAvailableGameVersions(data)

      window.api.onDownloadGameVersionProgress((_event, progress) => {
        setDownloadProgress(progress)
      })

      window.api.onExtractGameVersionProgress((_event, progress) => {
        setExtractProgress(progress)
      })
    })()
  }, [])

  useEffect(() => {
    downloadProgressBar.current!.style.width = `${downloadProgress}%`
    extractProgressBar.current!.style.width = `${extractProgress}%`
  }, [downloadProgress, extractProgress])

  useEffect(() => {
    setSelectedGameVersion(availableGameVersions[0])
  }, [availableGameVersions])

  useEffect(() => {
    ;(async (): Promise<void> => {
      const currentUserDataPath = await window.api.getCurrentUserDataPath()
      setSelectedFolder(`${currentUserDataPath}\\vsl-gameversions\\${selectedGameVersion?.version}`)
    })()
  }, [selectedGameVersion])

  const handleInstallation = async (): Promise<void> => {
    try {
      setInstalling(true)

      const filePath = await window.api.downloadGameVersion(selectedGameVersion as GameVersionType, selectedFolder)
      const result = await window.api.extractGameVersion(filePath, selectedFolder)

      if (result) {
        setInstalledGameVersions([...installedGameVersions, { version: selectedGameVersion?.version as string, path: selectedFolder }])
      }

      setSelectedGameVersion(availableGameVersions[0])
      setInstalling(false)
    } catch (error) {
      setInstalling(false)
      console.error("Error while installing:", error)
    }
  }

  return (
    <div onClick={() => !installing && setInstallRef(false)} className={`${installRef ? "absolute" : "hidden"} w-full h-full top-0 left-0 flex items-center justify-center bg-zinc-950/90`}>
      <div
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="w-[600px] flex flex-col items-center p-4 gap-4 bg-zinc-800 rounded-md shadow-xl shadow-zinc-950"
      >
        <h2 className="text-2xl font-bold">Add Version</h2>

        <div className="w-full max-h-[200px] flex flex-col gap-2">
          <h3 className="font-bold">Select version</h3>
          <div className="w-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
            {availableGameVersions.length < 1 ? (
              <div className="w-full h-full flex justify-center items-center">
                <p>No versions found</p>
              </div>
            ) : (
              <>
                {availableGameVersions.map((current) => (
                  <button
                    key={current.version}
                    className={`flex justify-between px-2 py-1 font-bold rounded-md shadow-md shadow-zinc-950 disabled:shadow-none disabled:opacity-50  hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${current.version === selectedGameVersion?.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                    onClick={() => setSelectedGameVersion(current)}
                    disabled={installedGameVersions.some((igv) => igv.version === current.version) || installing}
                  >
                    <span>{current.version}</span>
                    <span>{installedGameVersions.find((igv) => igv.version === current.version) ? "Installed" : ""}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <h3 className="font-bold">Select folder</h3>
          <div className="w-full flex gap-4 items-center">
            <Button
              btnType="custom"
              className="w-24 h-10 bg-zinc-900"
              disabled={installing}
              onClick={async () => {
                const userSelectedFolder = await window.api.selectFolderDialog()
                setSelectedFolder(userSelectedFolder)
              }}
            >
              Select
            </Button>
            <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none overflow-x-scroll whitespace-nowrap">{selectedFolder}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <h3 className="font-bold">Downloaded</h3>
          <div className="w-full h-2 bg-zinc-900 rounded-full">
            <div className={`h-full bg-green-500 rounded-full`} ref={downloadProgressBar}></div>
          </div>

          <h3 className="font-bold">Extracted</h3>
          <div className="w-full h-2 bg-zinc-900 rounded-full">
            <div className={`h-full bg-green-500 rounded-full`} ref={extractProgressBar}></div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button btnType="custom" className="w-24 h-10 bg-zinc-900" disabled={!selectedGameVersion || installing} onClick={handleInstallation}>
            Install
          </Button>
          <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setInstallRef(false)} disabled={installing}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MenuInstallNewVersion
