import { Brand, Schema } from "effect"
import { BoundedPercentage } from "packages/prelude/src/types/numbers/reals/BoundedPercentage"
import type { Real } from "packages/prelude/src/types/numbers/reals/Real"

type _Progress = Real & Brand.Brand<"Progress">
const _Progress = Brand.nominal<_Progress>()
export const Progress = Brand.all(_Progress, BoundedPercentage)
export type Progress = Brand.Brand.FromConstructor<typeof Progress>
export const ProgressSchema = Schema.Number.pipe(Schema.fromBrand(Progress))
