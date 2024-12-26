import { app } from "electron"
import fse from "fs-extra"
import { join } from "path"
import { logMessage } from "@src/utils/logManager"

const defaultConfig: ConfigType = {
  version: 1,
  installations: [],
  gameVersions: []
}

let configPath: string

export async function saveConfig(config: ConfigType): Promise<boolean> {
  try {
    await fse.writeJSON(configPath, config)
    logMessage("info", `[config] Config saved at ${configPath}`)
    return true
  } catch (err) {
    logMessage("error", `[config] Error saving config at ${configPath}: ${err}`)
    return false
  }
}

export async function getConfig(): Promise<ConfigType> {
  try {
    if (!(await ensureConfig())) return defaultConfig
    return await fse.readJSON(configPath, "utf-8")
  } catch (err) {
    logMessage("error", `[config] Error getting config at ${configPath}. Using default config.`)
    await saveConfig(defaultConfig)
    return defaultConfig
  }
}

export async function ensureConfig(): Promise<boolean> {
  configPath = join(app.getPath("userData"), "config.json")
  try {
    if (!(await fse.pathExists(configPath))) {
      logMessage("info", `[config] Config not found at ${configPath}. Creating default config.`)
      return await saveConfig(defaultConfig)
    }
    logMessage("info", `[config] Config found at ${configPath}`)
    return true
  } catch (err) {
    logMessage("error", `[config] Error ensuring config at ${configPath}: ${err}`)
    return false
  }
}
