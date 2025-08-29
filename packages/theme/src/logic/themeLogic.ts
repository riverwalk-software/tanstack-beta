import { not } from "@prelude"
import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { Effect, Schema } from "effect"
import { effectRunPromise2 } from "@/utils/effect"
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME"
import {
  conjugateThemeFromBoolean,
  type Theme,
  ThemeSchema,
} from "../types/Theme"

export const getThemeFn = createServerFn().handler(
  (): Promise<typeof ThemeSchema.Encoded> => {
    const program = Effect.gen(function* () {
      const cookie = yield* Effect.sync(() => getCookie(THEME_COOKIE_NAME))
      return yield* Schema.decodeUnknown(ThemeSchema)(cookie)
    }).pipe(Effect.catchAll(() => Effect.succeed(ThemeSchema.make("dark"))))
    return effectRunPromise2({ program })
  },
)

export const toggleTheme: (theme: Theme) => Theme =
  conjugateThemeFromBoolean(not)
