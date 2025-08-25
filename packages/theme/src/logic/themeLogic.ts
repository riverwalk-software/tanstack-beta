import { conjugate, not, pipe } from "@prelude";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import { ThemeSchema } from "../schemas/ThemeSchema";
import type { Theme } from "../types/Theme";
import { themeBooleanBijection } from "./themeBooleanLogic";

export const getThemeFn = createServerFn().handler(
  async (): Promise<Theme> => ThemeSchema.parse(getCookie(THEME_COOKIE_NAME)),
);

export const toggleTheme = (theme: Theme): Theme =>
  pipe(theme, conjugate(themeBooleanBijection)(not));
