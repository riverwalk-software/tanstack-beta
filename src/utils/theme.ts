import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const cookieName = "ui-theme";
const ThemeSchema = z.enum(["light", "dark"]);
export type Theme = z.infer<typeof ThemeSchema>;

export const getThemeFn = createServerFn().handler(
  async () => (getCookie(cookieName) || "dark") as Theme,
);

export const setThemeFn = createServerFn({ method: "POST" })
  .validator(ThemeSchema)
  .handler(async ({ data: theme }) => setCookie(cookieName, theme));
