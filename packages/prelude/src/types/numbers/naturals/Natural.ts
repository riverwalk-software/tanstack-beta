import type z from "zod"
import { IntegerSchema } from "../integers/Integer"

export const NaturalSchema = IntegerSchema.nonnegative().brand("Natural")
export type Natural = z.infer<typeof NaturalSchema>
