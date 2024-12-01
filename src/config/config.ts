import { app } from "electron"
import fs from "fs"
import logger from "electron-log"
import defaultConfig from "./defaultConfig.json"

export const PATH = `${app.getPath("userData")}\\config.json`

export class Config {
  public version: number

  constructor(config: { version: number }) {
    this.version = config.version || defaultConfig.version
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
}
