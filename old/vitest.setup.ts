import { configureGlobal } from "effect/FastCheck"

const isCi = process.env["CI"] === "true"
configureGlobal({
  numRuns: isCi ? 5000 : 200,
})
