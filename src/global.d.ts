declare global {
  type ConfigType = {
    version: number
    installations: InstallationType[]
    gameVersions: InstalledGameVersionType[]
  }

  type InstalledGameVersionType = {
    version: string
    path: string
    installed: boolean
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
  }

  declare module "*.png" {
    const value: string
    export default value
  }
}

export {}
