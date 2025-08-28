import Effect, { Brand, Schema } from "effect"
import { Percentage } from "./Percentage"
import type { Real } from "./Real"

type _BoundedPercentage = Real & Brand.Brand<"BoundedPercentage">
const _BoundedPercentage = Brand.refined<_BoundedPercentage>(
  Effect.Number.between({
    minimum: 0,
    maximum: 100,
  }),
  n =>
    Brand.error(
      `Expected ${n} to be a BoundedPercentage in the interval [0, 100]`,
    ),
)
export const BoundedPercentage = Brand.all(_BoundedPercentage, Percentage)
export type BoundedPercentage = Brand.Brand.FromConstructor<
  typeof BoundedPercentage
>
export const BoundedPercentageSchema = Schema.Number.pipe(
  Schema.fromBrand(BoundedPercentage),
)

// export const proportionOf =
//   <A>(p: (a: A) => boolean) =>
//   (xs: NonEmptyList<A>): BoundedPercentage => {
//     const part = count(p)(xs)
//     const whole = pipe(xs, size, Schema.decodeSync(NonZeroReal))
//     const quotient = pipe(divide(part)(whole), Schema.decodeSync(UnitInterval))
//     return unitIntervalBoundedPercentageBijection.to(quotient)
//   }
