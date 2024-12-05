import { app } from "electron"
import fs from "fs"
import logger from "electron-log"
import defaultConfig from "./defaultConfig.json"

export const PATH = `${app.getPath("userData")}\\config.json`

export class Config {
  public version: number
  public installations: InstallationType[]

  constructor(config: ConfigType) {
    this.version = config.version || defaultConfig.version
    this.installations = config.installations || defaultConfig.installations
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
      installations: this.installations
    }
  }
}
