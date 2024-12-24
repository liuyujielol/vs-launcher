import { ipcMain, app, shell } from "electron"
import fse from "fs-extra"
import { join, dirname } from "path"
import os from "os"
import axios from "axios"
import yauzl from "yauzl"
import { spawn } from "child_process"
import { logMessage } from "@src/utils/logManager"
import { IPC_CHANNELS } from "@src/ipc/ipcChannels"

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

ipcMain.handle(IPC_CHANNELS.FILES_MANAGER.DOWNLOAD_ON_PATH, async (event, id: string, url: string, outputPath: string) => {
  const pathToDownload = join(outputPath, url.split("/").pop() ?? "")

  logMessage("info", `[ipcMain] [download-on-path] Download ID: ${id} Downloading ${url} to ${pathToDownload}...`)

  const { data, headers } = await axios({
    url,
    method: "GET",
    responseType: "stream"
  })

  const totalLength = headers["content-length"]

  if (!fse.existsSync(outputPath)) {
    fse.mkdirSync(outputPath, { recursive: true })
    logMessage("info", `[ipcMain] [download-on-path] Download ID: ${id} Created output directory ${outputPath}`)
  }

  const writer = fse.createWriteStream(pathToDownload)

  let downloadedLength = 0
  data.on("data", (chunk) => {
    downloadedLength += chunk.length
    event.sender.send(IPC_CHANNELS.FILES_MANAGER.DOWNLOAD_PROGRESS, id, Math.round((downloadedLength / totalLength) * 100))
  })

  data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      logMessage("info", `[ipcMain] [download-on-path] Download ID: ${id} Succesfully downloaded ${url} to ${pathToDownload}`)
      return resolve(pathToDownload)
    })
    writer.on("error", (err) => {
      logMessage("error", `[ipcMain] [download-on-path] Download ID: ${id} Error downloading ${url} to ${pathToDownload}: ${err}`)
      return reject(err)
    })
  })
})

ipcMain.handle(IPC_CHANNELS.FILES_MANAGER.EXTRACT_ON_PATH, async (event, id: string, filePath: string, outputPath: string) => {
  logMessage("info", `[ipcMain] [extract-on-path] Extraction ID: ${id} Extracting ${filePath} to ${outputPath}...`)

  return new Promise((resolve, reject) => {
    // lazyEntries para poder leer manualmente
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        logMessage("error", `[ipcMain] [extract-on-path] Extraction ID: ${id} Error opening ZIP file ${filePath}: ${err}`)
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
            logMessage("error", `[ipcMain] [extract-on-path] Extraction ID: ${id} Error opening file ${entry.fileName}: ${err}`)
            return reject(`Error opening file ${entry.fileName}: ${err}`)
          }

          fse.ensureDirSync(dirname(fullPath)) // Aseguramos que el directorio exista antes de escribir el archivo

          const writeStream = fse.createWriteStream(fullPath)

          readStream.pipe(writeStream) // Cuando el archivo se escribe completamente

          writeStream.on("finish", () => {
            extractedCount++
            const progress = Math.round((extractedCount / totalFiles) * 100)
            event.sender.send(IPC_CHANNELS.FILES_MANAGER.EXTRACT_PROGRESS, id, progress)

            if (extractedCount === totalFiles) {
              zipfile.close()

              fse.unlink(filePath, (err) => {
                if (err) {
                  logMessage("error", `[ipcMain] [extract-on-path] Extraction ID: ${id} Error deleting ZIP file ${filePath}: ${err}`)
                  return reject(`Error deleting ZIP: ${err}`)
                }
                logMessage("info", `[ipcMain] [extract-on-path] Extraction ID: ${id} ZIP file ${filePath} deleted`)
                return resolve(true)
              })
            } else {
              zipfile.readEntry()
            }
          })

          writeStream.on("error", (err) => {
            logMessage("error", `[ipcMain] [extract-on-path] Extraction ID: ${id} Error writing file ${entry.fileName}: ${err}`)
            return reject(`Error writing file ${err}`)
          })
        })
      })

      zipfile.on("error", (err) => {
        logMessage("error", `[ipcMain] [extract-on-path] Extraction ID: ${id} Error while extracting: ${err}`)
        return reject(`Error while extracting: ${err}`)
      })
    })
  })
})

ipcMain.handle(IPC_CHANNELS.FILES_MANAGER.CHANGE_PERMS, (_event, paths: string[], perms: number) => {
  if (os.platform() === "linux") {
    logMessage("info", `[ipcMain] [extract-game-version] Linux platform detected`)

    for (const path of paths) {
      if (fse.existsSync(path)) {
        fse.chmodSync(path, perms)
        logMessage("info", `[ipcMain] [extract-game-version] Changed perms to ${perms} to ${path}`)
      }
    }
  }
})

ipcMain.handle(IPC_CHANNELS.FILES_MANAGER.LOOK_FOR_A_GAME_VERSION, async (_event, path: string) => {
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
