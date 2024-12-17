import { ipcMain } from "electron"
import os from "os"
import axios from "axios"
import yauzl from "yauzl"
import { join, dirname } from "path"
import fse from "fs-extra"
import { logMessage } from "@utils/logMessage"

ipcMain.handle("download-game-version", async (event, gameVersion: GameVersionType, outputPath: string) => {
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

ipcMain.handle("extract-game-version", async (event, filePath: string, outputPath: string) => {
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
