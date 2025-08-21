import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
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
