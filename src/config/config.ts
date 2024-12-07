import { app } from "electron"
import fs from "fs"
import { logMessage } from "@utils/logMessage"

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
      fs.writeFileSync(`${app.getPath("userData")}\\config.json`, JSON.stringify(this, null, 2))
      logMessage("info", `Config saved at ${app.getPath("userData")}\\config.json`)
      return true
    } catch (err) {
      logMessage("error", `Error saving config at ${app.getPath("userData")}\\config.json`)
      return false
    }
  }

  static getConfig(): Config {
    if (!fs.existsSync(`${app.getPath("userData")}\\config.json`)) {
      const newConfig = new Config(defaultConfig)
      newConfig.saveConfig()
      return newConfig
    }
    const newConfig = new Config(JSON.parse(fs.readFileSync(`${app.getPath("userData")}\\config.json`, "utf-8")))
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
