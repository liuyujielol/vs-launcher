import { logMessage } from "@utils/logMessage"
import { ipcMain } from "electron"

ipcMain.on("log-message", (_event, mode: "error" | "warn" | "info" | "debug" | "verbose", message: string): void => {
  logMessage(mode, message)
})
