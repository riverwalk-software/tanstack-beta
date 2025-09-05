/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from "@effect/vitest"
import { Arbitrary } from "effect"
import { assert, property } from "effect/FastCheck"
import {
  _setThemeCookie,
  getThemeCookie,
  toggleThemeCookie,
} from "../../src/machines/themeCookieMachine"
import { ThemeSchema } from "../../src/types/Theme"

describe("themeCookieMachine", () => {
  it("consistency", () => {
    withCookie(theme => {
      expect(getThemeCookie()).toEqual(theme)
    })
  })

  describe("toggleThemeCookie", () => {
    it("involution", () => {
      withCookie(theme => {
        toggleThemeCookie()
        toggleThemeCookie()
        expect(getThemeCookie()).toEqual(theme)
      })
    })

    it("not a fixed point", () => {
      withCookie(theme => {
        toggleThemeCookie()
        expect(getThemeCookie()).not.toEqual(theme)
      })
    })
  })
})

const withCookie = (assertion: (theme: typeof ThemeSchema.Type) => void) =>
  assert(
    property(ThemeArbitrary, theme => {
      _setThemeCookie(theme)
      assertion(theme)
    }),
  )

const ThemeArbitrary = Arbitrary.make(ThemeSchema)
