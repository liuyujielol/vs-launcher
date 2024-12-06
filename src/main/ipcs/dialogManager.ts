const { ipcMain, dialog } = require("electron")

ipcMain.handle("select-folder-dialog", async () => {
  const result = await dialog.showOpenDialog({
    title: "Selecciona una carpeta",
    properties: ["openDirectory"]
  })

  if (result.canceled) return null

  return result.filePaths[0]
})
