import { Brand, Schema } from "effect"
import type { Real } from "../reals/Real"

export type Integer = Real & Brand.Brand<"Integer">
export const Integer = Brand.refined<Integer>(Number.isSafeInteger, n =>
  Brand.error(`Expected ${n} to be a Real restricted to safe integers`),
)
export const IntegerSchema = Schema.Number.pipe(Schema.fromBrand(Integer))
