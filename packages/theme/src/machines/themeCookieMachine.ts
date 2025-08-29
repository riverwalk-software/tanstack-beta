import { getCookie, setCookie } from "@cookies"
import { flow, Option, Schema } from "effect"
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME"
import { toggleTheme } from "../logic/themeLogic"
import { type Theme, ThemeSchema } from "../types/Theme"

export const getThemeCookie: () => Theme = flow(
  () => getCookie(THEME_COOKIE_NAME),
  Option.flatMap(Schema.decodeUnknownOption(ThemeSchema)),
  Option.getOrElse(() => ThemeSchema.make("dark")),
)

export const _setThemeCookie: (theme: Theme) => void =
  setCookie(THEME_COOKIE_NAME)

export const toggleThemeCookie: () => void = flow(
  getThemeCookie,
  toggleTheme,
  _setThemeCookie,
)
