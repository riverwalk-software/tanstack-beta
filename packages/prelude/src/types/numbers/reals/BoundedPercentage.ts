import type z from "zod"
import { pipe } from "../../../logic/combinators"
import { size } from "../../../typeclasses/functors/Foldable"
import { count } from "../../../typeclasses/functors/MonadAlternative"
import { divide } from "../../../typeclasses/rings/Field"
import type { NonEmptyList } from "../../lists/nonEmptyList"
import { NonZeroRealSchema } from "./NonZeroReal"
import { PercentageSchema } from "./Percentage"
import {
  UnitIntervalSchema,
  unitIntervalBoundedPercentageBijection,
} from "./UnitInterval"

export const BoundedPercentageSchema = PercentageSchema.min(0)
  .max(100)
  .brand("BoundedPercentage")
export type BoundedPercentage = z.infer<typeof BoundedPercentageSchema>

export const proportionOf =
  <A>(p: (a: A) => boolean) =>
  (xs: NonEmptyList<A>): BoundedPercentage => {
    const part = count(p)(xs)
    const whole = pipe(xs, size, NonZeroRealSchema.parse)
    const quotient = pipe(divide(part)(whole), UnitIntervalSchema.parse)
    return unitIntervalBoundedPercentageBijection.to(quotient)
  }
