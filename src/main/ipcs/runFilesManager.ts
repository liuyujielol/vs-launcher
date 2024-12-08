import { ipcMain } from "electron"
import { spawn } from "child_process"
import { logMessage } from "@utils/logMessage"

ipcMain.handle("execute-game", async (_event, version: InstalledGameVersionType, installation: InstallationType): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      logMessage("info", `[execute-game] Executing game version ${version.version} from ${version.path}\\Vintagestory.exe with data path ${installation.path}`)

      const externalApp = spawn(`${version.path}\\Vintagestory.exe`, [`--dataPath=${installation.path}`])

      externalApp.stdout.on("data", (data) => {
        logMessage("info", `[execute-game] Game sent data: ${data}`)
      })

      externalApp.stderr.on("data", (data) => {
        logMessage("error", `[execute-game] Game sent an error: ${data}`)
      })

      externalApp.on("close", (code) => {
        logMessage("info", `[execute-game] Game closed with code: ${code}`)
        resolve(true)
      })

      externalApp.on("error", (error) => {
        logMessage("error", `[execute-game] Game error: ${error}`)
        reject(false)
      })
    } catch (error) {
      reject(false)
    }
  })
})
