import type z from "zod"
import type { ThemeSchema } from "../schemas/ThemeSchema"

export type Theme = z.infer<typeof ThemeSchema>
