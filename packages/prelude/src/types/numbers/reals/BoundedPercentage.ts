import Effect, { Brand, flow, pipe, Schema } from "effect"
import { ProgressSchema } from "packages/userStore/src/types/Progress"
import { swap } from "../../../logic/combinators"
import { size } from "../../../typeclasses/functors/Foldable"
import { count } from "../../../typeclasses/functors/MonadAlternative"
import { realDivide } from "../../../typeclasses/rings/Field"
import { multiply } from "../../../typeclasses/rings/Semiring"
import type { List } from "../../lists/list"
import { NonZeroReal, NonZeroRealSchema } from "./NonZeroReal"
import { Percentage } from "./Percentage"
import type { Real } from "./Real"
import { type UnitInterval, UnitIntervalSchema } from "./UnitInterval"

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

export const SCALE = NonZeroReal(100)
export const BoundedPercentageFromUnitIntervalSchema = Schema.transform(
  UnitIntervalSchema,
  BoundedPercentageSchema,
  {
    strict: true,
    decode: flow(multiply(SCALE), BoundedPercentageSchema.make),
    encode: flow(swap(realDivide)(SCALE), UnitIntervalSchema.make),
  },
)

// export const unitIntervalBoundedPercentageBijection: Bijection<
//   UnitInterval,
//   BoundedPercentage
// > = {
//   to: flow(multiply(SCALE), Schema.decodeSync(BoundedPercentageSchema)),
//   from: flow(swap(realDivide)(SCALE), Schema.decodeSync(UnitIntervalSchema)),
// }

export const conjugateBoundedPercentageFromUnitInterval = (
  f: (unitInterval: UnitInterval) => UnitInterval,
): ((boundedPercentage: BoundedPercentage) => BoundedPercentage) =>
  flow(
    Schema.encodeSync(BoundedPercentageFromUnitIntervalSchema),
    UnitIntervalSchema.make,
    f,
    Schema.decodeSync(BoundedPercentageFromUnitIntervalSchema),
  )

export const proportionOf =
  <A>(p: (a: A) => boolean) =>
  (xs: [A, ...List<A>]): BoundedPercentage => {
    const part = count(p)(xs)
    const whole = pipe(xs, size, Schema.decodeSync(NonZeroRealSchema))
    return pipe(
      realDivide(part)(whole),
      Schema.decodeSync(UnitIntervalSchema),
      Schema.decodeSync(BoundedPercentageFromUnitIntervalSchema),
      Schema.decodeSync(ProgressSchema),
    )
  }
