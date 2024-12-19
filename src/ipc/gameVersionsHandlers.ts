import { ipcMain } from "electron"
import os from "os"
import axios from "axios"
import yauzl from "yauzl"
import { join, dirname } from "path"
import fse from "fs-extra"
import { spawn } from "child_process"
import { logMessage } from "@src/utils/logManager"
import { IPC_CHANNELS } from "@src/ipc/ipcChannels"

ipcMain.handle(IPC_CHANNELS.GAME_VERSIONS_MANAGER.DOWNLOAD_GAME_VERSION, async (event, gameVersion: GameVersionType, outputPath: string) => {
  const pathToDownload = join(outputPath, `${gameVersion.version}.zip`)

  logMessage("info", `[ipcMain] [download-game-version] Downloading game version ${gameVersion.version} to ${pathToDownload}`)

  let url: string

  if (os.platform() === "linux") {
    logMessage("info", `[ipcMain] [download-game-version] Detected Linux platform`)
    url = gameVersion.linux
  } else {
    logMessage("info", `[ipcMain] [download-game-version] Detected Windows platform`)
    url = gameVersion.windows
  }

  const { data, headers } = await axios({
    url,
    method: "GET",
    responseType: "stream"
  })

  const totalLength = headers["content-length"]

  if (!fse.existsSync(outputPath)) {
    fse.mkdirSync(outputPath, { recursive: true })
    logMessage("info", `[ipcMain] [download-game-version] Created output directory ${outputPath}`)
  }

  const writer = fse.createWriteStream(pathToDownload)

  let downloadedLength = 0
  data.on("data", (chunk) => {
    downloadedLength += chunk.length
    event.sender.send("download-game-version-progress", Math.round((downloadedLength / totalLength) * 100))
  })

  data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      logMessage("info", `[ipcMain] [download-game-version] Succesfully downloaded game version ${gameVersion.version} to ${pathToDownload}`)
      return resolve(pathToDownload)
    })
    writer.on("error", (err) => {
      logMessage("error", `[ipcMain] [download-game-version] Error downloading game version ${gameVersion.version} to ${pathToDownload}: ${err}`)
      return reject(err)
    })
  })
})

ipcMain.handle(IPC_CHANNELS.GAME_VERSIONS_MANAGER.EXTRACT_GAME_VERSION, async (event, filePath: string, outputPath: string) => {
  logMessage("info", `[ipcMain] [extract-game-version] Extracting game version from ${filePath} to ${outputPath}`)

  return new Promise((resolve, reject) => {
    // lazyEntries para poder leer manualmente
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        logMessage("error", `[ipcMain] [extract-game-version] Error opening ZIP file ${filePath}: ${err}`)
        return reject(`Error opening ZIP file: ${err}`)
      }

      const totalFiles = zipfile.entryCount
      let extractedCount = 0

      zipfile.readEntry() // Comenzar la lectura

      zipfile.on("entry", (entry) => {
        const fullPath = join(outputPath, entry.fileName)

        // Si la entrada es un directorio, lo creamos
        if (/\/$/.test(entry.fileName)) {
          fse.ensureDirSync(fullPath)
          extractedCount++
          return zipfile.readEntry() // Leer siguiente entrada
        }

        // Si la entrada es un archivo, lo extraemos
        zipfile.openReadStream(entry, (err, readStream) => {
          if (err) {
            logMessage("error", `[ipcMain] [extract-game-version] Error opening file ${entry.fileName}: ${err}`)
            return reject(`Error opening file ${entry.fileName}: ${err}`)
          }

          fse.ensureDirSync(dirname(fullPath)) // Aseguramos que el directorio exista antes de escribir el archivo

          const writeStream = fse.createWriteStream(fullPath)

          readStream.pipe(writeStream) // Cuando el archivo se escribe completamente

          writeStream.on("finish", () => {
            extractedCount++
            const progress = Math.round((extractedCount / totalFiles) * 100)
            event.sender.send("extract-game-version-progress", progress)

            if (extractedCount === totalFiles) {
              zipfile.close()

              if (os.platform() === "linux") {
                logMessage("info", `[ipcMain] [extract-game-version] Linux platform detected`)

                if (fse.existsSync(join(outputPath, "Vintagestory"))) {
                  fse.chmodSync(join(outputPath, "Vintagestory"), 0o755)
                  logMessage("info", `[ipcMain] [extract-game-version] Changed perms to 755 to ${join(outputPath, "Vintagestory")}`)
                } else if (fse.existsSync(join(outputPath, "Vintagestory.exe"))) {
                  fse.chmodSync(join(outputPath, "Vintagestory.exe"), 0o755)
                  logMessage("info", `[ipcMain] [extract-game-version] Changed perms to 755 to ${join(outputPath, "Vintagestory.exe")}`)
                }
              }

              fse.unlink(filePath, (err) => {
                if (err) {
                  logMessage("error", `[ipcMain] [extract-game-version] Error deleting ZIP file ${filePath}: ${err}`)
                  return reject(`Error deleting ZIP: ${err}`)
                }
                logMessage("info", `[ipcMain] [extract-game-version] ZIP file ${filePath} deleted`)
                return resolve(true)
              })
            } else {
              zipfile.readEntry()
            }
          })

          writeStream.on("error", (err) => {
            logMessage("error", `[ipcMain] [extract-game-version] Error writing file ${entry.fileName}: ${err}`)
            return reject(`Error writing file ${err}`)
          })
        })
      })

      zipfile.on("error", (err) => {
        logMessage("error", `[ipcMain] [extract-game-version] Error while extracting: ${err}`)
        return reject(`Error while extracting: ${err}`)
      })
    })
  })
})

ipcMain.handle(IPC_CHANNELS.GAME_VERSIONS_MANAGER.UNINSTALL_GAME_VERSION, async (_event, gameVersion: InstalledGameVersionType) => {
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

ipcMain.handle(IPC_CHANNELS.GAME_VERSIONS_MANAGER.LOOK_FOR_A_GAME_VERSION, async (_event, path: string) => {
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
