import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  type BridgeAPI = {
    utils: {
      getAppVersion: () => Promise<string>
      logMessage: (mode: ErrorTypes, message: string) => void
      setPreventAppClose: (value: boolean) => void
      openOnBrowser: (url: string) => void
      selectFolderDialog: () => Promise<string>
    }
    appUpdater: {
      onUpdateAvailable: (callback) => void
      onUpdateDownloaded: (callback) => void
      updateAndRestart: () => void
    }
    configManager: {
      getConfig: () => Promise<ConfigType>
      saveConfig: (configJson: ConfigType) => Promise<boolean>
    }
    pathsManager: {
      getCurrentUserDataPath: () => Promise<string>
      formatPath: (parts: string[]) => Promise<string>
      deletePath: (path: string) => Promise<boolean>
      checkPathEmpty: (path: string) => Promise<boolean>
      checkPathExists: (path: string) => Promise<boolean>
      openPathOnFileExplorer: (path: string) => Promise<string>
    }
    gameVersionsManager: {
      downloadGameVersion: (gameVersion: GameVersionType, outputPath: string) => Promise<string>
      extractGameVersion: (filePath: string, outputPath: string) => Promise<boolean>
      onDownloadGameVersionProgress: (callback: ProgressCallback) => void
      onExtractGameVersionProgress: (callback: ProgressCallback) => void
      uninstallGameVersion: (gameVersion: InstalledGameVersionType) => Promise<boolean>
      lookForAGameVersion: (path: string) => Promise<{ exists: boolean; installedGameVersion: string | undefined }>
    }
    gameManager: {
      executeGame: (version: InstalledGameVersionType, installation: InstallationType) => Promise<boolean>
    }
  }

  interface Window {
    electron: ElectronAPI
    api: BridgeAPI
  }

  type ErrorTypes = "error" | "warn" | "info" | "debug" | "verbose"
}
