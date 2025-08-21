import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  themeQueryOptions,
  toggleThemeMutationOptions,
} from "../logic/themeLogic";
import type { Theme } from "../types/Theme";
import { useThemeCookie } from "./useThemeCookie";

export const useTheme = (): {
  theme: Theme;
  toggleTheme: () => void;
} => {
  const { data: theme } = useSuspenseQuery(themeQueryOptions);
  const { setThemeCookie } = useThemeCookie();
  const queryClient = useQueryClient();
  const { mutate: toggleTheme } = useMutation(
    toggleThemeMutationOptions({ theme, setThemeCookie, queryClient }),
  );
  return { theme, toggleTheme };
};
