import { app } from "electron"

export function getGameVersionsRoute(): string {
  return `${app.getPath("appData")}\\VSLGameVersions`
}

export function getGameDataRoute(): string {
  return `${app.getPath("appData")}\\VSLGameData`
}
