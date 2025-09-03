import { Schema } from "effect"

const NonEmptyString = Schema.NonEmptyString.pipe(
  Schema.brand("NonEmptyString"),
)
type NonEmptyString = typeof NonEmptyString.Type

export { NonEmptyString }
