import { app } from "electron"
import fs from "fs"
import { join } from "path"
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
    const path = join(app.getPath("userData"), "config.json")
    try {
      fs.writeFileSync(path, JSON.stringify(this, null, 2))
      logMessage("info", `Config saved at ${path}`)
      return true
    } catch (err) {
      logMessage("error", `Error saving config at ${path}`)
      return false
    }
  }

  static getConfig(): Config {
    const path = join(app.getPath("userData"), "config.json")
    if (!fs.existsSync(path)) {
      const newConfig = new Config(defaultConfig)
      newConfig.saveConfig()
      return newConfig
    }
    const newConfig = new Config(JSON.parse(fs.readFileSync(path, "utf-8")))
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
