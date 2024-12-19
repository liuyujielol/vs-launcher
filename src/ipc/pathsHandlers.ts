import { ipcMain, app, shell } from "electron"
import fse from "fs-extra"
import { join } from "path"
import { IPC_CHANNELS } from "@src/ipc"

export function pathsHandlerRegisterIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PATHS_MANAGER.GET_CURRENT_USER_DATA_PATH, (): string => {
    return app.getPath("appData")
  })

  ipcMain.handle(IPC_CHANNELS.PATHS_MANAGER.DELETE_PATH, (_event, path: string): boolean => {
    try {
      fse.removeSync(path)
      return true
    } catch (err) {
      return false
    }
  })

  ipcMain.handle(IPC_CHANNELS.PATHS_MANAGER.FORMAT_PATH, (_event, parts: string[]): string => {
    return join(...parts)
  })

  ipcMain.handle(IPC_CHANNELS.PATHS_MANAGER.CHECK_PATH_EMPTY, (_event, path: string): boolean => {
    if (!fse.existsSync(path)) return true
    return fse.statSync(path).isDirectory() && fse.readdirSync(path).length === 0
  })

  ipcMain.handle(IPC_CHANNELS.PATHS_MANAGER.CHECK_PATH_EXISTS, (_event, path: string): boolean => {
    return fse.existsSync(path)
  })

  ipcMain.handle(IPC_CHANNELS.PATHS_MANAGER.OPEN_PATH_ON_FILE_EXPLORER, async (_event, path: string): Promise<string> => {
    return await shell.openPath(path)
  })
}
