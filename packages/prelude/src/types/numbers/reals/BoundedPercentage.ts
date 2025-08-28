import Effect, { Brand, pipe, Schema } from "effect"
import { size } from "../../../typeclasses/functors/Foldable"
import { count } from "../../../typeclasses/functors/MonadAlternative"
import { realDivide } from "../../../typeclasses/rings/Field"
import type { NonEmptyList } from "../../lists/nonEmptyList"
import { NonZeroRealSchema } from "./NonZeroReal"
import { Percentage } from "./Percentage"
import type { Real } from "./Real"
import {
  UnitIntervalSchema,
  unitIntervalBoundedPercentageBijection,
} from "./UnitInterval"

type _BoundedPercentage = Real & Brand.Brand<"BoundedPercentage">
const _BoundedPercentage = Brand.refined<_BoundedPercentage>(
  Effect.Number.between({
    minimum: 0,
    maximum: 100,
  }),
  n => Brand.error(`Expected ${n} to be a Percentage in the interval [0, 100]`),
)
export const BoundedPercentage = Brand.all(_BoundedPercentage, Percentage)
export type BoundedPercentage = Brand.Brand.FromConstructor<
  typeof BoundedPercentage
>
export const BoundedPercentageSchema = Schema.Number.pipe(
  Schema.fromBrand(BoundedPercentage),
)

export const proportionOf =
  <A>(p: (a: A) => boolean) =>
  (xs: NonEmptyList<A>): BoundedPercentage => {
    const part = count(p)(xs)
    const whole = pipe(xs, size, Schema.decodeSync(NonZeroRealSchema))
    const quotient = pipe(
      realDivide(part)(whole),
      Schema.decodeSync(UnitIntervalSchema),
    )
    return unitIntervalBoundedPercentageBijection.to(quotient)
  }
