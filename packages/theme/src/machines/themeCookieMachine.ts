import { cookies } from "@cookies";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import { ThemeSchema } from "../schemas/ThemeSchema";
import type { Theme } from "../types/Theme";

export const getThemeCookie = (): Theme => {
  const value = cookies.get(THEME_COOKIE_NAME);
  return ThemeSchema.parse(value);
};

export const setThemeCookie = (theme: Theme): void => {
  cookies.set(THEME_COOKIE_NAME, theme);
};
