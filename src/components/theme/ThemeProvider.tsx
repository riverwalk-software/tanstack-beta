import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, use } from "react";
import { type Theme, toggleThemeFn } from "@/utils/theme";

type ThemeContextType = { theme: Theme; toggleTheme: () => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter();
  const toggleTheme = async (): Promise<void> => {
    await toggleThemeFn();
    router.invalidate();
  };
  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const themeContext = use(ThemeContext);
  if (!themeContext)
    throw new Error("'useTheme' called outside of ThemeProvider");
  return themeContext;
}
