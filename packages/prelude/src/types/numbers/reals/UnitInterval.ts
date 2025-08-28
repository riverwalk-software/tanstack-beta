import Effect, { Brand, Schema } from "effect"
import type { Real } from "./Real"

export type UnitInterval = Real & Brand.Brand<"UnitInterval">
export const UnitInterval = Brand.refined<UnitInterval>(
  Effect.Number.between({
    minimum: 0,
    maximum: 1,
  }),
  n => Brand.error(`Expected ${n} to be a Real in the interval [0, 100]`),
)
export const UnitIntervalSchema = Schema.Number.pipe(
  Schema.fromBrand(UnitInterval),
)

// export const SCALE = 100 as const
// export const unitIntervalBoundedPercentageBijection: Bijection<
//   UnitInterval,
//   BoundedPercentage
// > = {
//   to: unitInterval => {
//     const product = multiply(unitInterval)(SCALE)
//     return Schema.decodeSync(BoundedPercentage)(product)
//   },
//   from: boundedPercentage => {
//     const divisor = Schema.decodeSync(NonZeroReal)(SCALE)
//     const quotient = divide(boundedPercentage)(divisor)
//     return Schema.decodeSync(UnitInterval)(quotient)
//   },
// }
