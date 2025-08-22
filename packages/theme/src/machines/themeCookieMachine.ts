import { cookies } from "@cookies";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import type { Theme } from "../types/Theme";

export const setThemeCookie = (theme: Theme): void => {
  cookies.set(THEME_COOKIE_NAME, theme);
};
