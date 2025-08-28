import { Schema } from "effect"
import { IntegerSchema } from "../integers/Integer"
import { NonZeroIntegerSchema } from "../integers/NonZeroInteger"

export class Rational extends Schema.Class<Rational>("Rational")({
  numerator: IntegerSchema,
  denominator: NonZeroIntegerSchema,
}) {}
