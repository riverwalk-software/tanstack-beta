import fc from "fast-check"

const isCi = process.env["CI"] === "true"
fc.configureGlobal({
  numRuns: isCi ? 5000 : 200,
})
