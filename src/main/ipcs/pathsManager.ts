import { ipcMain, shell } from "electron"
import fse from "fs-extra"

ipcMain.handle("delete-path", (_event, path: string): boolean => {
  try {
    fse.removeSync(path)
    return true
  } catch (err) {
    return false
  }
})

ipcMain.handle("check-empty-path", (_event, path: string): boolean => {
  if (!fse.existsSync(path)) return true
  return fse.statSync(path).isDirectory() && fse.readdirSync(path).length === 0
})

ipcMain.handle("open-path-on-file-explorer", async (_event, path: string): Promise<string> => {
  const res = await shell.openPath(path)
  return res
})
