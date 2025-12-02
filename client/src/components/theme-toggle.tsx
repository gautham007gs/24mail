import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Simple toggle: dark <-> light
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="shrink-0 transition-all"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 transition-all duration-300" data-testid="icon-moon" aria-hidden="true" />
      ) : (
        <Sun className="h-5 w-5 transition-all duration-300" data-testid="icon-sun" aria-hidden="true" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
