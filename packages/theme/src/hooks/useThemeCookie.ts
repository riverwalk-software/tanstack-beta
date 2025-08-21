import { useCookies } from "react-cookie";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import type { CookiesValue } from "../types/CookiesValue";
import type { Theme } from "../types/Theme";

export const useThemeCookie = (): {
  setThemeCookie: (theme: Theme) => void;
} => {
  const [, setCookie] = useCookies<string, CookiesValue>([], {
    doNotUpdate: true,
  });
  const setThemeCookie = (theme: Theme) => setCookie(THEME_COOKIE_NAME, theme);
  return { setThemeCookie };
};
