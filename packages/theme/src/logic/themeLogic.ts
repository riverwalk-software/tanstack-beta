import { type QueryClient, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import type { useThemeCookie } from "../hooks/useThemeCookie";
import { ThemeSchema } from "../schemas/ThemeSchema";
import type { Theme } from "../types/Theme";

export const themeQueryOptions = queryOptions({
  queryKey: [THEME_COOKIE_NAME],
  queryFn: () => getThemeFn(),
  staleTime: Infinity,
  gcTime: Infinity,
});

const getThemeFn = createServerFn().handler(
  async (): Promise<Theme> => ThemeSchema.parse(getCookie(THEME_COOKIE_NAME)),
);

export const toggleThemeMutationOptions = ({
  theme,
  queryClient,
  setThemeCookie,
}: {
  theme: Theme;
  queryClient: QueryClient;
  setThemeCookie: ReturnType<typeof useThemeCookie>["setThemeCookie"];
}) => ({
  mutationKey: ["toggleTheme"],
  mutationFn: async () => {
    const newTheme = toggleTheme(theme);
    setThemeCookie(newTheme);
    return newTheme;
  },
  onSuccess: (newTheme: Theme) => {
    queryClient.setQueryData<Theme>(themeQueryOptions.queryKey, newTheme);
  },
});

const toggleTheme = (currentTheme: Theme): Theme =>
  currentTheme === "dark" ? "light" : "dark";
