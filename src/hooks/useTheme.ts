import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useCookies } from "react-cookie";
import {
  THEME_COOKIE_NAME,
  type Theme,
  themeQueryOptions,
} from "@/utils/theme";

export const useTheme = (): Return => {
  const { data: theme } = useSuspenseQuery(themeQueryOptions);
  const state = {
    theme,
  } satisfies State;

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
  const mutations = {
    toggleTheme,
  } satisfies Mutations;

  return useMemo(() => ({ ...state, ...mutations }), [state, mutations]);
};

interface State {
  theme: Theme;
}
interface Mutations {
  toggleTheme: () => void;
}
interface Return extends State, Mutations {}

interface CookiesValue {
  theme: Theme;
}
