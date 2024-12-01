import { useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6"

function InstallarionsMenu({
  installations,
  installation,
  setInstallation
}: {
  installations: { id: string; name: string; version: string }[]
  installation: string
  setInstallation: (installation: string) => void
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-80 flex flex-col text-zinc-300 font-bold bg-zinc-800 rounded shadow-md shadow-zinc-900">
      {isOpen && (
        <div className="w-full max-h-64 overflow-y-scroll">
          {installations.map(
            (current) =>
              current.id != installation && (
                <button
                  key={current.id}
                  onClick={() => {
                    setInstallation(current.id)
                    setIsOpen(false)
                  }}
                  className="w-full h-16 p-2 flex justify-between items-center rounded hover:bg-zinc-900"
                >
                  <div className="flex flex-col items-start justify-center">
                    <span>{current.name}</span>
                    <span className="text-sm text-zinc-400">{current.version}</span>
                  </div>
                </button>
              )
          )}
        </div>
      )}
      {installations.map(
        (current) =>
          current.id === installation && (
            <button
              title={isOpen ? "Ver menos instalaciones" : "Ver más instalaciones"}
              key={current.id}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-16 p-2 flex justify-between items-center rounded hover:bg-zinc-900"
            >
              <div className="flex flex-col items-start justify-center">
                <span>{current.name}</span>
                <span className="text-sm text-zinc-400">{current.version}</span>
              </div>
              {isOpen ? <FaAngleDown /> : <FaAngleUp />}
            </button>
          )
      )}
    </div>
  )
}

export default InstallarionsMenu
