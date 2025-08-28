import Effect, { Brand, Schema } from "effect"
import { Integer } from "../integers/Integer"
import type { Real } from "../reals/Real"

type _Natural = Real & Brand.Brand<"Natural">
const _Natural = Brand.refined<_Natural>(
  Effect.Number.greaterThanOrEqualTo(0),
  n => Brand.error(`Expected ${n} to be a non-negative Integer`),
)
export const Natural = Brand.all(_Natural, Integer)
export type Natural = Brand.Brand.FromConstructor<typeof Natural>
export const NaturalSchema = Schema.Number.pipe(Schema.fromBrand(Natural))
