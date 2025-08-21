import z from "zod";

export const ThemeSchema = z.enum(["light", "dark"]).catch("dark");
