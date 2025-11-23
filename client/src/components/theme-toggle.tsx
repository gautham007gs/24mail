import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
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
      className={`shrink-0 ${isAnimating ? "theme-toggle-animating" : ""}`}
      title={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} theme`}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 transition-transform duration-300" data-testid="icon-moon" />
      ) : theme === "light" ? (
        <Sun className="h-5 w-5 transition-transform duration-300" data-testid="icon-sun" />
      ) : (
        <Sun className="h-5 w-5 opacity-50 transition-opacity duration-300" data-testid="icon-sun-system" />
      )}
      <span className="sr-only">Toggle theme - Current: {theme}</span>
    </Button>
  );
}
