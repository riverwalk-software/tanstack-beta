import { flow, Schema } from "effect"

const ThemeBrand: unique symbol = Symbol.for("Theme")
export const ThemeSchema = Schema.Literal("dark", "light").pipe(
  Schema.brand(ThemeBrand),
)
export type Theme = typeof ThemeSchema.Type

export const ThemeFromBoolean = Schema.transform(Schema.Boolean, ThemeSchema, {
  strict: true,
  decode: bool => (bool ? "light" : "dark"),
  encode: theme => theme === "light",
})

export const conjugateThemeFromBoolean = (
  f: (b: boolean) => boolean,
): ((theme: Theme) => Theme) =>
  flow(
    Schema.encodeSync(ThemeFromBoolean),
    f,
    Schema.decodeSync(ThemeFromBoolean),
  )
