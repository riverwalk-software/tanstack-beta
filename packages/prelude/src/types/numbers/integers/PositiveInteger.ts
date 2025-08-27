import type z from "zod"
import { IntegerSchema } from "./Integer"

export const PositiveIntegerSchema =
  IntegerSchema.positive().brand("PositiveInteger")
export type PositiveInteger = z.infer<typeof PositiveIntegerSchema>
