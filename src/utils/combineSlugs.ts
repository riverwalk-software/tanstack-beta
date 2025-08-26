import { intercalate, pipe } from "@prelude"

export const combineSlugs = (slugs: string[]): string =>
  pipe(slugs, intercalate("::"))
