import { ipcMain, app } from "electron"
import { setShouldPreventClose } from "@utils/shouldPreventClose"

ipcMain.handle("get-current-user-data-path", (): string => {
  return app.getPath("appData")
})

ipcMain.on("set-should-prevent-close", (_event, value: boolean) => {
  setShouldPreventClose(value)
})
