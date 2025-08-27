import z from "zod"
import { IntegerSchema } from "../integers/Integer"
import { NonZeroIntegerSchema } from "../integers/NonZeroInteger"

export const RationalSchema = z
  .object({
    numerator: IntegerSchema,
    denominator: NonZeroIntegerSchema,
  })
  .brand("Rational")
export type Rational = z.infer<typeof RationalSchema>
