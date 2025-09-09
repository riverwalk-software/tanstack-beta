import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    devtools(), // Must come first
    tsConfigPaths(),
    tanstackStart({
      customViteReactPlugin: true,
      target: "cloudflare-module",
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
})
// const rehypeExpressiveCodeOptions: RehypeExpressiveCodeOptions = {
//   themes: ["github-light-default", "github-dark-default"],
//   customizeTheme: theme => {
//     theme.name = theme.name === "github-light-default" ? "light" : "dark"
//     return theme
//   },
//   useDarkModeMediaQuery: false,
//   defaultProps: {
//     wrap: false,
//     overridesByLang: {
//       shell: {
//         preserveIndent: false,
//         showLineNumbers: false,
//       },
//     },
//   },
//   frames: {
//     extractFileNameFromCode: false,
//   },
//   plugins: [
//     pluginLineNumbers(),
//     pluginCollapsibleSections(),
//     pluginFullscreen(),
//   ],
// }

// export default defineConfig({
//   plugins: [
// {
//   enforce: "pre",
//   ...mdx({
//     remarkPlugins: [remarkGfm, remarkMath],
//     rehypePlugins: [
//       // rehypeMermaid, // Must come before rehypeExpressiveCode
//       rehypeKatex, // Must come before rehypeExpressiveCode
//       [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
//     ],
//   }),
// },
// tanstackStart({
//   target: "cloudflare-module",
//   customViteReactPlugin: true,
// }),
// viteReact({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
//   ],
// })
