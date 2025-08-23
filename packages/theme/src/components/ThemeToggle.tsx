import { Moon, Sun } from "lucide-react";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/useTheme";

/**
 * A button component that toggles between light and dark themes.
 *
 * Displays a sun icon for light mode and a moon icon for dark mode,
 * with smooth transitions between the two. Uses the `useTheme` hook
 * to access the `toggleThemeMt` function, which switches the theme.
 *
 * @returns {JSX.Element} The rendered theme toggle button.
 */
export function ThemeToggle(): JSX.Element {
  const { toggleThemeMt } = useTheme();
  return (
    <Button
      disabled={toggleThemeMt.isPending}
      variant="ghost"
      size="icon"
      onClick={() => toggleThemeMt.mutate()}
    >
      <Sun className="!h-[1.2rem] !w-[1.2rem] dark:-rotate-90 rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="!h-[1.2rem] !w-[1.2rem] absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
