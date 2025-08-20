import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark"]).catch("dark");

export type Theme = z.infer<typeof ThemeSchema>;

export const THEME_COOKIE_NAME = "theme";

const getThemeFn = createServerFn().handler(
  async (): Promise<Theme> => ThemeSchema.parse(getCookie(THEME_COOKIE_NAME)),
);

export const themeQueryOptions = queryOptions({
  queryKey: [THEME_COOKIE_NAME],
  queryFn: getThemeFn,
  staleTime: Infinity,
  gcTime: Infinity,
});
