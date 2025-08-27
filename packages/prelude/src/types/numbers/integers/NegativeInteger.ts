import type z from "zod"
import { IntegerSchema } from "./Integer"

export const NegativeIntegerSchema =
  IntegerSchema.negative().brand("NegativeInteger")
export type NegativeInteger = z.infer<typeof NegativeIntegerSchema>
