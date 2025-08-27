/**
 * @vitest-environment node
 */
import fc from "fast-check"

import { describe, it } from "vitest"
import {
  type BoundedPercentage,
  BoundedPercentageSchema,
} from "../../../../../src/types/numbers/reals/BoundedPercentage"
import {
  type UnitInterval,
  UnitIntervalSchema,
  unitIntervalBoundedPercentageBijection,
} from "../../../../../src/types/numbers/reals/UnitInterval"

const UnitIntervalArbitrary = fc.double({ min: 0, max: 1, noNaN: true })
const BoundedPercentageArbitrary = fc.double({ min: 0, max: 100, noNaN: true })

describe("unitIntervalBoundedPercentageBijection", () => {
  it("to", () => {
    fc.assert(
      fc.property(UnitIntervalArbitrary, unitInterval => {
        const boundedPercentage = unitIntervalBoundedPercentageBijection.to(
          unitInterval as UnitInterval,
        )
        BoundedPercentageSchema.parse(boundedPercentage)
      }),
    )
  })
  it("from", () => {
    fc.assert(
      fc.property(BoundedPercentageArbitrary, boundedPercentage => {
        const unitInterval = unitIntervalBoundedPercentageBijection.from(
          boundedPercentage as BoundedPercentage,
        )
        UnitIntervalSchema.parse(unitInterval)
      }),
    )
  })
})
