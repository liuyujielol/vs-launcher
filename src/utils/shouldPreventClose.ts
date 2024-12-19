import { logMessage } from "./logManager"

let shouldPreventClose = false

export const getShouldPreventClose = (): boolean => shouldPreventClose

export const setShouldPreventClose = (value): void => {
  logMessage("info", value ? `[prevent-app-closing] Preventing app from closing` : `[prevent-app-closing] Removing prevention of app from closing`)
  shouldPreventClose = value
}
