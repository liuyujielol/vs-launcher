import { ipcMain } from "electron"
import { IPC_CHANNELS } from "./index"

import { getConfig, saveConfig } from "@src/config/configManager"

export function configHandlerRegisterIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.CONFIG_MANAGER.GET_CONFIG, async (): Promise<ConfigType> => {
    return await getConfig()
  })

  ipcMain.handle(IPC_CHANNELS.CONFIG_MANAGER.SAVE_CONFIG, async (_event, config: ConfigType) => {
    return await saveConfig(config)
  })
}
