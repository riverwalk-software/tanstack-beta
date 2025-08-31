import { Schema } from "effect"
import { ProgressSchema } from "./Progress"

export class ProgressData extends Schema.Class<ProgressData>("ProgressData")({
  progress: ProgressSchema,
  isComplete: Schema.Boolean,
}) {}
