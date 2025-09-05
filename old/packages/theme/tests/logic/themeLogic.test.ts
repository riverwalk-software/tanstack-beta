/**
 * @vitest-environment node
 */

import { describe, expect, it } from "@effect/vitest"
import { Arbitrary, pipe, Schema } from "effect"
import * as fc from "effect/FastCheck"
import { toggleTheme } from "../../src/logic/themeLogic"
import { ThemeSchema } from "../../src/types/Theme"

export const testPurity =
  <A, B>(f: (a: A) => B) =>
  (name: string) =>
  (arbitrary: fc.Arbitrary<A>) =>
  (schema: Schema.Schema<A>) => {
    return describe(name, () => {
      describe("purity", () => {
        it("totality", () => {
          fc.assert(
            fc.property(arbitrary, x => {
              pipe(x, f, Schema.decodeUnknownSync(schema))
            }),
          )
        })

        it("determinism", () => {
          fc.assert(
            fc.property(arbitrary, x => {
              expect(f(x)).toEqual(f(x))
            }),
          )
        })
      })
    })
  }

const ThemeArbitrary = Arbitrary.make(ThemeSchema)
testPurity(toggleTheme)("toggleTheme")(ThemeArbitrary)(ThemeSchema)

// describe("toggleTheme", () => {
//   describe("purity", () => {
//     it("totality", () => {
//       fc.assert(
//         fc.property(ThemeArbitrary, theme => {
//           pipe(theme, toggleTheme, Schema.decodeSync(ThemeSchema))
//         }),
//       )
//     })

//     it("determinism", () => {
//       fc.assert(
//         fc.property(ThemeArbitrary, theme => {
//           expect(toggleTheme(theme)).toEqual(toggleTheme(theme))
//         }),
//       )
//     })
//   })
// })
