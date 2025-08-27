import type z from "zod"
import { RealSchema } from "./Real"

export const NegativeRealSchema = RealSchema.negative().brand("NegativeReal")
export type NegativeReal = z.infer<typeof NegativeRealSchema>
