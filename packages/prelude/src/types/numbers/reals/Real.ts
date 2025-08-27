import z from "zod"

export const RealSchema = z.number() // No need for brand
export type Real = z.infer<typeof RealSchema>
