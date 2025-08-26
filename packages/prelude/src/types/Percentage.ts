import z from "zod"

export const PercentageSchema = z.number()
export type Percentage = z.infer<typeof PercentageSchema>

export const BoundedPercentageSchema = z.number().min(0).max(100)
export type BoundedPercentage = z.infer<typeof BoundedPercentageSchema>
