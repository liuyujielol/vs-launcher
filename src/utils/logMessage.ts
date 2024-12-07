import Logger from "electron-log"

export const logMessage = (mode: "error" | "warn" | "info" | "debug" | "verbose", message: string): void => {
  switch (mode) {
    case "error":
      Logger.error(`${message}`)
      break
    case "warn":
      Logger.warn(`${message}`)
      break
    case "info":
      Logger.info(`${message}`)
      break
    case "debug":
      Logger.debug(`${message}`)
      break
    case "verbose":
      Logger.verbose(`${message}`)
      break
    default:
      break
  }
}
