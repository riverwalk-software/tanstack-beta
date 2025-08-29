/**
 * @vitest-environment node
 */

import { Arbitrary, pipe, Schema } from "effect"
import { assert, property } from "effect/FastCheck"
import { describe, expect, it } from "vitest"
import { toggleTheme } from "../../src/logic/themeLogic"
import { ThemeSchema } from "../../src/types/Theme"

describe("toggleTheme", () => {
  describe("purity", () => {
    it("totality", () => {
      assert(
        property(ThemeArbitrary, theme => {
          pipe(theme, toggleTheme, Schema.decodeSync(ThemeSchema))
        }),
      )
    })

    it("determinism", () => {
      assert(
        property(ThemeArbitrary, theme => {
          expect(toggleTheme(theme)).toEqual(toggleTheme(theme))
        }),
      )
    })
  })
})

const ThemeArbitrary = Arbitrary.make(ThemeSchema)
