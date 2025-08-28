import Effect, { Brand } from "effect"
import { NonZeroReal } from "./NonZeroReal"
import type { Real } from "./Real"

type _PositiveReal = Real & Brand.Brand<"PositiveReal">
const _PositiveReal = Brand.refined<_PositiveReal>(
  Effect.Number.greaterThan(0),
  n => Brand.error(`Expected ${n} to be a positive real number`),
)
export const PositiveReal = Brand.all(_PositiveReal, NonZeroReal)
export type PositiveReal = Brand.Brand.FromConstructor<typeof PositiveReal>
