declare global {
  type ConfigType = {
    version: number
    installations: InstallationType[]
  }

  type InstallationType = {
    id: string
    name: string
    path: string
    version: string
    mods: ModsType[]
  }

  type ModsType = {
    id: string
    name: string
    version: string
    path: string
  }

  type GameVersionType = {
    version: string
    windows: string
    linux: string
    macos: string
  }
}

export {}
