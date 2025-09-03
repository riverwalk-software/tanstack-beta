import { Schema } from "effect"

const NonEmptyTrimmedString = Schema.NonEmptyTrimmedString.pipe(
  Schema.brand("NonEmptyTrimmedString"),
)
type NonEmptyTrimmedString = typeof NonEmptyTrimmedString.Type

export { NonEmptyTrimmedString }
