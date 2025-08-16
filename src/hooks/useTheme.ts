import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import {
  THEME_COOKIE_NAME,
  type Theme,
  themeQueryOptions,
} from "@/utils/theme";

export const useTheme = (): Return => {
  const queryClient = useQueryClient();
  const { data: theme } = useSuspenseQuery(themeQueryOptions);
  const [, setTheme] = useCookies<"theme", CookiesValue>([], {
    doNotUpdate: true,
  });
  const { mutate: toggleTheme } = useMutation({
    mutationKey: ["toggleTheme"],
    mutationFn: async () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(THEME_COOKIE_NAME, newTheme);
      queryClient.setQueryData<Theme>(themeQueryOptions.queryKey, newTheme);
    },
  });
  return { theme, toggleTheme };
};

interface State {
  theme: Theme;
}
interface Actions {
  toggleTheme: () => void;
}
interface Return extends State, Actions {}

interface CookiesValue {
  theme: Theme;
}
