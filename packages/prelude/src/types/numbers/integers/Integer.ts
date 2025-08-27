import type z from "zod"
import { RealSchema } from "../reals/Real"

export const IntegerSchema = RealSchema.int().brand("Integer")
export type Integer = z.infer<typeof IntegerSchema>
