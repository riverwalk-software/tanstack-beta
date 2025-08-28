/**
 * @vitest-environment node
 */
import * as fc from "fast-check"
import { describe, expect, it } from "vitest"
import { toggleTheme } from "../../src/logic/themeLogic"
import { ThemeSchema } from "../../src/schemas/ThemeSchema"
import type { Theme } from "../../src/types/Theme"

// const ThemeArbitrary = ZodFastCheck().inputOf(ThemeSchema);
const ThemeArbitrary = fc.constantFrom<Theme>("dark", "light")

describe("toggleTheme", () => {
  describe("purity", () => {
    it("totality", () => {
      fc.assert(
        fc.property(ThemeArbitrary, theme => {
          const result = toggleTheme(theme)
          ThemeSchema.parse(result)
        }),
      )
    })

    it("determinism", () => {
      fc.assert(
        fc.property(ThemeArbitrary, theme => {
          const result = toggleTheme(theme)
          const result2 = toggleTheme(theme)
          expect(result).toEqual(result2)
        }),
      )
    })
  })
})
