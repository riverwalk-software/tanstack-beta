import { Brand, flow, Schema } from "effect"
import { not } from "../../../typeclasses/lattices/BooleanLattice"
import { areEqual } from "../../../typeclasses/lattices/Eq"
import type { Real } from "../reals/Real"
import { Integer } from "./Integer"

type _NonZeroInteger = Real & Brand.Brand<"NonZeroInteger">
const _NonZeroInteger = Brand.refined<_NonZeroInteger>(
  flow(areEqual(0), not),
  n => Brand.error(`Expected ${n} to be a non-zero Integer`),
)
export const NonZeroInteger = Brand.all(_NonZeroInteger, Integer)
export type NonZeroInteger = Brand.Brand.FromConstructor<typeof NonZeroInteger>
export const NonZeroIntegerSchema = Schema.Number.pipe(
  Schema.fromBrand(NonZeroInteger),
)
