import { Outlet } from "react-router-dom"

function InstallationsLayout(): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-8 p-4 pt-8">
      <Outlet />
    </div>
  )
}

export default InstallationsLayout
