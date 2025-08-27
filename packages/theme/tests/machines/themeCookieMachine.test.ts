/**
 * @vitest-environment node
 */
import fc from "fast-check"

import { describe, expect, it } from "vitest"
import {
  _setThemeCookie,
  getThemeCookie,
  toggleThemeCookie,
} from "../../src/machines/themeCookieMachine"
import type { Theme } from "../../src/types/Theme"

const ThemeArbitrary = fc.constantFrom<Theme>("dark", "light")

describe("themeCookieMachine", () => {
  // let value: Theme

  // beforeEach(() => {
  //   value = fc.sample(ThemeArbitrary, 1)[0]!
  // })

  it("consistency", () => {
    fc.assert(
      fc.property(ThemeArbitrary, theme => {
        _setThemeCookie(theme)
        expect(getThemeCookie()).toEqual(theme)
      }),
    )
  })

  it("involution", () => {
    fc.assert(
      fc.property(ThemeArbitrary, theme => {
        _setThemeCookie(theme)
        toggleThemeCookie()
        toggleThemeCookie()
        expect(getThemeCookie()).toEqual(theme)
      }),
    )
  })

  it("not a fixed point", () => {
    fc.assert(
      fc.property(ThemeArbitrary, theme => {
        _setThemeCookie(theme)
        toggleThemeCookie()
        expect(getThemeCookie()).not.toEqual(theme)
      }),
    )
  })
})
