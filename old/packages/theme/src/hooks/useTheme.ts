import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import {
  themeQueryOptions,
  toggleThemeMutationOptions,
} from "../machines/themeMachine"
import type { Theme } from "../types/Theme"

/**
 * React hook to access and mutate the current theme.
 *
 * This hook provides the current theme value and a mutation object
 * for toggling the theme.
 *
 * @returns {Object} An object containing:
 *   - theme: The current theme value (`Theme`).
 *   - toggleThemeMt: A mutation object for toggling the theme.
 *
 * @example
 * const { theme, toggleThemeMt } = useTheme()
 * // To toggle theme:
 * toggleThemeMt.mutate()
 * // To disable button:
 * toggleThemeMt.isPending
 */
export const useTheme = (): {
  theme: Theme
  toggleThemeMt: UseMutationResult<Theme, Error, void, unknown>
} => {
  const { data: theme } = useSuspenseQuery(themeQueryOptions)
  const queryClient = useQueryClient()
  const toggleThemeMt = useMutation(toggleThemeMutationOptions(queryClient))
  return { theme, toggleThemeMt }
}
