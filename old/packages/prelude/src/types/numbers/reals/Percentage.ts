import { Brand, Schema } from "effect"
import type { Real } from "./Real"

export type Percentage = Real & Brand.Brand<"Percentage">
export const Percentage = Brand.nominal<Percentage>()
export const PercentageSchema = Schema.Number.pipe(Schema.fromBrand(Percentage))
