import { ipcMain } from "electron"
import { Config } from "@config/config"

ipcMain.handle("get-config", (): ConfigType => {
  const config = Config.getConfig()
  return config.toJSON()
})

ipcMain.handle("save-config", (_event, configJson: ConfigType) => {
  return new Config(configJson).saveConfig()
})
