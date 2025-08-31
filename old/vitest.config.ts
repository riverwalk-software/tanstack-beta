import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

// biome-ignore lint/style/noDefaultExport: Config file
export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
})
