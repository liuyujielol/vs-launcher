import { ipcMain } from "electron"
import axios from "axios"
import yauzl from "yauzl"
import fs from "fs"
import path from "path"
import fsExtra from "fs-extra"

ipcMain.handle("download-game-version", async (event, gameVersion: GameVersionType, outputPath: string) => {
  const url = gameVersion.windows
  const { data, headers } = await axios({
    url,
    method: "GET",
    responseType: "stream"
  })

  const totalLength = headers["content-length"]

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  const pathToDownload = `${outputPath}\\${gameVersion.version}.zip`
  const writer = fs.createWriteStream(pathToDownload)

  let downloadedLength = 0
  data.on("data", (chunk) => {
    downloadedLength += chunk.length
    event.sender.send("download-game-version-progress", Math.round((downloadedLength / totalLength) * 100))
  })

  data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(pathToDownload))
    writer.on("error", reject)
  })
})

ipcMain.handle("extract-game-version", async (event, filePath: string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    // lazyEntries para poder leer manualmente
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(`Error opening ZIP file: ${err}`)

      const totalFiles = zipfile.entryCount
      let extractedCount = 0

      zipfile.readEntry() // Comenzar la lectura

      zipfile.on("entry", (entry) => {
        const fullPath = path.join(outputPath, entry.fileName)

        // Si la entrada es un directorio, lo creamos
        if (/\/$/.test(entry.fileName)) {
          fsExtra.ensureDirSync(fullPath)
          extractedCount++
          return zipfile.readEntry() // Leer siguiente entrada
        }

        // Si la entrada es un archivo, lo extraemos
        zipfile.openReadStream(entry, (err, readStream) => {
          if (err) {
            return reject(`Error opening file ${entry.fileName}: ${err}`)
          }

          fsExtra.ensureDirSync(path.dirname(fullPath)) // Aseguramos que el directorio exista antes de escribir el archivo

          const writeStream = fs.createWriteStream(fullPath)

          readStream.pipe(writeStream) // Cuando el archivo se escribe completamente

          writeStream.on("finish", () => {
            extractedCount++
            const progress = Math.round((extractedCount / totalFiles) * 100)
            event.sender.send("extract-game-version-progress", progress)

            if (extractedCount === totalFiles) {
              zipfile.close()
              fs.unlink(filePath, (err) => {
                if (err) return reject(`Error deleting ZIP: ${err}`)
                resolve(true)
              })
            } else {
              zipfile.readEntry()
            }
          })

          writeStream.on("error", (err) => {
            reject(`Error writing file ${err}`)
          })
        })
      })

      zipfile.on("error", (err) => {
        reject(`Error while extracting: ${err}`)
      })
    })
  })
})
