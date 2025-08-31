import { configureGlobal } from "effect/FastCheck"

const isCi = process.env["CI"] === "true"
const NUM_RUNS = {
  CI: 5000,
  DEV: 200,
} as const
configureGlobal({
  numRuns: isCi ? NUM_RUNS.CI : NUM_RUNS.DEV,
})
