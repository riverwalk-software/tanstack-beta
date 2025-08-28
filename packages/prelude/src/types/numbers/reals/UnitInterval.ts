import Effect, { Brand, flow, Schema } from "effect"
import { swap } from "../../../logic/combinators"
import type { Bijection } from "../../../typeclasses/functions/Bijection"
import { realDivide } from "../../../typeclasses/rings/Field"
import { multiply } from "../../../typeclasses/rings/Semiring"
import {
  type BoundedPercentage,
  BoundedPercentageSchema,
} from "./BoundedPercentage"
import { NonZeroReal } from "./NonZeroReal"
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

export const SCALE = NonZeroReal(100)
export const unitIntervalBoundedPercentageBijection: Bijection<
  UnitInterval,
  BoundedPercentage
> = {
  to: flow(multiply(SCALE), Schema.decodeSync(BoundedPercentageSchema)),
  from: flow(swap(realDivide)(SCALE), Schema.decodeSync(UnitIntervalSchema)),
}
