import * as Effect from "effect"
import { Brand, Schema } from "effect"

import type { Real } from "../reals/Real"
import { Integer } from "./Integer"

type _PositiveInteger = Real & Brand.Brand<"PositiveInteger">
const _PositiveInteger = Brand.refined<_PositiveInteger>(
  Effect.Number.greaterThan(0),
  n => Brand.error(`Expected ${n} to be a positive Integer`),
)
export const PositiveInteger = Brand.all(_PositiveInteger, Integer)
export type PositiveInteger = Brand.Brand.FromConstructor<
  typeof PositiveInteger
>
export const PositiveIntegerSchema = Schema.Number.pipe(
  Schema.fromBrand(PositiveInteger),
)
