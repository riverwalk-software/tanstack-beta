import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { THEME_COOKIE_NAME, type Theme, themeQueryOptions } from "@/lib/theme";

export const useTheme = (): Return => {
  const { data: theme } = useSuspenseQuery(themeQueryOptions);
  const queryClient = useQueryClient();
  const [, setTheme] = useCookies<"theme", CookiesValue>([], {
    doNotUpdate: true,
  });
  const { mutate: toggleTheme } = useMutation({
    mutationKey: ["toggleTheme"],
    mutationFn: async () => {
      const newTheme: Theme = theme === "dark" ? "light" : "dark";
      setTheme(THEME_COOKIE_NAME, newTheme);
      queryClient.setQueryData<Theme>(themeQueryOptions.queryKey, newTheme);
    },
  });

  return { theme, toggleTheme };
};

interface Return {}

interface CookiesValue {
  theme: Theme;
}
