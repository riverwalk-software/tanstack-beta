import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [],
	test: {
		setupFiles: [path.join(__dirname, "vitest.setup.ts")],
		include: ["./test/**/*.test.ts"],
		globals: true,
	},
	resolve: {
		alias: {
			"@template/basic/test": path.join(__dirname, "test"),
			"@template/basic": path.join(__dirname, "src"),
		},
	},
});

//   test: {
//     setupFiles: ["./vitest.setup.ts"],
//   },
//   plugins: [
//     tsConfigPaths({
//       projects: ["./tsconfig.json"],
//     }),
//   ],
// })
