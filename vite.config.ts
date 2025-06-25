import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import fs from "fs";
import gracefulFs from "graceful-fs";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

gracefulFs.gracefulify(fs);

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      target: "cloudflare-module",
    }),
  ],
  build: {
    // these options get passed to @rollup/plugin-commonjs
    commonjsOptions: {
      // keep this low enough to not blow the FD limit
      // since lucide publishes pure ESM, skip transforming it
      exclude: [
        /node_modules\/lucide-react\/.*/, // <— skip folder
        /node_modules\/@?lucide-react$/, // <— skip root import
      ],
      // when a package ships mixed ES/CJS, this helps avoid fallback reads
      transformMixedEsModules: true,
    },
  },
});
