import z from "zod"

export const ThemeSchema = z.enum(["dark", "light"]).catch("dark")
