import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  type ConfigType = {
    version: number
    installations: InstallationType[]
    gameVersions: InstalledGameVersionType[]
  }

  type InstalledGameVersionType = {
    version: string
    path: string
  }

  type ModsType = {
    id: string
    name: string
    version: string
    path: string
  }

  type InstallationType = {
    id: string
    name: string
    path: string
    version: string
    mods: ModsType[]
  }

  type GameVersionType = {
    version: string
    windows: string
    linux: string
    macos: string
  }

  type ProgressCallback = {
    (event: Electron.IpcRendererEvent, progress: number): void
  }

  type LocalAPI = {
    selectFolderDialog: () => Promise<string>
    getConfig: () => Promise<ConfigType>
    saveConfig: (configJson: ConfigType) => Promise<boolean>
    getCurrentUserDataPath: () => Promise<string>
    downloadGameVersion: (gameVersion: GameVersionType, outputPath: string) => Promise<string>
    extractGameVersion: (filePath: string, outputPath: string) => Promise<boolean>
    onDownloadGameVersionProgress: (callback: ProgressCallback) => void
    onExtractGameVersionProgress: (callback: ProgressCallback) => void
  }

  interface Window {
    electron: ElectronAPI
    api: LocalAPI
  }
}

export {}
