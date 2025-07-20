import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/utils/theme";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      disabled={false}
      variant="ghost"
      size="icon"
      onClick={() => toggleTheme()}
    >
      <Sun className="!h-[1.2rem] !w-[1.2rem] dark:-rotate-90 rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="!h-[1.2rem] !w-[1.2rem] absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
