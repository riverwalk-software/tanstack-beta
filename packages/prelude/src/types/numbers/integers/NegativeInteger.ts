import * as Effect from "effect"
import { Brand, Schema } from "effect"

import type { Real } from "../reals/Real"
import { Integer } from "./Integer"

type _NegativeInteger = Real & Brand.Brand<"NegativeInteger">
const _NegativeInteger = Brand.refined<_NegativeInteger>(
  Effect.Number.lessThan(0),
  n => Brand.error(`Expected ${n} to be a negative Integer`),
)
export const NegativeInteger = Brand.all(_NegativeInteger, Integer)
export type NegativeInteger = Brand.Brand.FromConstructor<
  typeof NegativeInteger
>
export const NegativeIntegerSchema = Schema.Number.pipe(
  Schema.fromBrand(NegativeInteger),
)
