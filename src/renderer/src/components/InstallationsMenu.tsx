import { useContext, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6"
import { InstallationContext } from "@contexts/InstallationContext"
import { InstallationsContext } from "@contexts/InstallationsContext"

function InstallarionsMenu({ className }: { className?: string }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const { installations } = useContext(InstallationsContext)
  const { installation, setInstallation } = useContext(InstallationContext)

  return (
    <div className={`min-h-16 max-h-48 flex flex-col text-zinc-200 font-bold bg-zinc-800 rounded ${className}`}>
      {installations.length === 0 ? (
        <div className="w-full h-16 p-2 flex justify-center items-center rounded ">
          <p>You dont have any installations</p>
        </div>
      ) : (
        <>
          {isOpen && (
            <div className="w-full max-h-64 overflow-y-scroll">
              {installations.map(
                (current) =>
                  current.id != installation?.id && (
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
          {!installation ? (
            <button
              title={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-16 px-4 py-2 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
            >
              <div className="flex flex-col items-start justify-center">
                <span>No installation selected</span>
                <span className="text-sm text-zinc-400">X.X.X</span>
              </div>
              {isOpen ? <FaAngleDown /> : <FaAngleUp />}
            </button>
          ) : (
            <>
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
        </>
      )}
    </div>
  )
}

export default InstallarionsMenu
