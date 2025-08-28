/**
 * @vitest-environment node
 */
import fc from "fast-check"
import { match } from "ts-pattern"
import { describe, expect, it } from "vitest"
import { mapOption } from "../../../../../src/typeclasses/functors/Functor"
import type { List } from "../../../../../src/types/lists/list"
import { makeNonEmptyList } from "../../../../../src/types/lists/nonEmptyList"
import {
  BoundedPercentageSchema,
  proportionOf,
} from "../../../../../src/types/numbers/reals/BoundedPercentage"
import { isSome } from "../../../../../src/types/Option"

const predAndXsAny: fc.Arbitrary<{
  p: (x: unknown) => boolean
  xs: List<unknown>
}> = fc.record({
  p: fc.func(fc.boolean()) as fc.Arbitrary<(a: unknown) => boolean>,
  xs: fc.array(fc.anything(), { minLength: 1 }),
})

describe("proportionOf", () => {
  describe("purity", () => {
    it("totality", () => {
      fc.assert(
        fc.property(predAndXsAny, ({ p, xs }) => {
          const maybeXs = makeNonEmptyList(xs)
          const result = mapOption(proportionOf(p))(maybeXs)
          match(result)
            .with({ _tag: "None" }, () => new Error(""))
            .otherwise(({ value }) => BoundedPercentageSchema.parse(value))
          expect(isSome(result)).toEqual(true)
        }),
      )
    })

    it("determinism", () => {
      fc.assert(
        fc.property(predAndXsAny, ({ p, xs }) => {
          const maybeXs = makeNonEmptyList(xs)
          const result = mapOption(proportionOf(p))(maybeXs)
          const result2 = mapOption(proportionOf(p))(maybeXs)
          expect(result).toEqual(result2)
        }),
      )
    })
  })
})
