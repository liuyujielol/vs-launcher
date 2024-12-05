import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      testLocalApi: (testData: string) => Promise<{ directory: string; files: string[]; test: string }>
      getConfig: () => Promise<ConfigType>
      saveConfig: (configJson: ConfigType) => Promise<boolean>
    }
  }
}
