import { BoundedPercentageSchema } from "packages/prelude/src/types/numbers/reals/BoundedPercentage"
import type z from "zod"

export const ProgressSchema = BoundedPercentageSchema.brand("Progress")
export type Progress = z.infer<typeof ProgressSchema>
