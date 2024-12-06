import { app } from "electron"
import fs from "fs"
import logger from "electron-log"

export const PATH = `${app.getPath("userData")}\\config.json`

const defaultConfig: ConfigType = {
  version: 1,
  installations: [],
  gameVersions: []
}

export class Config {
  private version: number
  private installations: InstallationType[]
  private gameVersions: InstalledGameVersionType[]

  constructor(config: ConfigType) {
    this.version = config.version || defaultConfig.version
    this.installations = config.installations || defaultConfig.installations
    this.gameVersions = config.gameVersions || defaultConfig.gameVersions
  }

  saveConfig(): boolean {
    try {
      fs.writeFileSync(PATH, JSON.stringify(this, null, 2))
      logger.info(`Config saved at ${PATH}`)
      return true
    } catch (err) {
      logger.error(err)
      return false
    }
  }

  static getConfig(): Config {
    if (!fs.existsSync(PATH)) {
      const newConfig = new Config(defaultConfig)
      newConfig.saveConfig()
      return newConfig
    }
    const newConfig = new Config(JSON.parse(fs.readFileSync(PATH, "utf-8")))
    return newConfig
  }

  toJSON(): ConfigType {
    return {
      version: this.version,
      installations: this.installations,
      gameVersions: this.gameVersions
    }
  }
}
