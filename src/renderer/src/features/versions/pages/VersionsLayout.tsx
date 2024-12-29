import { Outlet } from "react-router-dom"

function VersionsLayout(): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-8 p-4 pt-8 overflow-y-scroll">
      <Outlet />
    </div>
  )
}

export default VersionsLayout
