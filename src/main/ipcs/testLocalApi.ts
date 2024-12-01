import { ipcMain } from "electron"
import logger from "electron-log"
import fs from "fs"
import { getGameVersionsRoute } from "@utils/getRoutes"

ipcMain.handle("test-local-api", async (_event, testData: string) => {
  try {
    const gameFilesRoute = getGameVersionsRoute()

    if (!fs.existsSync(gameFilesRoute)) {
      fs.mkdirSync(gameFilesRoute)
    }

    const files = fs.readdirSync(gameFilesRoute)

    return { directory: gameFilesRoute, files: files, test: testData }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error al leer el directorio: ${error.message}`)
    } else {
      logger.error("Error desconocido al leer el directorio.")
    }

    return { directory: "", files: [], test: testData }
  }
})
