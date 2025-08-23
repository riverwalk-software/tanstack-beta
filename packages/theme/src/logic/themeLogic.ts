import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { match } from "ts-pattern";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import { ThemeSchema } from "../schemas/ThemeSchema";
import type { Theme } from "../types/Theme";

export const getThemeFn = createServerFn().handler(
  async (): Promise<Theme> => ThemeSchema.parse(getCookie(THEME_COOKIE_NAME)),
);

export const toggleTheme = (theme: Theme): Theme =>
  match(theme)
    .returnType<Theme>()
    .with("dark", () => "light")
    .with("light", () => "dark")
    .exhaustive();
