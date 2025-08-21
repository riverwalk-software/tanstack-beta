import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { THEME_COOKIE_NAME } from "../constants/THEME_COOKIE_NAME";
import { themeQueryOptions } from "../machines/themeMachine";
import type { CookiesValue } from "../types/CookiesValue";
import type { Theme } from "../types/Theme";

export const useTheme = (): {
  theme: Theme;
  toggleTheme: () => void;
} => {
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
