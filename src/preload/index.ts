import { contextBridge, ipcRenderer, shell } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import { logMessage } from "@utils/logMessage"
import { autoUpdater } from "electron-updater"

// Custom APIs for renderer
const api: LocalAPI = {
  getVersion: (): Promise<string> => ipcRenderer.invoke("get-version"),
  logMessage: (mode: "error" | "warn" | "info" | "debug" | "verbose", message: string): void => ipcRenderer.send("log-message", mode, message),
  setPreventAppClose: (value: boolean): void => ipcRenderer.send("set-should-prevent-close", value),
  openOnBrowser: (url: string): Promise<void> => shell.openExternal(url),
  selectFolderDialog: (): Promise<string> => ipcRenderer.invoke("select-folder-dialog"),
  onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on("update-downloaded", callback),
  updateAndRestart: () => autoUpdater.quitAndInstall(),
  getConfig: (): Promise<ConfigType> => ipcRenderer.invoke("get-config"),
  saveConfig: (configJson: ConfigType): Promise<boolean> => ipcRenderer.invoke("save-config", configJson),
  getCurrentUserDataPath: (): Promise<string> => ipcRenderer.invoke("get-current-user-data-path"),
  downloadGameVersion: (gameVersion: GameVersionType, outputPath: string): Promise<string> => ipcRenderer.invoke("download-game-version", gameVersion, outputPath),
  extractGameVersion: (filePath: string, outputPath: string): Promise<boolean> => ipcRenderer.invoke("extract-game-version", filePath, outputPath),
  onDownloadGameVersionProgress: (callback: ProgressCallback) => ipcRenderer.on("download-game-version-progress", callback),
  onExtractGameVersionProgress: (callback: ProgressCallback) => ipcRenderer.on("extract-game-version-progress", callback),
  uninstallGameVersion: (gameVersion: InstalledGameVersionType): Promise<boolean> => ipcRenderer.invoke("uninstall-game-version", gameVersion),
  deletePath: (path: string): Promise<boolean> => ipcRenderer.invoke("delete-path", path),
  checkEmptyPath: (path: string): Promise<boolean> => ipcRenderer.invoke("check-empty-path", path),
  checkPathExists: (path: string): Promise<boolean> => ipcRenderer.invoke("check-path-exists", path),
  lookForAGameVersion: (path: string): Promise<{ exists: boolean; installedGameVersion: string | undefined }> => ipcRenderer.invoke("look-for-a-game-version", path),
  openPathOnFileExplorer: (path: string): Promise<string> => ipcRenderer.invoke("open-path-on-file-explorer", path),
  executeGame: (version: InstalledGameVersionType, installation: InstallationType): Promise<boolean> => ipcRenderer.invoke("execute-game", version, installation)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
    logMessage("info", "[preload] Exposed Electron APIs")
  } catch (error) {
    logMessage("error", "[preload] Failed to expose Electron APIs")
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api

  logMessage("info", "[preload] Exposed Electron APIs")
}

export type ApiType = typeof api
