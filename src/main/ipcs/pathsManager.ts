import { ipcMain, shell } from "electron"
import fse from "fs-extra"
import { spawn } from "child_process"
import os from "os"
import { join } from "path"
import { logMessage } from "@utils/logMessage"

ipcMain.handle("format-path", (_event, parts: string[]): string => {
  return join(...parts)
})

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

ipcMain.handle("check-path-exists", (_event, path: string): boolean => {
  return fse.existsSync(path)
})

ipcMain.handle("look-for-a-game-version", async (_event, path: string) => {
  logMessage("info", `[component] [look-for-a-game-version] Looking for the game at ${path}`)

  const files = fse.readdirSync(path)

  if (os.platform() === "linux") {
    logMessage("info", `[component] [look-for-a-game-version] Linux platform detected`)

    for (const file of files) {
      if (file === "Vintagestory") {
        logMessage("info", `[component] [look-for-a-game-version] Game found at ${path}/Vintagestory. Looking for its version...`)

        try {
          const version = await new Promise((resolve, reject) => {
            const child = spawn(join(path, "Vintagestory"), [`-v`])

            child.stdout.on("data", (data) => {
              const version = data.toString().trim()
              resolve(version)
            })

            child.stderr.on("data", (data) => {
              reject(new Error(data.toString().trim()))
            })

            child.on("error", (err) => {
              reject(err)
            })
          })

          return { exists: true, installedGameVersion: version }
        } catch (error) {
          logMessage("error", `[component] [look-for-a-game-version] Error: ${error}`)
          return { exists: false }
        }
      } else if (file === "Vintagestory.exe") {
        logMessage("info", `[component] [look-for-a-game-version] Game found at ${path}/Vintagestory.exe. Looking for its version...`)

        try {
          const version = await new Promise((resolve, reject) => {
            const child = spawn("mono", [join(path, "Vintagestory.exe"), `-v`])

            child.stdout.on("data", (data) => {
              const version = data.toString().trim()
              resolve(version)
            })

            child.stderr.on("data", (data) => {
              reject(new Error(data.toString().trim()))
            })

            child.on("error", (err) => {
              reject(err)
            })
          })

          return { exists: true, installedGameVersion: version }
        } catch (error) {
          logMessage("error", `[component] [look-for-a-game-version] Error: ${error}`)
          return { exists: false }
        }
      }
    }
  } else if (os.platform() === "win32") {
    logMessage("info", `[component] [look-for-a-game-version] Windows platform detected`)

    for (const file of files) {
      if (file === "Vintagestory.exe") {
        logMessage("info", `[component] [look-for-a-game-version] Game found at ${path}\\Vintagestory.exe. Looking for its version...`)

        try {
          const version = await new Promise((resolve, reject) => {
            const child = spawn(`${path}\\${file}`, [`-v`])

            child.stdout.on("data", (data) => {
              const version = data.toString().trim()
              resolve(version)
            })

            child.stderr.on("data", (data) => {
              reject(new Error(data.toString().trim()))
            })

            child.on("error", (err) => {
              reject(err)
            })
          })

          return { exists: true, installedGameVersion: version }
        } catch (error) {
          logMessage("error", `[component] [look-for-a-game-version] Error: ${error}`)
          return { exists: false }
        }
      }
    }
  }

  logMessage("info", `[component] [look-for-a-game-version] Game not found at ${path} or it has no version.`)
  return { exists: false }
})

ipcMain.handle("open-path-on-file-explorer", async (_event, path: string): Promise<string> => {
  const res = await shell.openPath(path)
  return res
})
