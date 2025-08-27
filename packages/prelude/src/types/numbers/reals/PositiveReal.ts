import type z from "zod"
import { RealSchema } from "./Real"

export const PositiveRealSchema = RealSchema.positive().brand("PositiveReal")
export type PositiveReal = z.infer<typeof PositiveRealSchema>
