import type z from "zod"
import { RealSchema } from "./Real"

export const PercentageSchema = RealSchema.brand("Percentage")
export type Percentage = z.infer<typeof PercentageSchema>
