/**
 * @vitest-environment node
 */

import { Arbitrary, Schema } from "effect"
import { assert, property } from "effect/FastCheck"
import { describe, it } from "vitest"
import { proportionOf } from "../../../../../src/types/numbers/reals/BoundedPercentage"

describe("proportionOf", () => {
  describe("purity", () => {
    it("totality", () => {
      assert(
        property(NonEmptyListArbitrary, ([head, ...tail]) => {
          console.log(head)
          proportionOf(() => true)([1, ...[2]])
          // pipe(
          //   [head, ...tail],
          //   proportionOf(b => b),
          // )
        }),
      )
    })

    // it("determinism", () => {
    //   assert(
    //     property(NonEmptyListArbitrary, ([head, ...tail]) => {
    //       const f = pipe(
    //         [head, ...tail],
    //         proportionOf(b => b),
    //       )
    //       expect(f).toEqual(f)
    //     }),
    //   )
    // })
  })
})

const NonEmptyListArbitrary = Arbitrary.make(
  Schema.NonEmptyArray(Schema.Boolean),
)

// const predAndXsAny: fc.Arbitrary<{
//   p: (x: unknown) => boolean
//   xs: List<unknown>
// }> = fc.record({
//   p: fc.func(fc.boolean()) as fc.Arbitrary<(a: unknown) => boolean>,
//   xs: fc.array(fc.anything(), { minLength: 1 }),
// })

// describe("proportionOf", () => {
//   describe("purity", () => {
//     it("totality", () => {
//       fc.assert(
//         fc.property(predAndXsAny, ({ p, xs }) => {
//           const maybeXs = makeNonEmptyList(xs)
//           const result = mapOption(proportionOf(p))(maybeXs)
//           match(result)
//             .with({ _tag: "None" }, () => new Error(""))
//             .otherwise(({ value }) => BoundedPercentageSchema.parse(value))
//           expect(isSome(result)).toEqual(true)
//         }),
//       )
//     })

//     it("determinism", () => {
//       fc.assert(
//         fc.property(predAndXsAny, ({ p, xs }) => {
//           const maybeXs = makeNonEmptyList(xs)
//           const result = mapOption(proportionOf(p))(maybeXs)
//           const result2 = mapOption(proportionOf(p))(maybeXs)
//           expect(result).toEqual(result2)
//         }),
//       )
//     })
//   })
// })
