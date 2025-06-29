import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useCookies } from "react-cookie";
import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark"]).catch("dark");
export type Theme = z.infer<typeof ThemeSchema>;
const cookieName = "theme";

const getThemeFn = createServerFn().handler(
  async (): Promise<Theme> => ThemeSchema.parse(getCookie(cookieName)),
);

export const themeQueryOptions = queryOptions({
  queryKey: [cookieName],
  queryFn: getThemeFn,
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
});

export const useTheme = () => {
  const queryClient = useQueryClient();
  const { data: theme } = useSuspenseQuery(themeQueryOptions);
  const [, setTheme] = useCookies<"theme", Theme>([], {
    doNotUpdate: true,
  });
  const { mutate: toggleTheme } = useMutation({
    mutationKey: ["toggleTheme"],
    mutationFn: async () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(cookieName, newTheme);
      queryClient.setQueryData<Theme>(themeQueryOptions.queryKey, newTheme);
    },
  });
  return { theme, toggleTheme };
};
