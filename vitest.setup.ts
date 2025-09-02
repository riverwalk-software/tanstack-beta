import { configureGlobal } from "effect/FastCheck"

const NUM_RUNS = {
  CI: 5000,
  DEV: 200,
} as const

const isCi = process.env["CI"] === "true"
configureGlobal({
  numRuns: isCi ? NUM_RUNS.CI : NUM_RUNS.DEV,
})
