import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections"
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers"
import mdx from "@mdx-js/rollup"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { pluginFullscreen } from "expressive-code-fullscreen"
import rehypeExpressiveCode, {
  type RehypeExpressiveCodeOptions,
} from "rehype-expressive-code"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

const rehypeExpressiveCodeOptions: RehypeExpressiveCodeOptions = {
  themes: ["github-light-default", "github-dark-default"],
  customizeTheme: theme => {
    theme.name = theme.name === "github-light-default" ? "light" : "dark"
    return theme
  },
  useDarkModeMediaQuery: false,
  defaultProps: {
    wrap: false,
    overridesByLang: {
      shell: {
        preserveIndent: false,
        showLineNumbers: false,
      },
    },
  },
  frames: {
    extractFileNameFromCode: false,
  },
  plugins: [
    pluginLineNumbers(),
    pluginCollapsibleSections(),
    pluginFullscreen(),
  ],
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          // rehypeMermaid, // Must come before rehypeExpressiveCode
          rehypeKatex, // Must come before rehypeExpressiveCode
          [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
        ],
      }),
    },
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      target: "cloudflare-module",
      customViteReactPlugin: true,
    }),
    viteReact({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
})
