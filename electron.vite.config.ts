import { resolve } from "path"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { "@src": resolve(__dirname, "src/src") } }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { "@src": resolve(__dirname, "src/src") } }
  },
  renderer: {
    server: {
      proxy: {
        "/moddbapi": {
          target: "https://mods.vintagestory.at/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/moddbapi/, "")
        }
      }
    },
    build: {
      rollupOptions: {
        external: ["*.json"]
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve(__dirname, "src/renderer/src")
      }
    },
    plugins: [react()]
  }
})
