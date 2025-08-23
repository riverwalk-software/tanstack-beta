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

/**
 * Custom React hook to access and toggle the current theme.
 *
 * This hook provides the current theme value and a function to toggle between themes.
 * It uses TanStack Query's `useSuspenseQuery` to retrieve the theme and `useMutation`
 * to handle theme toggling, ensuring state is kept in sync with the query client.
 *
 * @returns An object containing:
 * - `theme`: The current theme value.
 * - `toggleTheme`: A function to toggle the theme.
 */
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
