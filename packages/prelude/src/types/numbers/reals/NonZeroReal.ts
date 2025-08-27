import type z from "zod"
import { RealSchema } from "./Real"

export const NonZeroRealSchema = RealSchema.refine(n => n !== 0, {
  message: "Number must be a non-zero real",
}).brand("NonZeroReal")
export type NonZeroReal = z.infer<typeof NonZeroRealSchema>
