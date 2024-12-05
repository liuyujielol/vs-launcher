import { useContext, useState, useEffect, useRef } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6"
import { InstallationContext } from "@contexts/InstallationContext"

function InstallarionsMenu({ className }: { className?: string }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [installations, setInstallations] = useState<InstallationType[]>([])
  const { installation, setInstallation } = useContext(InstallationContext)

  const firstTimeCheckingInstallations = useRef(true)
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (firstTimeCheckingInstallations.current) {
        firstTimeCheckingInstallations.current = false

        const config = await window.api.getConfig()
        setInstallations(config.installations)

        const localStorageInstallation = window.localStorage.getItem("installation")
        if (localStorageInstallation) {
          const installation = config.installations.find((current) => current.id === localStorageInstallation)
          if (installation) {
            setInstallation(installation)
          } else {
            setInstallation(config.installations[0])
          }
        } else {
          setInstallation(config.installations[0])
        }
      }
    })()
  }, [])

  return (
    <div className={`min-h-16 max-h-48 flex flex-col text-zinc-200 font-bold bg-zinc-800 rounded ${className}`}>
      {installations.length === 0 ? (
        <div className="w-full h-16 p-2 flex justify-between items-center rounded ">
          <p>No tienes ninguna instalación</p>
        </div>
      ) : (
        <>
          {isOpen && (
            <div className="w-full max-h-64 overflow-y-scroll">
              {installations.map(
                (current) =>
                  current.id != installation.id && (
                    <button
                      key={current.id}
                      onClick={() => {
                        setInstallation(current)
                        window.localStorage.setItem("installation", current.id)
                        setIsOpen(false)
                      }}
                      className="w-full h-16 px-4 py-2 flex justify-between items-center rounded shrink-0"
                    >
                      <div className="flex flex-col items-start justify-center">
                        <span>{current.name}</span>
                        <span className="text-sm text-zinc-400">
                          {current.version}
                          {current.mods.length > 0 && ` (${current.mods.length} mods)`}
                        </span>
                      </div>
                    </button>
                  )
              )}
            </div>
          )}
          {installations.map(
            (current) =>
              current.id === installation.id && (
                <button
                  title={isOpen ? "Close menu" : "Open menu"}
                  key={current.id}
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full h-16 px-4 py-2 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
                >
                  <div className="flex flex-col items-start justify-center">
                    <span>{current.name}</span>
                    <span className="text-sm text-zinc-400">
                      {current.version}
                      {current.mods.length > 0 && ` (${current.mods.length} mods)`}
                    </span>
                  </div>
                  {isOpen ? <FaAngleDown /> : <FaAngleUp />}
                </button>
              )
          )}
        </>
      )}
    </div>
  )
}

export default InstallarionsMenu
