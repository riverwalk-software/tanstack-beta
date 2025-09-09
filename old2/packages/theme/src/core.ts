import { Schema } from "effect"

const Theme = Schema.Literal("dark", "light").pipe(Schema.brand("Theme"))
type Theme = typeof Theme.Type

export { Theme }
