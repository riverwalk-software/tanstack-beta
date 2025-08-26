/**
 * @vitest-environment node
 */
import * as fc from "fast-check"
import { describe, it } from "vitest"
import { toggleTheme } from "../../src/logic/themeLogic"
import { ThemeSchema } from "../../src/schemas/ThemeSchema"
import type { Theme } from "../../src/types/Theme"

// const ThemeArbitrary = ZodFastCheck().inputOf(ThemeSchema);
const ThemeArbitrary = fc.constantFrom<Theme>("dark", "light")

describe("toggleTheme", () => {
  it("Theme => Theme", () => {
    fc.assert(
      fc.property(ThemeArbitrary, theme => {
        const result = toggleTheme(theme)
        ThemeSchema.parse(result)
      }),
    )
  })
})
