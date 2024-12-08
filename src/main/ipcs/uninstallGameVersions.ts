import { logMessage } from "@utils/logMessage"
import { ipcMain } from "electron"
import fse from "fs-extra"

ipcMain.handle("uninstall-game-version", async (_event, gameVersion: InstalledGameVersionType) => {
  logMessage("info", `[uninstall-game-version] Uninstalling game version ${gameVersion.version} from ${gameVersion.path}`)
  try {
    fse.removeSync(gameVersion.path)
    logMessage("info", `[uninstall-game-version] Successfully uninstalled game version ${gameVersion.version} from ${gameVersion.path}`)
    return Promise.resolve(true)
  } catch (err) {
    logMessage("error", `[uninstall-game-version] Error uninstalling game version ${gameVersion.version} from ${gameVersion.path}: ${err}`)
    return Promise.reject(false)
  }
})
