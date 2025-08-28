import { Brand, Schema } from "effect"
import { flow } from "../../../logic/combinators"
import { not } from "../../../typeclasses/lattices/BooleanLattice"
import { areEqual } from "../../../typeclasses/lattices/Eq"
import type { Real } from "./Real"

export type NonZeroReal = Real & Brand.Brand<"NonZeroReal">
export const NonZeroReal = Brand.refined<NonZeroReal>(
  flow(areEqual(0), not),
  n => Brand.error(`Expected ${n} to be a non-zero Real`),
)
export const NonZeroRealSchema = Schema.Number.pipe(
  Schema.fromBrand(NonZeroReal),
)
