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

  type InstalledModType = {
    modid: number
    releaseid: number
    filename: string
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

  type NotificationType = {
    id: number
    title: string
    body: string
    type: "success" | "error" | "info"
    onClick?: () => void
  }

  type ProgressCallback = {
    (event: Electron.IpcRendererEvent, progress: number): void
  }

  type LangFileType = {
    [key: string]: string
  }
}

export {}
