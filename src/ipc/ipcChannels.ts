export const IPC_CHANNELS = {
  UTILS: {
    GET_APP_VERSION: "get-app-version",
    LOG_MESSAGE: "log-message",
    SET_PREVENT_APP_CLOSE: "set-prevent-app-close",
    OPEN_ON_BROWSER: "open-on-browser",
    SELECT_FOLDER_DIALOG: "select-folder-dialog"
  },
  APP_UPDATER: {
    UPDATE_AVAILABLE: "update-available",
    UPDATE_DOWNLOADED: "update-downloaded"
  },
  CONFIG_MANAGER: {
    GET_CONFIG: "get-config",
    SAVE_CONFIG: "save-config"
  },
  PATHS_MANAGER: {
    GET_CURRENT_USER_DATA_PATH: "get-current-user-data-path",
    DELETE_PATH: "delete-path",
    FORMAT_PATH: "format-path",
    CHECK_PATH_EMPTY: "check-empty-path",
    CHECK_PATH_EXISTS: "check-path-exists",
    OPEN_PATH_ON_FILE_EXPLORER: "open-path-on-file-explorer"
  },
  GAME_VERSIONS_MANAGER: {
    DOWNLOAD_GAME_VERSION: "download-game-version",
    EXTRACT_GAME_VERSION: "extract-game-version",
    DOWNLOAD_GAME_VERSION_PROGRESS: "download-game-version-progress",
    EXTRACT_GAME_VERSION_PROGRESS: "extract-game-version-progress",
    UNINSTALL_GAME_VERSION: "uninstall-game-version",
    LOOK_FOR_A_GAME_VERSION: "look-for-a-game-version"
  },
  GAME_MANAGER: {
    EXECUTE_GAME: "execute-game"
  }
}
