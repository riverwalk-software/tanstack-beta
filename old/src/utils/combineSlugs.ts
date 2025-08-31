import { intercalate } from "@prelude"
import { pipe } from "effect"

export const combineSlugs = (slugs: string[]): string =>
  pipe(slugs, intercalate("::"))
