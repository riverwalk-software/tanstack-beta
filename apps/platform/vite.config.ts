import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// const watchedDists = [
//   path.resolve(__dirname, "../../packages/platform-authentication/dist"),
//   path.resolve(__dirname, "../../packages/platform-theme/dist"),
//   path.resolve(__dirname, "../../packages/platform-ui/dist"),
//   path.resolve(__dirname, "../../packages/prologue/dist"),
//   path.resolve(__dirname, "../../packages/shared-constants/dist"),
// ]

export default defineConfig({
  plugins: [
    devtools(), // Must come first
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
      target: "cloudflare-module",
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    // {
    //   name: "reload-on-local-dist-change",
    //   apply: "serve",
    //   configureServer(server) {
    //     server.watcher.add(watchedDists)
    //     server.watcher.on("all", (_event, _path) => {
    //       server.ws.send({ type: "full-reload" })
    //     })
    //   },
    // },
  ],
  server: {
    port: 3000,
  },
  // test: {
  //   setupFiles: ["./vitest.setup.ts"],
  // },
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
