import { ipcMain, app } from "electron"

ipcMain.handle("get-current-user-data-path", (): string => {
  return app.getPath("appData")
})
