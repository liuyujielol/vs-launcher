import React, { createContext, useReducer, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from "uuid"

import { useNotificationsContext } from "@renderer/contexts/NotificationsContext"

export type TaskType = "download" | "extract"

export type TaskStatusType = "pending" | "in-progress" | "completed" | "failed"

export interface Task {
  id: string
  name: string
  type: TaskType
  data: { url?: string; outputPath?: string; filePath?: string }
  progress: number
  status: TaskStatusType
}

export interface TaskState {
  tasks: Task[]
}

export enum ACTIONS {
  ADD_TASK = "ADD_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  REMOVE_TASK = "REMOVE_TASK"
}

export interface AddTaskAction {
  type: ACTIONS.ADD_TASK
  payload: Task
}

export interface UpdateTaskAction {
  type: ACTIONS.UPDATE_TASK
  payload: {
    id: string
    updates: Partial<Omit<Task, "id">>
  }
}

export interface RemoveTaskAction {
  type: ACTIONS.REMOVE_TASK
  payload: { id: string }
}

export type TaskAction = AddTaskAction | UpdateTaskAction | RemoveTaskAction

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] }

    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? { ...task, ...action.payload.updates } : task))
      }

    case ACTIONS.REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id)
      }

    default:
      return state
  }
}

export const initialState: TaskState = {
  tasks: []
}

export interface TaskContextType {
  state: TaskState
  startDownload(name: string, url: string, outputPath: string, onFinish: (status: boolean, path: string, error: Error | null) => void): Promise<void>
  startExtract(name: string, filePath: string, outputPath: string, onFinish: (status: boolean, error: Error | null) => void): Promise<void>
}

const TaskContext = createContext<TaskContextType | null>(null)

export const TaskProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { t } = useTranslation()
  const { addNotification } = useNotificationsContext()

  const [state, dispatch] = useReducer(taskReducer, initialState)

  useEffect(() => {
    window.api.utils.logMessage("info", `[component] [TaskManager] Adding listener for download progress`)
    window.api.pathsManager.onDownloadProgress((_event, id, progress) => {
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, updates: { progress, status: "in-progress" } } })
    })

    window.api.utils.logMessage("info", `[component] [TaskManager] Adding listener for extraction progress`)
    window.api.pathsManager.onExtractProgress((_event, id, progress) => {
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, updates: { progress, status: "in-progress" } } })
    })
  }, [])

  async function startDownload(name: string, url: string, outputPath: string, onFinish: (status: boolean, path: string, error: Error | null) => void): Promise<void> {
    const id = uuidv4()

    try {
      window.api.utils.logMessage("info", `[component] [TaskManager] [${id}] Starting download of ${url} to ${outputPath}.`)
      dispatch({ type: ACTIONS.ADD_TASK, payload: { id, name, type: "download", data: { url, outputPath }, progress: 0, status: "pending" } })

      window.api.utils.logMessage("info", `[component] [TaskManager] [${id}] Downloading ${url}...`)
      addNotification(t("notifications.titles.info"), t("notifications.body.downloading"), "info")
      const downloadedFile = await window.api.pathsManager.downloadOnPath(id, url, outputPath)

      window.api.utils.logMessage("info", `[component] [TaskManager] [${id}] Downloaded ${url} to ${downloadedFile}`)
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, updates: { status: "completed" } } })
      addNotification(t("notifications.titles.info"), t("notifications.body.downloaded"), "success")
      onFinish(true, downloadedFile, null)
    } catch (err) {
      window.api.utils.logMessage("error", `[component] [TaskManager] [${id}] Error downloading ${url}: ${err}`)
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, updates: { status: "failed" } } })
      addNotification(t("notifications.titles.info"), t("notifications.body.downloadError"), "error")
      onFinish(false, "", new Error(`Error downloading ${url}: ${err}`))
    }
  }

  async function startExtract(name: string, filePath: string, outputPath: string, onFinish: (status: boolean, error: Error | null) => void): Promise<void> {
    const id = uuidv4()

    try {
      window.api.utils.logMessage("info", `[component] [TaskManager] [${id}] Starting extraction of ${filePath} to ${outputPath}.`)
      dispatch({ type: ACTIONS.ADD_TASK, payload: { id, name, type: "extract", data: { filePath, outputPath }, progress: 0, status: "pending" } })

      window.api.utils.logMessage("info", `[component] [TaskManager] [${id}] Extracting ${filePath}...`)
      addNotification(t("notifications.titles.info"), t("notifications.body.extracting"), "info")
      const result = await window.api.pathsManager.extractOnPath(id, filePath, outputPath)

      if (!result) {
        throw new Error("Extraction failed")
      }

      window.api.utils.logMessage("info", `[component] [TaskManager] [${id}] Extracted ${filePath} to ${outputPath}`)
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, updates: { status: "completed" } } })
      addNotification(t("notifications.titles.info"), t("notifications.body.extracted"), "success")
      onFinish(true, null)
    } catch (err) {
      window.api.utils.logMessage("error", `[component] [TaskManager] [${id}] Error extracting ${filePath}: ${err}`)
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, updates: { status: "failed" } } })
      addNotification(t("notifications.titles.info"), t("notifications.body.extractError"), "error")
      onFinish(false, new Error(`Error extracting ${filePath}: ${err}`))
    }
  }

  return <TaskContext.Provider value={{ state, startDownload, startExtract }}>{children}</TaskContext.Provider>
}

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within an TaskProvider")
  }
  return context
}
