import icon from "@assets/icon.png"
import { useState } from "react"
import InstallationsMenu from "@components/InstallationsMenu"
import { FaPlus, FaWhmcs, FaTrashCan } from "react-icons/fa6"

const INSTALLATIONS = [
  {
    id: "gallaecia",
    name: "Gallaecia",
    version: "1.18.5"
  },
  {
    id: "vaporwave-vintage-story",
    name: "Vaporwave Vintage Story",
    version: "1.19.8"
  },
  {
    id: "test1",
    name: "Test1",
    version: "1.20.1"
  },
  {
    id: "test2",
    name: "Test2",
    version: "1.20.1"
  },
  {
    id: "test3",
    name: "Test3",
    version: "1.20.1"
  },
  {
    id: "test4",
    name: "Test4",
    version: "1.20.1"
  },
  {
    id: "test5",
    name: "Test5",
    version: "1.20.1"
  }
]

function Home(): JSX.Element {
  const [installation, setInstallation] = useState(INSTALLATIONS[0].id)

  return (
    <main className="flex flex-col items-center justify-between bg-image-1 p-4">
      <img src={icon} alt="Vintage Story Logo" className="w-64" />
      <div className="w-full flex items-end justify-between">
        <div className="flex gap-4 items-end">
          <InstallationsMenu installations={INSTALLATIONS} installation={installation} setInstallation={setInstallation} />
          <button title="Editar instalación" className="w-16 h-16 p-2 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-900 shadow-md shadow-zinc-900 text-zinc-300">
            <FaWhmcs />
          </button>
          <div className="flex flex-col gap-2">
            <button title="Crear instalación" className="w-7 h-7 p-2 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-900 shadow-md shadow-zinc-900 text-zinc-300">
              <FaPlus />
            </button>
            <button title="Eliminar instalación" className="w-7 h-7 p-2 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-900 shadow-md shadow-zinc-900 text-zinc-300">
              <FaTrashCan />
            </button>
          </div>
        </div>
        <button title="Jugar" className="w-32 h-16 p-2 flex items-center justify-center rounded bg-green-600 hover:bg-green-700 shadow-md shadow-zinc-900 font-bold text-xl">
          Jugar
        </button>
      </div>
    </main>
  )
}

export default Home
