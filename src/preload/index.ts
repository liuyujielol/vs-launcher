import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

// Custom APIs for renderer
const api: LocalAPI = {
  selectFolderDialog: (): Promise<string> => ipcRenderer.invoke("select-folder-dialog"),
  getConfig: (): Promise<ConfigType> => ipcRenderer.invoke("get-config"),
  saveConfig: (configJson: ConfigType): Promise<boolean> => ipcRenderer.invoke("save-config", configJson),
  getCurrentUserDataPath: (): Promise<string> => ipcRenderer.invoke("get-current-user-data-path"),
  downloadGameVersion: (gameVersion: GameVersionType, outputPath: string): Promise<string> => ipcRenderer.invoke("download-game-version", gameVersion, outputPath),
  extractGameVersion: (filePath: string, outputPath: string): Promise<boolean> => ipcRenderer.invoke("extract-game-version", filePath, outputPath),
  onDownloadGameVersionProgress: (callback: ProgressCallback) => ipcRenderer.on("download-game-version-progress", callback),
  onExtractGameVersionProgress: (callback: ProgressCallback) => ipcRenderer.on("extract-game-version-progress", callback)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type ApiType = typeof api
