import { defineConfig, type UserConfig } from "tsdown"

const config: UserConfig = defineConfig({
  entry: "./src/index.ts",
  platform: "browser",
  unbundle: true,
  treeshake: false,
  minify: false,
})
export default config
