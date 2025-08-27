import type z from "zod"
import { IntegerSchema } from "./Integer"

export const NonZeroIntegerSchema = IntegerSchema.refine(n => n !== 0, {
  message: "Number must be a non-zero integer",
}).brand("NonZeroInteger")
export type NonZeroInteger = z.infer<typeof NonZeroIntegerSchema>
