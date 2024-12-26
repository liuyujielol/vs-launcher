import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { PiCaretDownBold } from "react-icons/pi"
import { AnimatePresence, motion } from "motion/react"
import { Button, Input, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { Link } from "react-router-dom"
import axios from "axios"

import { useNotificationsContext } from "@renderer/contexts/NotificationsContext"
import { useInstalledGameVersionsContext } from "@renderer/contexts/InstalledGameVersionsContext"
import { useTaskContext } from "@renderer/contexts/TaskManagerContext"

function AddVersion(): JSX.Element {
  const { t } = useTranslation()
  const { addNotification } = useNotificationsContext()
  const { installedGameVersions, setInstalledGameVersions } = useInstalledGameVersionsContext()
  const { startDownload, startExtract } = useTaskContext()

  const [gameVersions, setGameVersions] = useState<GameVersionType[]>([])
  const [version, setVersion] = useState<GameVersionType>()
  const [folder, setFolder] = useState<string>("")
  const [folderByUser, setFolderByUser] = useState<boolean>(false)

  useEffect(() => {
    ;(async (): Promise<void> => {
      window.api.utils.logMessage("info", `[component] [AddVersion] Fetching available game versions`)
      const { data }: { data: GameVersionType[] } = await axios("https://vslapi.xurxomf.xyz/versions")
      setGameVersions(data)
    })()
  }, [])

  useEffect(() => {
    ;(async (): Promise<void> => {
      if (version && !folderByUser) setFolder(await window.api.pathsManager.formatPath([await window.api.pathsManager.getCurrentUserDataPath(), "VSLGameVersions", version.version]))
    })()
  }, [version])

  useEffect(() => {
    setVersion(gameVersions.find((gv) => !installedGameVersions.some((igv) => igv.version === gv.version)))
  }, [gameVersions])

  const handleAddInstallation = async (): Promise<void> => {
    if (!version) return addNotification(t("notifications.titles.error"), t("features.versions.noVersionSelected"), "error")

    if (installedGameVersions.some((igv) => igv.version === version.version))
      return addNotification(t("notifications.titles.error"), t("features.versions.versionAlreadyInstalled", { version: version.version }), "error")

    const os = await window.api.utils.getOs()
    const url = os === "win32" ? version.windows : version.linux

    const newGameVersion: InstalledGameVersionType = {
      version: version!.version,
      path: folder,
      installed: false
    }

    setInstalledGameVersions([newGameVersion, ...installedGameVersions])

    startDownload(`version ${newGameVersion.version}`, `Donwloading game version ${newGameVersion.version}`, url, folder, (status, path) => {
      if (!status) return setInstalledGameVersions(installedGameVersions.filter((igv) => igv.version !== newGameVersion.version))
      startExtract(`version ${newGameVersion.version}`, `Extracting game version ${newGameVersion.version}`, path, folder, (status) => {
        if (!status) return setInstalledGameVersions(installedGameVersions.filter((igv) => igv.version !== newGameVersion.version))
        setInstalledGameVersions([newGameVersion, ...installedGameVersions])
      })
    })
  }

  return (
    <>
      <h1 className="text-3xl text-center font-bold">Install a new version</h1>

      <div className="mx-auto w-[800px] flex flex-col gap-4 items-start justify-center">
        <div className="w-full flex flex-col gap-1">
          <h2 className="text-lg">Version</h2>
          <Listbox value={version} onChange={setVersion}>
            {({ open }) => (
              <>
                <ListboxButton className="bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none w-full h-8 flex items-center justify-between gap-2 rounded overflow-hidden">
                  {gameVersions
                    .filter((gv) => gv.version === version?.version)
                    .map((gv) => (
                      <div key={gv.version} className="flex gap-2 px-2 py-1 items-center overflow-hidden">
                        <span className="whitespace-nowrap font-bold text-sm">{gv.version}</span>
                      </div>
                    ))}
                  <PiCaretDownBold className="text-sm text-zinc-500 shrink-0 mr-2 data-[open]:rotate-180" />
                </ListboxButton>
                <AnimatePresence>
                  {open && (
                    <ListboxOptions
                      static
                      as={motion.div}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      anchor="bottom"
                      className="w-[var(--button-width)] bg-zinc-850 shadow shadow-zinc-900 mt-2 rounded z-50"
                    >
                      <div className="flex flex-col max-h-40">
                        {gameVersions.map((gv) => (
                          <ListboxOption
                            key={gv.version}
                            value={gv}
                            disabled={installedGameVersions.some((igv) => igv.version === gv.version)}
                            className="cursor-pointer data-[disabled]:opacity-50 hover:pl-1 duration-100 odd:bg-zinc-850 even:bg-zinc-800"
                          >
                            <div className="flex gap-2 h-8 px-2 py-1 items-center overflow-hidden" title={gv.version}>
                              <span className="whitespace-nowrap font-bold text-sm">{gv.version}</span>
                            </div>
                          </ListboxOption>
                        ))}
                      </div>
                    </ListboxOptions>
                  )}
                </AnimatePresence>
              </>
            )}
          </Listbox>
        </div>

        <div className="w-full flex flex-col gap-1">
          <h2 className="text-lg">Folder</h2>
          <div className="w-full flex gap-2">
            <Button
              onClick={async () => {
                const path = await window.api.utils.selectFolderDialog()
                if (path && path.length > 0) {
                  setFolder(path)
                  setFolderByUser(true)
                }
              }}
              className="w-fit h-8 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded"
            >
              <span className="px-2 py-1">Browse</span>
            </Button>
            <Input
              placeholder="Version folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full h-8 bg-zinc-850 px-2 py-1 rounded-md shadow shadow-zinc-900 hover:shadow-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center items-center">
        <Button onClick={handleAddInstallation} className="w-fit h-8 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <span className="px-2 py-1">Install</span>
        </Button>
        <Link to="/versions" title="Cancel" className="w-fit h-8 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <span className="px-2 py-1">Cancel</span>
        </Link>
      </div>
    </>
  )
}

export default AddVersion
