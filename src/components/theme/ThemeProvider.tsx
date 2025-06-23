import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, use } from "react";
import { setThemeFn, type Theme } from "@/utils/theme";

type ThemeContextType = { theme: Theme; setTheme: (theme: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter();
  const setTheme = async (theme: Theme) => {
    await setThemeFn({ data: theme });
    await router.invalidate({ sync: true });
  };
  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const themeContext = use(ThemeContext);
  if (!themeContext)
    throw new Error("'useTheme' called outside of ThemeProvider");
  return themeContext;
}
