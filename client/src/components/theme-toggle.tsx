import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="shrink-0"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" data-testid="icon-moon" />
      ) : theme === "light" ? (
        <Sun className="h-5 w-5" data-testid="icon-sun" />
      ) : (
        <Sun className="h-5 w-5 opacity-50" data-testid="icon-sun-system" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
