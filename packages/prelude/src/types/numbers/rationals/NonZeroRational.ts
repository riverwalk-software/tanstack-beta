import { Schema } from "effect"
import { NonZeroIntegerSchema } from "../integers/NonZeroInteger"

export class NonZeroRational extends Schema.Class<NonZeroRational>(
  "NonZeroRational",
)({
  numerator: NonZeroIntegerSchema,
  denominator: NonZeroIntegerSchema,
}) {}
