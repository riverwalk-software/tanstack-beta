import Effect, { Brand, Schema } from "effect"
import { NonZeroReal } from "./NonZeroReal"
import type { Real } from "./Real"

type _NegativeReal = Real & Brand.Brand<"NegativeReal">
const _NegativeReal = Brand.refined<_NegativeReal>(
  Effect.Number.lessThan(0),
  n => Brand.error(`Expected ${n} to be a negative Real`),
)
export const NegativeReal = Brand.all(_NegativeReal, NonZeroReal)
export type NegativeReal = Brand.Brand.FromConstructor<typeof NegativeReal>
export const NegativeRealSchema = Schema.Number.pipe(
  Schema.fromBrand(NegativeReal),
)
