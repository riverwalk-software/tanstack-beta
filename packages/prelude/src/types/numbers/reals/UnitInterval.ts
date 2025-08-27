import type z from "zod"
import type { Bijection } from "../../../typeclasses/functions/Bijection"
import { divide } from "../../../typeclasses/rings/Field"
import { multiply } from "../../../typeclasses/rings/Semiring"
import {
  type BoundedPercentage,
  BoundedPercentageSchema,
} from "./BoundedPercentage"
import { NonZeroRealSchema } from "./NonZeroReal"
import { RealSchema } from "./Real"

export const UnitIntervalSchema = RealSchema.min(0).max(1).brand("UnitInterval")
export type UnitInterval = z.infer<typeof UnitIntervalSchema>

export const SCALE = 100 as const
export const unitIntervalBoundedPercentageBijection: Bijection<
  UnitInterval,
  BoundedPercentage
> = {
  to: unitInterval => {
    const product = multiply(unitInterval)(SCALE)
    return BoundedPercentageSchema.parse(product)
  },
  from: boundedPercentage => {
    const divisor = NonZeroRealSchema.parse(SCALE)
    const quotient = divide(boundedPercentage)(divisor)
    return UnitIntervalSchema.parse(quotient)
  },
}
