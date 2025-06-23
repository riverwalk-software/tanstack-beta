import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark"]).catch("dark");
export type Theme = z.infer<typeof ThemeSchema>;
const cookieName = "theme";

export const getThemeFn = createServerFn().handler(
  async (): Promise<Theme> => ThemeSchema.parse(getCookie(cookieName)),
);

const setThemeFn = createServerFn({ method: "POST" })
  .validator(ThemeSchema)
  .handler(
    async ({ data: theme }): Promise<void> => setCookie(cookieName, theme),
  );

export const toggleThemeFn = createServerFn().handler(
  async (): Promise<void> => {
    const currentTheme = await getThemeFn();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    await setThemeFn({ data: newTheme });
  },
);
