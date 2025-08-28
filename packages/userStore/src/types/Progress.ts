import { BoundedPercentageSchema } from "packages/prelude/src/types/numbers/reals/BoundedPercentage"

export const ProgressSchema = BoundedPercentageSchema.brand("Progress")
type Progress = typeof Progress.Type
