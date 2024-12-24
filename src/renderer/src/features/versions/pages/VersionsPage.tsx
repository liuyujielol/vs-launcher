import { PiPlusCircleFill, PiTrashFill, PiFolderFill } from "react-icons/pi"

import { LinesListContainer, LinesListItem } from "@renderer/components/ui/lists/LinesList"
import Button from "@renderer/components/ui/inputs/Button"

function VersionsPage(): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 pt-8">
      <h1 className="text-3xl text-center">Version Manager</h1>

      <div className="mx-auto h-full w-full max-w-[1000px]">
        <LinesListContainer>
          <LinesListItem>
            <span>Version 1.0.0</span>
          </LinesListItem>
          <LinesListItem selected={true}>
            <span>Version 2.0.0</span>
          </LinesListItem>
          <LinesListItem>
            <span>Version 3.0.0</span>
          </LinesListItem>
          <LinesListItem>
            <span>Version 4.0.0</span>
          </LinesListItem>
        </LinesListContainer>
      </div>

      <div className="flex gap-2 justify-center items-center">
        <Button width="sm" height="sm">
          <PiPlusCircleFill className="text-lg" />
        </Button>
        <Button width="sm" height="sm">
          <PiTrashFill className="text-lg" />
        </Button>
        <Button width="sm" height="sm">
          <PiFolderFill className="text-lg" />
        </Button>
      </div>
    </div>
  )
}

export default VersionsPage
