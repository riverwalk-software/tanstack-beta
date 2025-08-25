import { type QueryClient, queryOptions } from "@tanstack/react-query";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import { getThemeFn } from "../logic/themeLogic";
import type { Theme } from "../types/Theme";
import { getThemeCookie, toggleThemeCookie } from "./themeCookieMachine";

export const themeQueryOptions = queryOptions({
  queryKey: [THEME_COOKIE_NAME],
  queryFn: getThemeFn,
  staleTime: Infinity,
  gcTime: Infinity,
});

export const toggleThemeMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["toggleTheme"],
  mutationFn: async () => {
    toggleThemeCookie();
    return getThemeCookie();
  },
  onSuccess: (newTheme: Theme) => {
    queryClient.setQueryData(themeQueryOptions.queryKey, newTheme);
  },
});
