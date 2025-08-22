import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  themeQueryOptions,
  toggleThemeMutationOptions,
} from "../machines/themeMachine";
import type { Theme } from "../types/Theme";

export const useTheme = (): {
  theme: Theme;
  toggleTheme: () => void;
} => {
  const { data: theme } = useSuspenseQuery(themeQueryOptions);
  const queryClient = useQueryClient();
  const { mutate: toggleTheme } = useMutation(
    toggleThemeMutationOptions(queryClient),
  );
  return { theme, toggleTheme };
};
