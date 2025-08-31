import { type QueryClient, queryOptions } from "@tanstack/react-query"
import { pipe, Schema } from "effect"
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME"
import { getThemeFn } from "../logic/themeLogic"
import { type Theme, ThemeSchema } from "../types/Theme"
import { getThemeCookie, toggleThemeCookie } from "./themeCookieMachine"

export const themeQueryOptions = queryOptions({
  queryKey: [THEME_COOKIE_NAME],
  queryFn: getThemeFn,
  select: data => Schema.decodeSync(ThemeSchema)(data),
  staleTime: Infinity,
  gcTime: Infinity,
})

export const toggleThemeMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["toggleTheme"],
  mutationFn: () => Promise.resolve(pipe(toggleThemeCookie(), getThemeCookie)),
  onSuccess: (newTheme: Theme) => {
    queryClient.setQueryData(themeQueryOptions.queryKey, newTheme)
  },
})
