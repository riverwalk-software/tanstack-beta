import * as Effect from "effect"
import { Brand, Schema } from "effect"
import type { Real } from "./Real"

export type UnitInterval = Real & Brand.Brand<"UnitInterval">
export const UnitInterval = Brand.refined<UnitInterval>(
  Effect.Number.between({
    minimum: 0,
    maximum: 1,
  }),
  n => Brand.error(`Expected ${n} to be a Real in the interval [0, 1]`),
)
export const UnitIntervalSchema = Schema.Number.pipe(
  Schema.fromBrand(UnitInterval),
)
